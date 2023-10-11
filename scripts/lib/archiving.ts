// eslint-plugin-import doesn't support the "exports" field in package.json, yet (https://github.com/import-js/eslint-plugin-import/issues/1810).
// eslint-disable-next-line import/no-unresolved
import { parse } from 'csv/sync';
import { readFile } from 'fs/promises';
import type { Adapter } from '../../src';
import type { CaptureFailedException } from './wayback';

export const csvPath = './research-docs/archived-urls.csv';
export const errorPath = './research-docs/archive-errors.json';

export type ArchivedUrlEntry = {
    originalUrl: string;
    archivedUrl: string;
    timestamp: Date;
    referringDataPaths: Set<string>;
};

export const getArchivedUrls = async () => {
    const urlFile = await readFile(csvPath, 'utf-8');
    const archivedUrlEntries = parse(urlFile, {
        bom: true,
        delimiter: ',',
        columns: true,
        cast: (value, context) => {
            if (context.column === 'referringDataPaths') return new Set(value.split(';'));
            else if (context.column === 'timestamp') return new Date(value);
            return value;
        },
    }) as ArchivedUrlEntry[];

    const archivedUrls = new Set<string>();
    const archivedDataPaths = archivedUrlEntries.reduce((acc: Record<string, Set<string>>, cur) => {
        archivedUrls.add(cur.originalUrl);
        // We save the data paths as a Set to avoid duplicates (e.g. if a URL has been archived twice for a data path) and because of the performance benefit when we check if a data path is already archived.
        acc[cur.originalUrl] = new Set([...(acc[cur.originalUrl] || []), ...cur.referringDataPaths]);
        return acc;
    }, {});

    return { archivedUrls, archivedDataPaths, archivedUrlEntries };
};

const linkRegex = /^https?:\/\//;

export const getAllDataPathsFromAdapters = (adapters: Adapter[]) =>
    adapters
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
        .flat();

export const getReasoningUrlsFromAdapters = async (adapters: Adapter[]) =>
    getAllDataPathsFromAdapters(adapters)
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

export const getArchiveErrors = async () =>
    (await readFile(errorPath, 'utf-8')
        .catch((e) => {
            if (e.code === 'ENOENT') return '{}';
            throw e;
        })
        .then(JSON.parse)) as Record<
        string,
        { try: number; lastTried: number; error: ReturnType<CaptureFailedException['toJSON']> }
    >;
