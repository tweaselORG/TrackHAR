import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'yandex',
    name: 'Yandex Oy',
    datenanfragenSlug: 'yandex',
    exodusId: 124,
};

export const adapters: Adapter[] = [
    {
        slug: 'appmetrica',
        // See: https://appmetrica.yandex.com/about
        name: 'AppMetrica Analytics',
        tracker,

        endpointUrls: [
            'https://startup.mobile.yandex.net/analytics/startup',
            'https://report.appmetrica.yandex.net/report',
        ],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: {
            idfa: [
                {
                    context: 'query',
                    path: 'adv_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'ifa',
                    reasoning: 'obvious property name',
                },
            ],

            idfv: {
                context: 'query',
                path: 'ifv',
                reasoning: 'obvious property name',
            },

            otherIdentifiers: [
                {
                    context: 'query',
                    path: 'deviceid',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'deviceid2',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'android_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'yandex_adv_id',
                    reasoning: 'obvious property name',
                },
            ],

            osName: {
                context: 'query',
                path: 'app_platform',
                reasoning: 'obvious property name',
            },

            osVersion: {
                context: 'query',
                path: 'os_version',
                reasoning: 'obvious property name',
            },

            manufacturer: {
                context: 'query',
                path: 'manufacturer',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'query',
                path: 'model',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'query',
                path: 'screen_height',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'query',
                path: 'screen_width',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'query',
                path: 'locale',
                reasoning: 'obvious property name',
            },

            country: {
                context: 'query',
                path: 'locale',
                reasoning: 'obvious property name',
            },

            isRooted: {
                context: 'query',
                path: 'is_rooted',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'query',
                path: 'analytics_sdk_version_name',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'query',
                path: 'app_id',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'query',
                path: 'app_version_name',
                reasoning: 'obvious property name',
            },
        },
    },
];
