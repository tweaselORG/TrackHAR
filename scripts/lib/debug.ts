import { Buffer } from 'buffer/index.js';
import { fetch } from 'cross-fetch';
import deepmerge from 'deepmerge';
import { adapterForRequest, decodeRequest, processRequest, type Adapter, type Request } from '../../src';

export const debugAdapter = async (adapter: Adapter, options?: { accumulateToPath?: boolean; rowLimit?: number }) => {
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
    )}&_json=headers&_json=cookies&_nocol=initiator&_nocol=platform&_nocol=runType&_nofacet=1&_nosuggest=1&_nocount=1&_size=${
        options?.rowLimit || 'max'
    }`;
    while (nextUrl && options?.rowLimit && requests.length < options?.rowLimit) {
        const res = await fetch(nextUrl).then((r) => r.json());
        requests.push(...res.rows);
        nextUrl = res.next_url;
    }

    const requestsForAdapter = requests
        // And if the content is binary, Datasette encodes it as base64
        // (https://docs.datasette.io/en/stable/binary_data.html).
        .map((r) => {
            const content = r.content as string | { $base64: true; encoded: string } | undefined;
            if (content && typeof content !== 'string' && content['$base64'] === true)
                r.content = Buffer.from(content.encoded, 'base64').toString('binary');
            return r;
        })
        // The endpoint URLs may be the same for multiple adapters, so we still need to filter the requests.
        .filter((r) => {
            const a = adapterForRequest(r);
            return a && a.slug === adapter.slug && a.tracker.slug === adapter.tracker.slug;
        });

    // We want both the decoding and the full adapter result, so we unfortunately need to run the decoding twice (once
    // manually, once through the adapter). Luckily, the decoding is fast.
    const decodingResults = requestsForAdapter.map((r) => decodeRequest(r, adapter.decodingSteps));
    const reduction = options?.accumulateToPath
        ? (acc, cur) => ({
              ...acc,
              [`${cur.property}/${cur.context}/${cur.path}`]: acc[`${cur.property}/${cur.context}/${cur.path}`]?.concat(
                  cur.value
              ) || [cur.value],
          })
        : (acc, cur) => ({
              ...acc,
              [cur.property]: acc[cur.property]?.concat(cur.value) || [cur.value],
          });
    const adapterResults = requestsForAdapter.map((r) =>
        processRequest(r)?.reduce<Record<string, unknown[]>>(reduction, {})
    );

    return { adapterResults, decodingResults };
};

export const mergeAdapterResults = (adapterResults: (Record<string, unknown[]> | undefined)[]) => {
    const mergedResult = deepmerge.all(adapterResults.filter(Boolean) as Record<string, unknown[]>[]);
    for (const key of Object.keys(mergedResult)) mergedResult[key] = [...new Set(mergedResult[key] as unknown[])];
    return mergedResult;
};
