import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'google',
    name: 'Google LLC',
    datenanfragenSlug: 'google',
};

export const adapters: Adapter[] = [
    {
        slug: 'app-measurement',
        tracker,

        endpointUrls: ['https://app-measurement.com/a'],

        decodingSteps: [
            { function: 'decodeProtobuf', input: 'body', output: 'res.body' },
            { function: 'ensureArray', input: 'res.body.1', output: 'res.body.1' },
        ],
        containedDataPaths: {
            appId: {
                context: 'body',
                path: '1.*.14',
                reasoning: 'obvious observed values',
            },

            appVersion: {
                context: 'body',
                path: '1.*.16',
                reasoning: 'obvious observed values',
            },

            idfa: {
                context: 'body',
                path: '1.*.19',
                reasoning: 'obvious observed values',
            },

            idfv: {
                context: 'body',
                path: '1.*.27',
                reasoning: 'obvious observed values',
            },

            osName: {
                context: 'body',
                path: '1.*.8',
                reasoning: 'obvious observed values',
            },

            osVersion: {
                context: 'body',
                path: '1.*.9',
                reasoning: 'obvious observed values',
            },
        },
    },
];
