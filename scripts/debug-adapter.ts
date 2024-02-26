/* eslint-disable no-console */
import { Buffer } from 'buffer/';
import { fetch } from 'cross-fetch';
import deepmerge from 'deepmerge';
import { writeFile } from 'fs/promises';
import { adapterForRequest, decodeRequest, processRequest, type Request } from '../src';
import { allAdapters } from '../src/common/adapters';

const adapterArgument = process.argv[2];
if (!adapterArgument) throw new Error('You need to specify the adapter as the first argument.');

const mergeResult = process.argv.includes('--merge-result');

(async () => {
    const [trackerSlug, adapterSlug] = adapterArgument.split('/');
    const adapter = allAdapters.find((a) => a.tracker.slug === trackerSlug && a.slug === adapterSlug);
    if (!adapter) throw new Error(`Adapter ${adapterSlug} not found.`);

    // Fetch requests from Datasette.
    const adapterClauses = adapter.endpointUrls.map((u) =>
        u instanceof RegExp
            ? `endpointUrl regexp '${
                  // JS escapes slashes in regexes, but sqlite-regex doesn't accept that.
                  u.source.replace(/\\\//g, '/')
              }'`
            : `endpointUrl = '${u}'`
    );
    const whereClause = `endpointUrl is not null and (${adapterClauses.join(' or ')})`;

    const requests: Request[] = [];
    let nextUrl = `https://data.tweasel.org/data/requests.json?_shape=objects&_where=${encodeURIComponent(
        whereClause
    )}&_json=headers&_json=cookies&_size=max&_nocol=initiator&_nocol=platform&_nocol=runType&_nofacet=1&_nosuggest=1&_nocount=1`;
    while (nextUrl) {
        const res = await fetch(nextUrl).then((r) => r.json());
        requests.push(...res.rows);
        nextUrl = res.next_url;
    }

    const requestsForAdapter = requests
        // The endpoint URLs may be the same for multiple adapters, so we still need to filter the requests.
        .filter((r) => {
            const a = adapterForRequest(r);
            return a && a.slug === adapter.slug && a.tracker.slug === adapter.tracker.slug;
        })
        // And if the content is binary, Datasette encodes it as base64
        // (https://docs.datasette.io/en/stable/binary_data.html).
        .map((r) => {
            const content = r.content as string | { $base64: true; encoded: string } | undefined;
            if (content && typeof content !== 'string' && content['$base64'] === true)
                r.content = Buffer.from(content.encoded, 'base64').toString('binary');
            return r;
        });

    // We want both the decoding and the full adapter result, so we unfortunately need to run the decoding twice (once
    // manually, once through the adapter). Luckily, the decoding is fast.
    const decodingResults = requestsForAdapter.map((r) => decodeRequest(r, adapter.decodingSteps));
    const adapterResults = requestsForAdapter.map((r) =>
        processRequest(r)?.reduce<Record<string, unknown[]>>(
            (acc, cur) => ({
                ...acc,
                [cur.property]: acc[cur.property]?.concat(cur.value) || [cur.value],
            }),
            {}
        )
    );

    // We print the adapter results to the console and save the deepmerged decoding results to a file.
    if (mergeResult) {
        const mergedResult = deepmerge.all(adapterResults.filter(Boolean) as Record<string, unknown>[]);
        for (const key of Object.keys(mergedResult)) mergedResult[key] = [...new Set(mergedResult[key] as unknown[])];
        console.dir(mergedResult, { depth: null });
    } else {
        for (const r of adapterResults) {
            console.dir(r, { depth: null });
            console.log();
        }
    }
    await writeFile(`merged-decoded-requests.tmp.json`, JSON.stringify(deepmerge.all(decodingResults), null, 4));
})();
/* eslint-enable no-console */
