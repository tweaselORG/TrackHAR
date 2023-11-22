import { writeFile } from 'fs/promises';
import { allAdapters } from '../src/common/adapters';
import { debugAdapter, mergeAdapterResults } from './lib/debug';

(async () => {
    const result = await Promise.all(
        allAdapters.map(async (adapter) => {
            // Without any limit, this might run for very long.
            const { adapterResults } = await debugAdapter(adapter, { accumulateToPath: true, rowLimit: 200 });
            return { [`${adapter.tracker.slug}/${adapter.slug}`]: mergeAdapterResults(adapterResults) };
        })
    ).then((results) => Object.assign({}, ...results));
    await writeFile('./research-docs/adapterExamples.json', JSON.stringify(result));
})();
