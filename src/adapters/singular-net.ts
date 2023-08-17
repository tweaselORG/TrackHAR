import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'singular-net',
    name: 'Singular Labs, Inc.',
    exodusId: 251,
};

export const adapters: Adapter[] = [
    {
        slug: 'api-v1',
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
                reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682422486',
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
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682526415',
                },
                {
                    context: 'query',
                    path: 'av',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1681931972',
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

            idfa: [
                {
                    context: 'query',
                    path: 'idfa',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682506723',
                },
                {
                    context: 'query',
                    path: 'aifa',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682513989',
                },
            ],

            idfv: [
                {
                    context: 'query',
                    path: 'idfv',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682512312',
                },
                {
                    context: 'query',
                    path: 'asid',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682450838',
                },
                {
                    context: 'query',
                    path: 'andi',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682523347',
                },
            ],

            installTime: {
                context: 'query',
                path: 'install_time',
                reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682543705',
            },

            isFirstLaunch: {
                context: 'query',
                path: 'install',
                reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682535237',
            },

            language: {
                context: 'query',
                path: 'lc',
                reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682484280',
            },

            manufacturer: {
                context: 'query',
                path: 'ma',
                reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682453852',
            },

            model: [
                {
                    context: 'query',
                    path: 'mo',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682474695',
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
                reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682553354',
            },

            osName: {
                context: 'query',
                path: 'p',
                reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682418766',
            },

            osVersion: [
                {
                    context: 'query',
                    path: 'v',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1681939019',
                },
                {
                    context: 'query',
                    path: 've',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682432136',
                },
                {
                    context: 'query',
                    path: 'bd',
                    reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682503639',
                },
            ],

            otherIdentifiers: {
                context: 'query',
                path: 'custom_user_id',
                reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682307154',
            },

            publicIp: {
                context: 'query',
                path: 'ip',
                reasoning: 'https://github.com/tweaselORG/TrackHAR/issues/16#issuecomment-1682426940',
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
