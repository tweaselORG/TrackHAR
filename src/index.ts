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

/** Some value transmitted by a tracker. We don't have any type information about it. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TrackingDataValue = any;

/** A part of a request, to explain where some information was found. */
export type Context = 'header' | 'path' | 'query' | 'body';

/** A tracking company that we have adapters for. */
export type Tracker = {
    /** A slug to identify the tracker. */
    slug: string;
    /** The legal name of the tracking company. */
    name: string;
    /**
     * The numeric ID of the tracker in the [Exodus tracker
     * database](https://reports.exodus-privacy.eu.org/en/trackers/) (if available).
     */
    exodusId?: number;
    /**
     * The slug of the tracking company in the [Datenanfragen.de company database](https://www.datarequests.org/company)
     * (if available).
     */
    datenanfragenSlug?: string;
};
/**
 * A type of tracking data that we can detect in a request.
 *
 * These are our standardized names for the data that we can detect. They are not necessarily the same as the names used
 * by the tracker.
 */
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
/** A variable on the global state used in the decoding process of a request. This doesn't allow nested property access. */
export type Variable = LiteralUnion<Context | 'res', string>;
/**
 * A JSONPath expression that can be used to access a variable or nested property on the global state in the decoding
 * process of a request.
 */
export type Path = LiteralUnion<Variable, JsonPath>;
/**
 * An identifer for a variable or nested property on the global state in the decoding process of a request. This
 * **doesn't** have support for more complex JSONPath expressions.
 */
export type Identifier =
    | Variable
    | `${Exclude<Variable, 'res'>}.${string}`
    | `res.${Context}`
    | `res.${Context}.${string}`;
/**
 * A step in the process of decoding a tracking request. This is essentially a function call with some input and output,
 * and potentially additional options.
 *
 * The `input` is a JSONPath expression which is evaluated against the global decoding state (initialized with the data
 * from each {@link Context} of the request, and a `res` object, where the result of the decoding is to be stored,
 * separated by {@link Context}; new variables can be created by decoding steps).\
 * Alternatively, if a `mapInput` is specified instead, the function will be mapped over the array at the given path,
 * returning a result array.
 *
 * The `output` is an identifier of where to store the return value of the function call in the same global decoding
 * state. Note that this doesn't support the full range of JSONPath expressions, but only nested property access through
 * `.`.
 *
 * The following `function`s are available:
 *
 * - `parseQueryString`: Parses a query string encoded value into an object.
 * - `parseJson`: Parses a JSON encoded string into an object.
 * - `decodeBase64`: Decodes a base64-encoded string.
 * - `decodeUrl`: Decodes a URL-encoded string.
 * - `decodeProtobuf`: Decodes a Protobuf blob. This doesn't use a schema, as such property names are not available in the
 *   result.
 * - `ensureArray`: Ensures that the given value is an array. If it is not, it is wrapped in an array.
 * - `getProperty`: Gets a property from an object. The property name is given in the `options.path` option. This is
 *   useful for either copying a nested property to a variable, or to extract a nested property from an array when used
 *   with a `mapInput`.
 */
export type DecodingStep = (
    | {
          function: 'parseQueryString' | 'parseJson' | 'decodeBase64' | 'decodeUrl' | 'decodeProtobuf' | 'ensureArray';
      }
    | { function: 'getProperty'; options: { path: JsonPath } }
) &
    (({ input: Path } | { mapInput: Path }) & { output: Identifier });

/** A description of where a certain piece of tracking data can be found in the decoded request. */
export type DataPath = {
    /** The part of the original request that the data can be found in. */
    context: Context;
    /** A JSONPath expression describing where in the decoded request object the data can be found. */
    path: JsonPath;
    /**
     * An explanation of how we concluded that this is information is actually the type of data we labelled it as. This
     * can either be a standardized description, or a URL to a more in-depth research report.
     */
    reasoning: 'obvious property name' | 'obvious observed values' | `https://${string}` | `http://${string}`;
};
/**
 * An adapter that contains instructions on how to extract the tracking data included in a request to certain endpoints.
 *
 * Handling for one endpoint might be split across multiple adapters if the endpoint accepts different request formats.
 *
 * The first adapter that matches a request will be used to decode it.
 */
