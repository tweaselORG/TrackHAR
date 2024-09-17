import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'singular-net',
    name: 'Singular Labs, Inc.',
    description: 'singular-net',
    exodusId: 251,
};

export const adapters: Adapter[] = [
    {
        slug: 'api-v1',
        name: 'Singular API v1',
        tracker,

        endpointUrls: [
            'https://sdk-api-v1.singular.net/api/v1/start',
            'https://sdk-api-v1.singular.net/api/v1/event',
            'https://sdk-api-v1.singular.net/api/v1/config',
            'https://sdk-api-v1.singular.net/api/v1/resolve',
            'https://s2s.singular.net/api/v1/launch',
            'https://i.singular.net/api/v1/imp',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'parseJson', input: 'res.body.payload', output: 'res.body.payload' },
        ],
        containedDataPaths: {
            appId: {
                context: 'query',
                path: 'i',
                reasoning:
                    'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
            },

            appName: {
                context: 'query',
                path: 'psn',
                reasoning: 'obvious observed values',
            },

            appVersion: [
                {
                    context: 'query',
                    path: 'app_v',
                    reasoning:
                        'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
                },
                {
                    context: 'query',
                    path: 'av',
                    reasoning: 'singular-net/av.md',
                },
            ],

            architecture: {
                context: 'query',
                path: 'ab',
                reasoning: 'obvious observed values',
            },

            country: {
                context: 'query',
                path: 'country_code',
                reasoning: 'obvious property name',
            },

            advertisingId: [
                {
                    context: 'query',
                    path: 'idfa',
                    reasoning:
                        'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
                },
                {
                    context: 'query',
                    path: 'aifa',
                    reasoning:
                        'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
                },
            ],

            developerScopedId: [
                {
                    context: 'query',
                    path: 'idfv',
                    reasoning:
                        'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
                },
                {
                    context: 'query',
                    path: 'asid',
                    reasoning: 'singular-net/asid.md',
                },
                {
                    context: 'query',
                    path: 'andi',
                    reasoning:
                        'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
                },
            ],

            installTime: {
                context: 'query',
                path: 'install_time',
                reasoning:
                    'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
            },

            isFirstLaunch: {
                context: 'query',
                path: 'install',
                reasoning:
                    'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
            },

            language: {
                context: 'query',
                path: 'lc',
                reasoning:
                    'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
            },

            manufacturer: {
                context: 'query',
                path: 'ma',
                reasoning:
                    'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
            },

            model: [
                {
                    context: 'query',
                    path: 'mo',
                    reasoning:
                        'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
                },
                {
                    context: 'query',
                    path: 'd',
                    reasoning: 'obvious observed values',
                },
            ],

            networkConnectionType: {
                context: 'query',
                path: 'c',
                reasoning:
                    'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
            },

            osName: {
                context: 'query',
                path: 'p',
                reasoning:
                    'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
            },

            osVersion: [
                {
                    context: 'query',
                    path: 'v',
                    reasoning: 'singular-net/v.md',
                },
                {
                    context: 'query',
                    path: 've',
                    reasoning:
                        'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
                },
                {
                    context: 'query',
                    path: 'bd',
                    reasoning:
                        'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
                },
            ],

            otherIdentifiers: {
                context: 'query',
                path: 'custom_user_id',
                reasoning: 'singular-net/custom_user_id.md',
            },

            publicIp: {
                context: 'query',
                path: 'ip',
                reasoning:
                    'https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference',
            },

            timezone: {
                context: 'query',
                path: 'tz',
                reasoning: 'obvious observed values',
            },

            trackerSdkVersion: {
                context: 'query',
                path: 'sdk',
                reasoning: 'obvious observed values',
            },

            userAgent: [
                {
                    context: 'query',
                    path: 'device_user_agent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'payload.ua',
                    reasoning: 'obvious observed values',
                },
            ],
        },
    },
];
