import type { Har } from 'har-format';
import { JSONPath } from 'jsonpath-plus';
import type { LiteralUnion } from 'type-fest';
import { getAllAdapters } from './common/adapters';
import { decodeFunctions } from './common/decode-functions';
import type { Request } from './common/request';
import { unhar } from './common/request';
import type { ArrayOrSingle } from './common/type-utils';

import h from '../drums.tmp.json';

const allAdapters = getAllAdapters();

/** A JSONPath expression to be parsed by https://github.com/JSONPath-Plus/JSONPath. */
export type JsonPath = string;

export type Context = 'header' | 'path' | 'query' | 'body';

export type Tracker = {
    slug: string;
    name: string;
    exodusId?: number;
    datenanfragenSlug?: string;
};
export type Property =
    | 'accelerometerX'
    | 'accelerometerY'
    | 'accelerometerZ'
    | 'appId'
    | 'appVersion'
    | 'batteryLevel'
    | 'carrier'
    | 'country'
    | 'diskFree'
    | 'diskTotal'
    | 'diskUsed'
    | 'idfa'
    | 'idfv'
    | 'isCharging'
    | 'isEmulator'
    | 'isRooted'
    | 'language'
    | 'manufacturer'
    | 'model'
    | 'osName'
    | 'osVersion'
    | 'otherIdentifiers'
    | 'ramFree'
    | 'ramTotal'
    | 'ramUsed'
    | 'rooted'
    | 'rotationX'
    | 'rotationY'
    | 'rotationZ'
    | 'screenHeight'
    | 'screenWidth'
    | 'trackerSdkVersion';
export type Variable = LiteralUnion<Context | 'res', string>;
export type Path = LiteralUnion<Variable, JsonPath>;
export type Identifier =
    | Variable
    | `${Exclude<Variable, 'res'>}.${string}`
    | `res.${Context}`
    | `res.${Context}.${string}`;
export type DecodingStep = (
    | {
          function: 'parseQueryString' | 'parseJson' | 'decodeProtobuf' | 'ensureArray';
      }
    | { function: 'getProperty'; options: { path: JsonPath } }
) &
    (({ input: Path } | { mapInput: Path }) & { output: Identifier });
export type Adapter = {
    slug: string;
    tracker: Tracker;

    endpointUrls: (string | RegExp)[];
    match?: (r: Request) => boolean | undefined;

    decodingSteps: DecodingStep[];
    containedDataPaths: Partial<
        Record<
            Property,
            ArrayOrSingle<{
                context: Context;
                path: JsonPath;
                reasoning:
                    | 'obvious property name'
                    | 'obvious observed values'
                    | `https://${string}`
                    | `http://${string}`;
            }>
        >
    >;
};

const decodeRequest = (r: Request, decodingSteps: DecodingStep[]) => {
    const [path, query] = r.path.split('?');
    console.log(r.path, path, query);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vars: Record<Variable, any> & { res: Partial<Record<Context, any>> } = {
        header: r.headers,
        path,
        query,
        body: r.content,
        res: {},
    };

    const get = (id: Path) => JSONPath({ path: id, json: vars, wrap: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const set = (id: Identifier, value: any) => {
        const path = id.split('.');
        const last = path.pop();
        if (!last) throw new Error('Invalid path');

        let current = vars;
        for (const p of path) {
            let next = Array.isArray(current) ? current[+p] : current[p];
            if (!next) current[p] = {};
            next = Array.isArray(current) ? current[+p] : current[p];
            current = next;
        }
        if (Array.isArray(current)) current[+last] = value;
        else current[last] = value;
    };

    for (const step of decodingSteps) {
        if ('mapInput' in step) {
            const result = get(step.mapInput)
                .filter((i) => i !== undefined && i !== null)
                .map((i) => decodeFunctions[step.function](i, step.options));
            if (result) set(step.output, result);
            continue;
        }
        const input = get(step.input);
        if (!input) continue;

        const result = decodeFunctions[step.function](input, step.options);
        if (result) set(step.output, result);
    }

    console.log(vars);
    return vars.res;
};

const adapterForRequest = (r: Request) =>
    allAdapters.then((adapters) =>
        adapters.find(
            (a) =>
                a.endpointUrls.some((url) =>
                    url instanceof RegExp ? url.test(r.endpointUrl) : url === r.endpointUrl
                ) && (a.match ? a.match(r) : true)
        )
    );
const processRequest = async (r: Request) => {
    const adapter = await adapterForRequest(r);
    if (!adapter) return undefined;

    const decodedRequest = decodeRequest(r, adapter.decodingSteps);
    console.log(decodedRequest);
};

export type Result = Record<string, { source: Context; value: string }>;
export const process = (har: Har): Result => unhar(har).map(processRequest);

(async () => {
    await process(h);
})();
