import { writeFile } from 'fs/promises';
import { allAdapters } from '../src/common/adapters';
import { loadTestDataFromDb, mergeTestDataResults } from './lib/test-data';

(async () => {
    const result = await Promise.all(
        allAdapters.map(async (adapter) => {
            const { adapterResults } = await loadTestDataFromDb(adapter, { accumulateToPath: true });
            return { [`${adapter.tracker.slug}/${adapter.slug}`.toLowerCase()]: mergeTestDataResults(adapterResults) };
        })
    ).then((results) => Object.assign({}, ...results));
    await writeFile('./research-docs/adapter-examples.json', JSON.stringify(result));
})();
