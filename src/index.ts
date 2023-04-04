import type { Har } from 'har-format';
import type { LiteralUnion } from 'type-fest';
import type { Request } from './common/request';
import type { ArrayOrSingle } from './common/type-utils';

/** A JSONPath expression to be parsed by https://github.com/JSONPath-Plus/JSONPath. */
export type JsonPath = string;
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
export type Variable = LiteralUnion<'query' | 'body', string>;
export type DecodingStep = (
    | {
          function: 'parseQueryString' | 'parseJson' | 'decodeProtobuf' | 'ensureArray';
      }
    | { function: 'getProperty'; options: { path: JsonPath } }
) &
    (({ input: Variable } | { mapInput: Variable }) & { output: Variable });
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
                context: 'query' | 'body';
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

export type Result = Record<string, { source: 'body' | 'query'; value: string }>;
export const process = (har: Har): Result => 0;
