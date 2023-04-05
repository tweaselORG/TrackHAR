import type { Har } from 'har-format';
import { JSONPath } from 'jsonpath-plus';
import type { LiteralUnion } from 'type-fest';
import { allAdapters } from './common/adapters';
import { decodeFunctions } from './common/decode-functions';
import type { Request } from './common/request';
import { unhar } from './common/request';
import type { ArrayOrSingle } from './common/type-utils';

/** A JSONPath expression to be parsed by https://github.com/JSONPath-Plus/JSONPath. */
export type JsonPath = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TrackingDataValue = any;

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
    | 'appName'
    | 'appVersion'
    | 'architecture'
    | 'batteryLevel'
    | 'carrier'
    | 'country'
    | 'deviceName'
    | 'diskFree'
    | 'diskTotal'
    | 'diskUsed'
    | 'hashedIdfa'
    | 'idfa'
    | 'idfv'
    | 'isCharging'
    | 'isEmulator'
    | 'isInDarkMode'
    | 'isInForeground'
    | 'isRoaming'
    | 'isRooted'
    | 'language'
    | 'latitude'
    | 'localIp'
    | 'longitude'
    | 'macAddress'
    | 'manufacturer'
    | 'model'
    | 'networkConnectionType'
    | 'orientation'
    | 'osName'
    | 'osVersion'
    | 'otherIdentifiers'
    | 'publicIp'
    | 'ramFree'
    | 'ramTotal'
    | 'ramUsed'
    | 'rotationX'
    | 'rotationY'
    | 'rotationZ'
    | 'screenHeight'
    | 'screenWidth'
    | 'signalStrengthCellular'
    | 'signalStrengthWifi'
    | 'timezone'
    | 'trackerSdkVersion'
    | 'uptime'
    | 'userAgent'
    | 'viewedPage'
    | 'volume';
export type Variable = LiteralUnion<Context | 'res', string>;
export type Path = LiteralUnion<Variable, JsonPath>;
export type Identifier =
    | Variable
    | `${Exclude<Variable, 'res'>}.${string}`
    | `res.${Context}`
    | `res.${Context}.${string}`;
export type DecodingStep = (
    | {
          function: 'parseQueryString' | 'parseJson' | 'decodeBase64' | 'decodeUrl' | 'decodeProtobuf' | 'ensureArray';
      }
    | { function: 'getProperty'; options: { path: JsonPath } }
) &
    (({ input: Path } | { mapInput: Path }) & { output: Identifier });
export type DataPath = {
    context: Context;
    path: JsonPath;
    reasoning: 'obvious property name' | 'obvious observed values' | `https://${string}` | `http://${string}`;
};
export type Adapter = {
    slug: string;
    tracker: Tracker;

    endpointUrls: (string | RegExp)[];
    match?: (r: Request) => boolean | undefined;

    decodingSteps: DecodingStep[];
    containedDataPaths: Partial<Record<Property, ArrayOrSingle<DataPath>>>;
};

const decodeRequest = (r: Request, decodingSteps: DecodingStep[]) => {
    const [path, query] = r.path.split('?');

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
            const mapInput = get(step.mapInput);
            if (!Array.isArray(mapInput)) throw new Error('mapInput must be an array.');
            const result = mapInput
                .filter((i) => i !== undefined && i !== null)
                .map((i) => decodeFunctions[step.function](i, (step as { options: unknown }).options));
            if (result) set(step.output, result);
            continue;
        }

        const input = get(step.input);
        if (!input) continue;

        const result = decodeFunctions[step.function](input, (step as { options: unknown }).options);
        if (result) set(step.output, result);
    }

    return vars.res;
};

const adapterForRequest = (r: Request) =>
    allAdapters.find(
        (a) =>
            a.endpointUrls.some((url) => (url instanceof RegExp ? url.test(r.endpointUrl) : url === r.endpointUrl)) &&
            (a.match ? a.match(r) : true)
    );
const processRequest = (r: Request) => {
    const adapter = adapterForRequest(r);
    if (!adapter) return undefined;

    const decodedRequest = decodeRequest(r, adapter.decodingSteps);

    const flattenedPaths = Object.entries(adapter.containedDataPaths)
        .map(([property, paths]) => (Array.isArray(paths) ? paths : [paths]).map((p) => [property, p] as const))
        .flat();
    return flattenedPaths
        .map(([property, path]) =>
            JSONPath<TrackingDataValue[]>({ path: path.path, json: decodedRequest[path.context], wrap: true })
                .map((v) => ({
                    adapter: `${adapter.tracker.slug}/${adapter.slug}`,
                    property,
                    ...path,
                    value: v,
                }))
                .filter((v) => v.value !== undefined && v.value !== null && v.value.trim() !== '')
        )
        .flat();
};

export type AnnotatedResult = ({ adapter: string; property: string; value: TrackingDataValue } & DataPath)[];
export type Result = Record<string, TrackingDataValue[]>;
export const process = async <ValuesOnly extends boolean = false>(
    har: Har,
    options?: { valuesOnly?: ValuesOnly }
): Promise<ValuesOnly extends true ? (Result | undefined)[] : (AnnotatedResult | undefined)[]> => {
    const res = await Promise.all(unhar(har).map(processRequest));

    const ret = options?.valuesOnly
        ? res.map((req) =>
              req?.reduce<Result>(
                  (acc, cur) => ({
                      ...acc,
                      [cur.property]: acc[cur.property]?.concat(cur.value) || [cur.value],
                  }),
                  {}
              )
          )
        : res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ret as any;
};

// Somehow export ... from './common/adapters' breaks the typedef, so we use this
export const adapters = allAdapters;
