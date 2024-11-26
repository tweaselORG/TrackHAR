import type { Adapter, ArrayOrSingle, DataPath, Property } from '../index';

export const mergeContainedDataPaths = (...paths: Adapter['containedDataPaths'][]) =>
    paths.reduce<Adapter['containedDataPaths']>((res, path) => {
        for (const [property, pathOrPaths] of Object.entries(path) as [Property, ArrayOrSingle<DataPath>][]) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (res[property]) res[property] = [res[property]!, pathOrPaths].flat();
            else res[property] = pathOrPaths;
        }
        return res;
    }, {});
