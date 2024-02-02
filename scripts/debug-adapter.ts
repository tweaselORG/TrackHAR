/* eslint-disable no-console */
import deepmerge from 'deepmerge';
import { writeFile } from 'fs/promises';
import { allAdapters } from '../src/common/adapters';
import { loadTestDataFromDb, mergeTestDataResults } from './lib/test-data';

const adapterArgument = process.argv[2];
if (!adapterArgument) throw new Error('You need to specify the adapter as the first argument.');

const mergeResult = process.argv.includes('--merge-result');

(async () => {
    const [trackerSlug, adapterSlug] = adapterArgument.split('/');
    const adapter = allAdapters.find((a) => a.tracker.slug === trackerSlug && a.slug === adapterSlug);
    if (!adapter) throw new Error(`Adapter ${adapterSlug} not found.`);

    const { adapterResults, decodingResults } = await loadTestDataFromDb(adapter);

    // We print the adapter results to the console and save the deepmerged decoding results to a file.
    if (mergeResult) {
        console.dir(mergeTestDataResults(adapterResults), { depth: null });
    } else {
        for (const r of adapterResults) {
            console.dir(r, { depth: null });
            console.log();
        }
    }

    await writeFile(`merged-decoded-requests.tmp.json`, JSON.stringify(deepmerge.all(decodingResults), null, 4));
})();
/* eslint-enable no-console */
