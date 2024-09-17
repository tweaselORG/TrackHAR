import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'chartboost',
    name: 'Chartboost, Inc.',
    description: 'chartboost',
    datenanfragenSlug: 'chartboost',
    exodusId: 53,
};

export const adapters: Adapter[] = [
    {
        slug: 'live-unnested',
        // See: https://docs.chartboost.com/en/monetization/charles-web-proxy/#interpreting-charles-results
        name: 'Chartboost initialization calls',
        tracker,

        endpointUrls: [
            'https://live.chartboost.com/api/install',
            'https://live.chartboost.com/api/config',
            'https://live.chartboost.com/banner/show',
        ],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'decodeBase64', input: 'res.body.identity', output: 'res.body.identity' },
            { function: 'parseJson', input: 'res.body.identity', output: 'res.body.identity' },
        ],
        containedDataPaths: {
            appId: {
                context: 'body',
                path: 'bundle_id',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'bundle',
                reasoning: 'obvious observed values',
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'sdk',
                reasoning: 'obvious property name',
            },

            advertisingId: [
                {
                    context: 'body',
                    path: 'identity.gaid',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'identity.ifa',
                    reasoning: 'obvious property name',
                },
            ],

            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'session_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'session_ID',
                    reasoning: 'obvious property name',
                },
            ],

            manufacturer: {
                context: 'body',
                path: 'device_type',
                reasoning: 'obvious observed values',
            },

            model: {
                context: 'body',
                path: 'model',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'os',
                reasoning: 'obvious property name',
            },

            osVersion: {
                context: 'body',
                path: 'os',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'body',
                path: 'language',
                reasoning: 'obvious property name',
            },

            timezone: {
                context: 'body',
                path: 'timezone',
                reasoning: 'obvious property name',
            },

            userAgent: {
                context: 'body',
                path: 'user_agent',
                reasoning: 'obvious property name',
            },

            orientation: {
                context: 'body',
                path: 'is_portrait',
                reasoning: 'obvious property name',
            },

            carrier: {
                context: 'body',
                path: 'carrier',
                reasoning: 'obvious property name',
            },

            isRooted: {
                context: 'body',
                path: 'rooted_device',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'w',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'h',
                reasoning: 'obvious property name',
            },

            networkConnectionType: {
                context: 'body',
                path: 'mobile_network',
                reasoning: 'obvious property name',
            },

            country: {
                context: 'body',
                path: 'country',
                reasoning: 'obvious property name',
            },
        },
    },

    {
        slug: 'live-nested',
        name: 'Chartboost ad view',
        tracker,

        endpointUrls: [
            'https://live.chartboost.com/webview/v2/prefetch',
            'https://live.chartboost.com/webview/v2/reward/get',
            'https://live.chartboost.com/webview/v2/interstitial/get',
            'https://da.chartboost.com/auction/sdk/banner',
        ],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'decodeBase64', input: 'res.body.device.identity', output: 'res.body.device.identity' },
            { function: 'parseJson', input: 'res.body.device.identity', output: 'res.body.device.identity' },
        ],
        containedDataPaths: {
            appId: {
                context: 'body',
                path: 'app.bundle_id',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'app.bundle',
                reasoning: 'obvious observed values',
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'sdk.sdk',
                reasoning: 'obvious property name',
            },

            advertisingId: [
                {
                    context: 'body',
                    path: 'device.identity.gaid',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.identity.ifa',
                    reasoning: 'obvious property name',
                },
            ],

            otherIdentifiers: {
                context: 'body',
                path: 'app.session_id',
                reasoning: 'obvious property name',
            },

            manufacturer: {
                context: 'body',
                path: 'device.device_type',
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
                path: 'device.os',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'body',
                path: 'device.language',
                reasoning: 'obvious property name',
            },

            timezone: {
                context: 'body',
                path: 'device.timezone',
                reasoning: 'obvious property name',
            },

            userAgent: {
                context: 'body',
                path: 'device.user_agent',
                reasoning: 'obvious property name',
            },

            orientation: {
                context: 'body',
                path: 'device.is_portrait',
                reasoning: 'obvious property name',
            },

            carrier: {
                context: 'body',
                path: 'device.carrier',
                reasoning: 'obvious property name',
            },

            isRooted: {
                context: 'body',
                path: 'device.rooted_device',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'device.w',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'device.h',
                reasoning: 'obvious property name',
            },

            networkConnectionType: {
                context: 'body',
                path: 'device.mobile_network',
                reasoning: 'obvious property name',
            },

            country: {
                context: 'body',
                path: 'device.country',
                reasoning: 'obvious property name',
            },
        },
    },
];
