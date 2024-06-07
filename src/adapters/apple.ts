import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'apple',
    name: 'Apple Distribution International Ltd.',
    datenanfragenSlug: 'apple',
};

export const adapters: Adapter[] = [
    {
        slug: 'iadsdk-attribution-v2',
        name: 'iAd SDK Attribution v2',
        tracker,

        endpointUrls: ['https://ca.iadsdk.apple.com/adserver/attribution/v2'],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'toroId',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'body',
                    path: 'anonymousDemandId',
                    reasoning: 'obvious observed values',
                },
            ],

            appId: {
                context: 'body',
                path: 'bundleId',
                reasoning: 'obvious property name',
            },
        },
    },
];
