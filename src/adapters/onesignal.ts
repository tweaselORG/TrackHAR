import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'onesignal',
    name: 'OneSignal, Inc.',
    datenanfragenSlug: 'onesignal',
    exodusId: 193,
};

export const adapters: Adapter[] = [
    {
        slug: 'players',
        tracker,

        endpointUrls: [
            'https://api.onesignal.com/players',
            'https://onesignal.com/api/v1/players',
            /https:\/\/api\.onesignal\.com\/players\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
        ],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'path', output: 'res.path', options: { path: '$' } },
        ],
        containedDataPaths: {
            trackerSdkVersion: {
                context: 'body',
                path: 'sdk',
                reasoning: 'obvious property name',
            },

            appId: [
                {
                    context: 'body',
                    path: 'android_package',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'ios_bundle',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'app_id',
                    reasoning: 'obvious property name',
                },
            ],

            idfa: {
                context: 'body',
                path: 'ad_id',
                reasoning: 'obvious property name',
            },

            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'device.device_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'identifier',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'external_user_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'tags.device_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'path',
                    path: '$',
                    reasoning: 'obvious observed values',
                },
            ],

            osName: {
                context: 'body',
                path: 'device_os',
                reasoning: 'obvious property name',
            },

            osVersion: {
                context: 'body',
                path: 'device_os',
                reasoning: 'obvious property name',
            },

            timezone: {
                context: 'body',
                path: 'timezone_id',
                reasoning: 'obvious property name',
            },

            manufacturer: {
                context: 'body',
                path: 'device_model',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'body',
                path: 'device_model',
                reasoning: 'obvious property name',
            },

            carrier: {
                context: 'body',
                path: 'carrier',
                reasoning: 'obvious property name',
            },

            isRooted: {
                context: 'body',
                path: 'rooted',
                reasoning: 'obvious property name',
            },

            language: [
                {
                    context: 'body',
                    path: 'language',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'tags.lang',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'tags.language',
                    reasoning: 'obvious property name',
                },
            ],

            deviceName: {
                context: 'body',
                path: 'device.deviceName',
                reasoning: 'obvious property name',
            },

            latitude: {
                context: 'body',
                path: 'lat',
                reasoning: 'obvious property name',
            },

            longitude: {
                context: 'body',
                path: 'long',
                reasoning: 'obvious property name',
            },
        },
    },
];
