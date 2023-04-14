import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'ironsource',
    name: 'ironSource Ltd.',
    exodusId: 146,
};

export const adapters: Adapter[] = [
    {
        slug: 'logs',
        tracker,

        endpointUrls: ['https://logs.ironsrc.mobi/logs'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'q' },
            { function: 'decodeBase64', input: 'q.data', output: 'j' },
            { function: 'parseJson', input: 'j', output: 'res.body' },
        ],
        containedDataPaths: {
            manufacturer: {
                context: 'body',
                path: 'data.deviceoem',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'body',
                path: 'data.devicemodel',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'data.deviceos',
                reasoning: 'obvious property name',
            },

            osVersion: [
                {
                    context: 'body',
                    path: 'data.deviceosversion',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'data.deviceapilevel',
                    reasoning: 'obvious property name',
                },
            ],

            idfa: {
                context: 'body',
                path: 'data.deviceid',
                reasoning: 'obvious property name',
            },

            networkConnectionType: {
                context: 'body',
                path: 'data.connectiontype',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'body',
                path: 'data.bundleid',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'data.appversion',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'data.sdkversion',
                reasoning: 'obvious property name',
            },
        },
    },
];
