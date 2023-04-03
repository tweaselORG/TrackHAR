import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    name: 'Yandex Oy',
    datenanfragenSlug: 'yandex',
};

export const adapters: Adapter[] = [
    {
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

            os: {
                context: 'query',
                path: ['app_platform', 'os_version'],
                reasoning: 'obvious property name',
            },

            model: {
                context: 'query',
                path: ['manufacturer', 'model'],
                reasoning: 'obvious property name',
            },

            screenDimensions: {
                context: 'query',
                path: ['screen_width', 'screen_height'],
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

            rooted: {
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
