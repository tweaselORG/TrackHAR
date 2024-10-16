import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'vungle',
    name: 'Vungle Limited',
    datenanfragenSlug: 'vungle',
    exodusId: 169,
};

export const adapters: Adapter[] = [
    {
        slug: 'api-new',
        name: 'Vungle SDK (api/new)',
        tracker,

        endpointUrls: [/^https:\/\/api\.vungle.com\/api\/v\d\/new$/],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: {
            advertisingId: {
                context: 'query',
                path: 'ifa',
                notIf: 'vungle.invalid.IFA',
                reasoning: 'obvious property name',
            },
        },
    },

    {
        slug: 'api-ads',
        name: 'Vungle SDK (api/ads)',
        tracker,

        endpointUrls: [
            'https://ads.api.vungle.com/config',
            'https://api.vungle.com/api/v5/ads',
            'https://events.api.vungle.com/api/v5/cache_bust',
        ],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            manufacturer: {
                context: 'body',
                path: 'device.make',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'body',
                path: 'device.model',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'device.os',
                reasoning: 'obvious property name',
            },

            osVersion: {
                context: 'body',
                path: 'device.osv',
                reasoning: 'obvious observed values',
            },

            carrier: {
                context: 'body',
                path: 'device.carrier',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'device.w',
                reasoning: 'obvious observed values',
            },

            screenHeight: {
                context: 'body',
                path: 'device.h',
                reasoning: 'obvious observed values',
            },

            advertisingId: [
                {
                    context: 'body',
                    path: 'device.ifa',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.ext.vungle.android.gaid',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.ext.vungle.ios.idfa',
                    reasoning: 'obvious property name',
                },
            ],

            developerScopedId: {
                context: 'body',
                path: 'device.ext.vungle.ios.idfv',
                reasoning: 'obvious property name',
            },

            batteryLevel: [
                {
                    context: 'body',
                    path: 'device.ext.vungle.android.battery_level',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.ext.vungle.ios.battery_level',
                    reasoning: 'obvious property name',
                },
            ],

            isCharging: [
                {
                    context: 'body',
                    path: 'device.ext.vungle.android.battery_state',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.ext.vungle.ios.battery_state',
                    reasoning: 'obvious property name',
                },
            ],

            networkConnectionType: [
                {
                    context: 'body',
                    path: 'device.ext.vungle.android.connection_type',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.ext.vungle.ios.connection_type',
                    reasoning: 'obvious property name',
                },
            ],

            language: [
                {
                    context: 'body',
                    path: 'device.ext.vungle.android.language',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.ext.vungle.ios.language',
                    reasoning: 'obvious property name',
                },
            ],

            timezone: [
                {
                    context: 'body',
                    path: 'device.ext.vungle.android.time_zone',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.ext.vungle.ios.time_zone',
                    reasoning: 'obvious property name',
                },
            ],

            volume: [
                {
                    context: 'body',
                    path: 'device.ext.vungle.android.volume_level',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.ext.vungle.ios.volume_level',
                    reasoning: 'obvious property name',
                },
            ],

            diskFree: [
                {
                    context: 'body',
                    path: 'device.ext.vungle.android.storage_bytes_available',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.ext.vungle.ios.storage_bytes_available',
                    reasoning: 'obvious property name',
                },
            ],

            userAgent: {
                context: 'body',
                path: 'device.ua',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'body',
                path: 'app.bundle',
                reasoning: 'obvious observed values',
            },

            appVersion: {
                context: 'body',
                path: 'app.ver',
                reasoning: 'obvious property name',
            },
        },
    },
];
