/* eslint-disable no-console */
import { fetch } from 'cross-fetch';
import deepmerge from 'deepmerge';
import { writeFile } from 'fs/promises';
import { adapterForRequest, decodeRequest, processRequest, type Request } from '../src';
import { allAdapters } from '../src/common/adapters';

const adapterArgument = process.argv[2];
if (!adapterArgument) throw new Error('You need to specify the adapter as the only argument.');

// Due to the problems described in https://github.com/tweaselORG/meta/issues/33#issuecomment-1663825083, we can
// unfortunately not use the live instance for that at the moment.
const datasetteHost = 'http://localhost:8001';

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
    let nextUrl = `${datasetteHost}/data/requests.json?_shape=objects&_where=${encodeURIComponent(
        whereClause
    )}&_json=headers&_json=cookies&_size=max&_nocol=initiator&_nocol=platform&_nocol=runType&_nofacet=1&_nosuggest=1&_nocount=1`;
    while (nextUrl) {
        const res = await fetch(nextUrl).then((r) => r.json());
        requests.push(...res.rows);
        nextUrl = res.next_url;
    }

    // The endpoint URLs may be the same for multiple adapters, so we still need to filter the requests.
    const requestsForAdapter = requests.filter((r) => {
        const a = adapterForRequest(r);
        return a && a.slug === adapter.slug && a.tracker.slug === adapter.tracker.slug;
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
    for (const r of adapterResults) {
        console.dir(r, { depth: null });
        console.log();
    }
    await writeFile(`merged-decoded-requests.tmp.json`, JSON.stringify(deepmerge.all(decodingResults), null, 4));
})();
/* eslint-enable no-console */
