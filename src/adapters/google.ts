import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    name: 'Google LLC',
    datenanfragenSlug: 'google',
};

export const adapters: Adapter[] = [
    {
        tracker,

        endpointUrls: ['https://app-measurement.com/a'],

        decodingSteps: [{ function: 'decodeProtobuf', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            appId: {
                context: 'body',
                path: '$.14',
                reasoning: 'obvious observed values',
            },
        },
    },
];
