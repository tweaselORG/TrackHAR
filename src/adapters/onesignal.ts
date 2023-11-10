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
        // The `tags.*` properties are custom properties that can be set by the app developer.
        containedDataPaths: {
            trackerSdkVersion: {
                context: 'body',
                path: 'sdk',
                reasoning: 'onesignal/sdk.md',
            },

            appId: [
                {
                    context: 'body',
                    path: 'android_package',
                    reasoning: 'onesignal/android_package.md',
                },
                {
                    context: 'body',
                    path: 'ios_bundle',
                    reasoning: 'onesignal/ios_bundle.md',
                },
            ],

            appVersion: {
                context: 'body',
                path: 'game_version',
                reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
            },

            pushNotificationToken: {
                context: 'body',
                path: 'identifier',
                reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
            },

            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'external_user_id',
                    reasoning: 'https://documentation.onesignal.com/v9.0/docs/users#external-user-ids',
                },
                {
                    context: 'path',
                    path: '$',
                    reasoning: 'https://documentation.onesignal.com/v9.0/docs/users#player-id',
                },

                {
                    context: 'body',
                    path: 'tags.deviceId',
                    reasoning: 'obvious property name',
                },
            ],

            osName: {
                context: 'body',
                path: 'device_type',
                reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
            },

            osVersion: {
                context: 'body',
                path: 'device_os',
                reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
            },

            timezone: [
                {
                    context: 'body',
                    path: 'timezone_id',
                    reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
                },
                {
                    context: 'body',
                    path: 'timezone',
                    reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
                },
            ],

            model: {
                context: 'body',
                path: 'device_model',
                reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
            },

            carrier: {
                context: 'body',
                path: 'carrier',
                reasoning: 'onesignal/carrier.md',
            },

            isRooted: {
                context: 'body',
                path: 'rooted',
                reasoning: 'https://documentation.onesignal.com/v9.0/reference/csv-export',
            },

            country: {
                context: 'body',
                path: 'tags.country',
                reasoning: 'obvious property name',
            },

            language: [
                {
                    context: 'body',
                    path: 'language',
                    reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
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

            latitude: [
                {
                    context: 'body',
                    path: 'lat',
                    reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
                },
                {
                    context: 'body',
                    path: 'tags.geo_latitude',
                    reasoning: 'obvious property name',
                },
            ],

            longitude: [
                {
                    context: 'body',
                    path: 'long',
                    reasoning: 'https://documentation.onesignal.com/v9.0/reference/add-a-device',
                },
                {
                    context: 'body',
                    path: 'tags.geo_longitude',
                    reasoning: 'obvious property name',
                },
            ],

            deviceName: {
                context: 'body',
                path: 'tags.deviceName',
                reasoning: 'obvious property name',
            },
        },
    },
];