export type Adapter = {
    /** A slug to identify the adapter. These only need to be unique per tracker, not globally. */
    slug: string;
    /** The tracking company behind these endpoints. */
    tracker: Tracker;

    /**
     * The endpoints that this adapter can handle.
     *
     * Each entry can either be a string (which will have to be equal to the full endpoint URL in the request) or a
     * regular expression that is matched against the endpoint URL.
     *
     * The endpoint URL in this context is the full URL, including protocol, host, and path, but excluding the query
     * string.
     */
    endpointUrls: (string | RegExp)[];
    /**
     * An optional function to further filter which requests can be handled by this adapter.
     *
     * This is useful if there are multiple adapters for one endpoint that handle different request formats.
     */
    match?: (r: Request) => boolean | undefined;

    /** An array of the steps (in order) used to decode the request into an object format. */
    decodingSteps: DecodingStep[];
    /** A description of how to extract the transmitted tracking data from the decoded object. */
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
/**
 * Parse a single request in our internal request representation and extract tracking data as an annotated result from
 * it.
 *
 * @remarks
 * This is not needed for the main purposes of this library, but can be useful for more advanced use cases.
 *
 * @param request The request to process in our internal request format.
 */
export const processRequest = (request: Request): AnnotatedResult | undefined => {
    const adapter = adapterForRequest(request);
    if (!adapter) return undefined;

    const decodedRequest = decodeRequest(request, adapter.decodingSteps);

    const flattenedPaths = Object.entries(adapter.containedDataPaths)
        .map(([property, paths]) => (Array.isArray(paths) ? paths : [paths]).map((p) => [property, p] as const))
        .flat();
    return flattenedPaths
        .map(([property, path]) =>
            (JSONPath<TrackingDataValue[]>({ path: path.path, json: decodedRequest[path.context], wrap: true }) ?? [])
                .map((v) => ({
                    adapter: `${adapter.tracker.slug}/${adapter.slug}`,
                    property: property as Property,
                    ...path,
                    value: v,
                }))
                .filter((v) => v.value !== undefined && v.value !== null && v.value.trim?.() !== '')
        )
        .flat();
};

/**
 * Extended version of the {@link Result} type that includes additional metadata about the detected tracking. Each entry
 * in the array is one instance of a tracking data value that was found in a request, with the following properties:
 *
 * - `adapter`: The adapter that detected the tracking data (`<tracker slug>/<adapter slug>`).
 * - `property`: The type of tracking data that was detected.
 * - `value`: The actual value of the tracking data that was transmitted.
 * - `context`: The part of the request in which the tracking data was found (e.g. `body`, `path`).
 * - `path`: A JSONPath expression indicating where this match was found. Note that while we try to keep this path as
 *   close as possible to the format used by the tracker, it refers to the decoded request, after our processing steps.
 *   This is unavoidable as the trackers don't transmit in a standardized format.
 * - `reasoning`: An explanation of how we concluded that this is information is actually the type of data we labelled it
 *   as. This can either be a standardized description, or a URL to a more in-depth research report.
 */
export type AnnotatedResult = ({ adapter: string; property: Property; value: TrackingDataValue } & DataPath)[];
/**
 * A mapping from properties (standardized names for certain types of tracking data) to the actual instances of values
 * of that property found in a request.
 */
export type Result = Partial<Record<Property, TrackingDataValue[]>>;

/**
 * Parse the requests in a HAR traffic dump and extract tracking data.
 *
 * @param har A traffic dump in HAR format.
 * @param options An optional object that can configure the following options:
 *
 *   - `valuesOnly`: By default, the result contains not just the values but also various metadata (like the adapter that
 *       processed the request). If you only need the values, you can set this option to `true` to get a simpler
 *       result.
 *
 * @returns An array of results, corresponding to each request in the HAR file. If a request could not be processed
 *   (i.e. if no adapter was found that could handle it), the corresponding entry in the array will be `undefined`.
 */
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

/**
 * An array of all available adapters.
 *
 * @remarks
 * This is not needed for the main purposes of this library, but can be useful for more advanced use cases. We use it to
 * generate the information in [`tracker-wiki`](https://github.com/tweaselORG/tracker-wiki).
 */
// Somehow export ... from './common/adapters' breaks the typedef, so we use this
export const adapters = allAdapters;

export { ArrayOrSingle, Request };
