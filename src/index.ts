import type { Har } from 'har-format';
import type { LiteralUnion } from 'type-fest';
import type { Request } from './common/request';
import type { ArrayOrSingle } from './common/type-utils';

export type Tracker = {
    name: string;
    exodusId?: number;
    datenanfragenSlug?: string;
};
export type Property =
    | 'idfa'
    | 'idfv'
    | 'otherIdentifiers'
    | 'os'
    | 'model'
    | 'screenDimensions'
    | 'language'
    | 'country'
    | 'rooted'
    | 'trackerSdkVersion'
    | 'appId'
    | 'appVersion';
export type Variable = LiteralUnion<'query-string', string>;
export type DecodingStep = {
    function: 'parseQueryString';
} & { input: Variable; output: Variable };
export type Adapter = {
    tracker: Tracker;

    endpointUrls: (string | RegExp)[];
    match?: (r: Request) => boolean | undefined;

    decodingSteps: DecodingStep[];
    containedDataPaths: Partial<
        Record<
            Property,
            ArrayOrSingle<{
                context: 'query' | 'body';
                // A JSONPath expression to be parsed by https://github.com/JSONPath-Plus/JSONPath.
                path: ArrayOrSingle<string>;
                reasoning:
                    | 'obvious property name'
                    | 'obvious observed values'
                    | `https://${string}`
                    | `http://${string}`;
            }>
        >
    >;
};

export type Result = Record<string, { source: 'body' | 'query-string'; value: string }>;
export const process = (har: Har): Result => 0;
