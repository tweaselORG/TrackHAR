import { Buffer } from 'buffer/index.js';
import { gunzipSync } from 'fflate';
import { JSONPath } from 'jsonpath-plus';
import qs from 'qs';
import type { DecodingStep } from '../index';
import { Protobuf } from './protobuf.mjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decodeFunctions: Record<DecodingStep['function'], (input: any, options?: any) => any> = {
    parseQueryString: (input) => qs.parse(input.replace(/^.+?\?/, '')),
    parseJson: (input) => JSON.parse(input),
    decodeBase64: (input) => Buffer.from(input, 'base64').toString('binary'),
    decodeUrl: (input) => decodeURIComponent(input),
    decodeProtobuf: (input) => Protobuf.decode(Buffer.from(input, 'binary'), ['', false, false]),
    ensureArray: (input) => (Array.isArray(input) ? input : [input]),
    getProperty: (input, options) => JSONPath({ path: options.path, json: input, wrap: false }),
    gunzip: (input) => {
        const uint8Array = gunzipSync(Buffer.from(input, 'binary'));
        return Buffer.from(uint8Array).toString('binary');
    },
};
