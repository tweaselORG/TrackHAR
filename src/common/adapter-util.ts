import type { DataPath } from '../index';

export const mergeContainedDataPaths = (...paths: Record<string, DataPath | DataPath[]>[]) =>
    paths.reduce((res, path) => {
        for (const [property, pathOrPaths] of Object.entries(path)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (res[property]) res[property] = [res[property]!, pathOrPaths].flat();
            else res[property] = pathOrPaths;
        }
        return res;
    }, {});

export const emptyIdfa = '00000000-0000-0000-0000-000000000000';
