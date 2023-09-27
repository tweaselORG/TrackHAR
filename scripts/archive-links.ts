/* eslint-disable no-console */

import chalk from 'chalk';
// eslint-disable-next-line import/no-unresolved
import { parse, stringify } from 'csv/sync';
import { readFile, writeFile } from 'fs/promises';
import pMap, { pMapSkip } from 'p-map';
import { adapters } from '../src/index';
import type { ArchiveOrgAuth, CaptureFailedException } from './lib/wayback';
import {
    archiveOrgTimestampToDate,
    captureAndWait,
    isCaptureFailedException,
    isCapturePendingException,
} from './lib/wayback';

/** These errors thrown by the Wayback Machine API are considered temporary and will be retried. */
const errorsToRetry = [
    'error:proxy-error',
    'error:job-failed',
    'error:protocol-error',
    'error:read-timeout',
    'error:soft-time-limit-exceed',
    'error:too-many-requests',
    'error:user-session-limit',
    'error:no-browsers-available',
    'error:invalid-server-response',
    'error:internal-server-error',
    'error:celery',
    'error:cannot-fetch',
    'error:capture-location-error',
    'error:browsing-timeout',
    'error:bandwidth-limit-exceeded',
];
const csvPath = './research-docs/archived-urls.csv';
const errorPath = './research-docs/archive-errors.json';
const configPath = './archive-config.json';

type ArchivedUrlEntry = {
    originalUrl: string;
    archivedUrl: string;
    timestamp: Date;
    referringDataPaths: Set<string>;
};

(async () => {
    const config = await readFile(configPath, 'utf-8').then(JSON.parse);
    if (!config.waybackAuth)
        throw new Error(
            'Please provide your archive.org credentials in archive-config.json. You can find them at https://archive.org/account/s3.php.'
        );
    const waybackAuth = config.waybackAuth as ArchiveOrgAuth;

    const linkRegex = /^https?:\/\//;

    const urlFile = await readFile(csvPath, 'utf-8');
    const urlCsv = parse(urlFile, {
        bom: true,
        delimiter: ',',
        columns: true,
        cast: (value, context) => {
            if (context.column === 'referringDataPaths') return new Set(value.split(';'));
            else if (context.column === 'timestamp') return new Date(value);
            return value;
        },
    }) as ArchivedUrlEntry[];

    const archivedURLs = new Set<string>();
    const archivedDataPaths = urlCsv.reduce((acc: Record<string, Set<string>>, cur) => {
        console.log(cur);
        archivedURLs.add(cur.originalUrl);
        // We save the data paths as a Set to avoid duplicates (e.g. if a URL has been archived twice for a data path) and because of the performance benefit when we check if a data path is already archived.
        acc[cur.originalUrl] = new Set([...(acc[cur.originalUrl] || []), ...cur.referringDataPaths]);
        return acc;
    }, {});

    const reasoningURLs = adapters
        // Get all data paths from all adapters
        .map((adapter) =>
            Object.entries(adapter.containedDataPaths)
                .map(([property, paths]) =>
                    (Array.isArray(paths) ? paths : [paths]).map(
                        (p) => [`${adapter.tracker.slug}/${adapter.slug}`, property, p] as const
                    )
                )
                .flat()
        )
        .flat()
        // Filter out data paths that don't have an external link in their reasoning
        .filter((dataPath) => linkRegex.test(dataPath[2].reasoning))
        // Group by the reasoning URL
        .reduce((acc: Record<string, string[]>, dataPath) => {
            const url = new URL(dataPath[2].reasoning);
            // Remove the fragment from the url to reduce the amount of requests to the Internet Archive
            url.hash = '';
            acc[url.toString()] = [...(acc[url.toString()] || []), `${dataPath[0]}#${dataPath[1]}`];
            return acc;
        }, {});

    const archiveErrors = (await readFile(errorPath, 'utf-8')
        .catch((e) => {
            if (e.code === 'ENOENT') return '{}';
            throw e;
        })
        .then(JSON.parse)) as Record<
        string,
        { try: number; lastTried: number; error: ReturnType<CaptureFailedException['toJSON']> }
    >;

    const newURLs = await pMap(
        Object.entries(reasoningURLs),
        async ([url, dataPaths]) => {
            const unarchivedPaths = archivedURLs.has(url)
                ? dataPaths.filter((path) => !archivedDataPaths[url].has(path))
                : dataPaths;

            console.log(unarchivedPaths);

            if (unarchivedPaths.length < 1) return pMapSkip;
            else if (Object.keys(archiveErrors).includes(url)) {
                // Do an exponential backoff for retries and retry after 15, 30, 60, 120 and 240 minutes
                const whenToTryNext = archiveErrors[url].lastTried + 2 ** archiveErrors[url].try * 750000;
                if (whenToTryNext > new Date().getTime() && !errorsToRetry.includes(archiveErrors[url].error.type))
                    return pMapSkip;
            }

            try {
                console.info(`Archiving ${url}...`);
                const savePageResult = await captureAndWait(url, waybackAuth, {
                    skipFirstArchive: true,
                });

                delete archiveErrors[url];
                return {
                    originalUrl: url,
                    archivedUrl: savePageResult.captureUrl,
                    timestamp: archiveOrgTimestampToDate(savePageResult.captureStatus.timestamp),
                    referringDataPaths: new Set(unarchivedPaths),
                };
            } catch (e) {
                if (isCaptureFailedException(e)) {
                    console.warn(
                        chalk.bold.red(`Error while archiving "${url}": \n ${e.message}`) +
                            chalk.red(`\n -> Affected data paths: ${unarchivedPaths.join(', ')}`)
                    );
                    archiveErrors[url] = {
                        try: archiveErrors[url]?.try + 1 || 1,
                        lastTried: new Date().getTime(),
                        error: e.toJSON(),
                    };
                } else if (isCapturePendingException(e)) {
                    console.warn(
                        chalk.bold.yellow(`Timed out while waiting for archiving status of "${url}".`) +
                            chalk.yellow(`\n -> Affected data paths: ${unarchivedPaths.join(', ')}`)
                    );
                } else throw e;
            }

            // Exclude empty results
            return pMapSkip;
        },
        { concurrency: 5 }
    );

    if (newURLs.length > 0) {
        await writeFile(
            csvPath,
            stringify([...urlCsv, ...newURLs], {
                quoted: true,
                header: true,
                columns: ['originalUrl', 'archivedUrl', 'timestamp', 'referringDataPaths'],
                cast: {
                    object: (value) => (value instanceof Set ? [...value].join(';') : JSON.stringify(value)),
                    date: (value) => value.toISOString(),
                },
            })
        );
    }
    await writeFile(errorPath, JSON.stringify(archiveErrors, null, 4));
})();
/* eslint-enable no-console */
