/* eslint-disable no-console */
if (process.version < 'v20') throw new Error('This script requires Node.js v20 or higher.');

import chalk from 'chalk';
import { watch } from 'chokidar';
// eslint-plugin-import doesn't support the "exports" field in package.json, yet (https://github.com/import-js/eslint-plugin-import/issues/1810).
// eslint-disable-next-line import/no-unresolved
import { stringify } from 'csv/sync';
import { readFile, writeFile } from 'fs/promises';
import { register } from 'module';
import pMap, { pMapSkip } from 'p-map';
import { resolve } from 'path';
import { isMainThread, parentPort, Worker, workerData } from 'worker_threads';
import type { Adapter } from '../src/index';
import { csvPath, errorPath, getArchivedUrls, getArchiveErrors, getReasoningUrlsFromAdapters } from './lib/archiving';
import type { ArchiveOrgAuth } from './lib/wayback';
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

const configPath = './archive-config.json';

const archiveUrls = async (waybackAuth: ArchiveOrgAuth, adapters: Adapter[]) => {
    const { archivedUrls, archivedDataPaths, archivedUrlEntries } = await getArchivedUrls();

    const reasoningURLs = await getReasoningUrlsFromAdapters(adapters);

    const archiveErrors = await getArchiveErrors();

    const newURLs = await pMap(
        Object.entries(reasoningURLs),
        async ([url, dataPaths]) => {
            const unarchivedPaths = archivedUrls.has(url)
                ? dataPaths.filter((path) => !archivedDataPaths[url].has(path))
                : dataPaths;

            if (unarchivedPaths.length < 1) return pMapSkip;
            else if (Object.keys(archiveErrors).includes(url)) {
                // Do an exponential backoff for retries and retry after 15, 30, 60, 120 and 240 minutes
                const whenToTryNext = archiveErrors[url].lastTried + 2 ** archiveErrors[url].try * 750000;
                if (whenToTryNext > new Date().getTime() && !errorsToRetry.includes(archiveErrors[url].error.type))
                    return pMapSkip;
            }

            try {
                const savePageResult = await captureAndWait(url, waybackAuth, {
                    skipFirstArchive: true,
                });

                delete archiveErrors[url];
                console.info(chalk.green(`Archived "${url}" for ${unarchivedPaths.join(', ')}.`));

                return {
                    originalUrl: url,
                    archivedUrl: savePageResult.captureUrl,
                    timestamp: archiveOrgTimestampToDate(savePageResult.captureStatus.timestamp),
                    referringDataPaths: new Set(unarchivedPaths),
                };
            } catch (e) {
                if (isCaptureFailedException(e)) {
                    console.error(
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
        { concurrency: 3 }
    );

    if (newURLs.length > 0) {
        await writeFile(
            csvPath,
            stringify([...archivedUrlEntries, ...newURLs], {
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
};

const workerTask = async (workerData: { waybackAuth: ArchiveOrgAuth; path: string }) => {
    register('tsx/esm', import.meta.url);
    try {
        // The import might fail because the syntax is invalid. We don't want to crash the whole process because of that.
        const adapterModule = await import(`${resolve('.', workerData.path)}?version=${new Date().getTime()}`);
        if (adapterModule.adapters) await archiveUrls(workerData.waybackAuth, adapterModule.adapters);
        parentPort?.postMessage('archive-worker:success');
    } catch (e) {
        console.error(
            chalk.bold.red('Error while parsing adapter at ') + chalk.red(workerData.path) + chalk.bold.red(': \n'),
            chalk.red(e.toString())
        );
        parentPort?.postMessage('archive-worker:parse-error');
    }
};

class ArchiveQueue {
    // We use a Set so that we don’t run multiple times on the same file because multiple changes were registered in a short time.
    private _queue: Set<string>;
    private waybackAuth: ArchiveOrgAuth;
    isIdle: boolean;

    constructor(waybackAuth: ArchiveOrgAuth) {
        this._queue = new Set();
        this.waybackAuth = waybackAuth;
        this.isIdle = true;
    }

    add(path: string) {
        // We delete and readd the value so that it is moved to the end of the queue
        this._queue.delete(path);
        this._queue.add(path);

        if (this.isIdle) this.startNext();
    }

    startNext() {
        this.isIdle = false;
        const nextPath = this._queue[Symbol.iterator]().next();
        if (nextPath.done) {
            this.isIdle = true;
            return;
        }
        this._queue.delete(nextPath.value);

        const worker = new Worker(new URL(import.meta.url), {
            workerData: { path: nextPath.value, waybackAuth: this.waybackAuth },
        });

        worker.on('message', (result) => {
            if (result === 'archive-worker:success') this.startNext();
            else if (result === 'archive-worker:parse-error') this.startNext();
        });

        worker.on('error', (e) => {
            throw e;
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                throw new Error(`Worker stopped with exit code ${code}`);
            }
        });
    }
}

if (isMainThread)
    (async () => {
        const config = (await readFile(configPath, 'utf-8')
            .then(JSON.parse)
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .catch(() => {})) as { waybackAuth?: ArchiveOrgAuth } | undefined;
        if (!config?.waybackAuth)
            throw new Error(
                'Please provide your archive.org credentials in archive-config.json. You can find them at https://archive.org/account/s3.php.'
            );
        const waybackAuth = config.waybackAuth;

        const archiveQueue = new ArchiveQueue(waybackAuth);

        const watcher = watch('src/adapters/**/*.ts', { awaitWriteFinish: true });
        watcher.on('add', (path) => archiveQueue.add(path));
        watcher.on('change', (path) => archiveQueue.add(path));
    })();
else workerTask(workerData);
/* eslint-enable no-console */
