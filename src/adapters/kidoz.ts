import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'kidoz',
    name: 'KIDOZ Ltd.',
    datenanfragenSlug: 'kidoz',
    exodusId: 235,
};

export const adapters: Adapter[] = [
    {
        slug: 'analytics-parents-kidozrestmobile',
        name: 'Kidoz (analytics/parents/KidozRestMobile.php)',
        tracker,

        endpointUrls: ['https://analytics.kidoz.net/parents/KidozRestMobile.php'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'body', output: 'res.body' },
            {
                function: 'parseJson',
                input: 'res.body.KidozEventsLogAsJson',
                output: 'res.body.KidozEventsLogAsJsonParsed',
            },
        ],
        containedDataPaths: {
            deviceId: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.DeviceHash',
                reasoning: 'obvious property name',
            },

            appId: [
                {
                    context: 'body',
                    path: 'KidozEventsLogAsJsonParsed.DeviceParams.PackageID',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'KidozEventsLogAsJsonParsed.DeviceParams.AppID',
                    reasoning: 'obvious property name',
                },
            ],

            appVersion: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.AppVersion',
                reasoning: 'obvious property name',
            },

            manufacturer: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.DeviceBrand',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.DeviceModel',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.ScreenW',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.ScreenH',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.OsType',
                reasoning: 'obvious observed values',
            },

            osVersion: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.OsVersion',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.DeviceLang',
                reasoning: 'obvious property name',
            },

            timezone: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.TimeZone',
                reasoning: 'obvious property name',
            },

            country: {
                context: 'body',
                path: 'KidozEventsLogAsJsonParsed.DeviceParams.Country',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: [
                {
                    context: 'body',
                    path: 'KidozEventsLogAsJsonParsed.DeviceParams.SdkVersion',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'KidozEventsLogAsJsonParsed.Entries.*.EventParams.SdkVersion',
                    reasoning: 'obvious property name',
                },
            ],
        },
    },

    {
        slug: 'vast-api-waterfall',
        name: 'Kidoz (vast/api/waterfall)',
        tracker,

        endpointUrls: ['https://vast.kidoz.net/api/waterfall'],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: {
            manufacturer: [
                {
                    context: 'query',
                    path: 'manufacturer',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'brand',
                    reasoning: 'obvious property name',
                },
            ],

            propertyId: {
                context: 'query',
                path: 'publisher_id',
                reasoning: 'obvious property name',
            },

            userAgent: {
                context: 'query',
                path: 'User-Agent',
                reasoning: 'obvious property name',
            },

            deviceId: {
                context: 'query',
                path: 'device_hash',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'query',
                path: 'device_lang',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'query',
                path: 'os_type',
                reasoning: 'obvious observed values',
            },

            trackerSdkVersion: [
                {
                    context: 'query',
                    path: 'sdk_version',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'actual_sdk_version',
                    reasoning: 'obvious property name',
                },
            ],

            networkConnectionType: {
                context: 'query',
                path: 'network_type',
                notIf: 'Unknown',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'query',
                path: 'package_id',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'query',
                path: 'model',
                reasoning: 'obvious property name',
            },

            appVersion: [
                {
                    context: 'query',
                    path: 'app_version_code',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'app_version_name',
                    reasoning: 'obvious property name',
                },
            ],

            osVersion: {
                context: 'query',
                path: 'os_version',
                reasoning: 'obvious property name',
            },

            advertisingId: {
                context: 'query',
                path: 'google_id',
                reasoning: 'observed values match known device parameters',
            },

            carrier: {
                context: 'query',
                path: 'carrier_name',
                reasoning: 'obvious property name',
            },
        },
    },

    {
        slug: 'api-vast-error-gif',
        name: 'Kidoz (api/vast/error.gif)',
        tracker,

        endpointUrls: ['https://a.kidoz.net/api/vast/error.gif', 'https://analytics.kidoz.net/api/vast/error.gif'],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: {
            appId: {
                context: 'query',
                path: 'app_id',
                reasoning: 'obvious property name',
            },

            propertyId: {
                context: 'query',
                path: 'publisher_id',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'query',
                path: 'sdk_version',
                reasoning: 'obvious property name',
            },

            deviceId: {
                context: 'query',
                path: 'device_hash',
                reasoning: 'obvious property name',
            },

            publicIp: {
                context: 'query',
                path: 'wip',
                reasoning: 'observed values match known device parameters',
            },

            osVersion: {
                context: 'query',
                path: 'os_version',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'query',
                path: 'device_lang',
                reasoning: 'obvious property name',
            },
        },
    },

    {
        slug: 'sdk-api-api-initsdk',
        name: 'Kidoz (sdk-api/api/initSDK)',
        tracker,

        endpointUrls: ['https://sdk-api.kidoz.net/api/initSDK'],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: {
            manufacturer: {
                context: 'query',
                path: 'manufacturer',
                reasoning: 'obvious property name',
            },

            propertyId: {
                context: 'query',
                path: 'publisher_id',
                reasoning: 'obvious property name',
            },

            deviceId: {
                context: 'query',
                path: 'device_hash',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'query',
                path: 'device_lang',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'query',
                path: 'os_type',
                reasoning: 'obvious observed values',
            },

            trackerSdkVersion: [
                {
                    context: 'query',
                    path: 'sdk_version',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'actual_sdk_version',
                    reasoning: 'obvious property name',
                },
            ],

            networkConnectionType: {
                context: 'query',
                path: 'network_type',
                notIf: 'Unknown',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'query',
                path: 'package_id',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'query',
                path: 'model',
                reasoning: 'obvious property name',
            },

            appVersion: [
                {
                    context: 'query',
                    path: 'app_version_code',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'app_version_name',
                    reasoning: 'obvious property name',
                },
            ],

            osVersion: {
                context: 'query',
                path: 'os_version',
                reasoning: 'obvious property name',
            },

            advertisingId: {
                context: 'query',
                path: 'google_id',
                reasoning: 'observed values match known device parameters',
            },

            carrier: {
                context: 'query',
                path: 'carrier_name',
                reasoning: 'obvious property name',
            },
        },
    },

    {
        slug: 'openrtb2-vast',
        name: 'Kidoz (openrtb2/vast)',
        tracker,

        endpointUrls: ['https://v.kidoz.net/openrtb2/vast', 'https://prebid-adapter.kidoz.net/openrtb2/vast'],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: {
            appId: [
                {
                    context: 'query',
                    path: 'app_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'app_store_url',
                    reasoning: 'obvious property name',
                },
            ],

            appName: {
                context: 'query',
                path: 'app_title',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'query',
                path: 'app_version',
                reasoning: 'obvious property name',
            },

            country: {
                context: 'query',
                path: 'country_code',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'query',
                path: 'screen_width',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'query',
                path: 'screen_height',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'query',
                path: 'device_language',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'query',
                path: 'platform',
                reasoning: 'obvious property name',
            },

            osVersion: {
                context: 'query',
                path: 'os_version',
                reasoning: 'obvious property name',
            },

            userAgent: {
                context: 'query',
                path: 'user_agent',
                reasoning: 'obvious property name',
            },

            publicIp: [
                {
                    context: 'query',
                    path: 'client_ip',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'wip',
                    reasoning: 'observed values match known device parameters',
                },
            ],

            manufacturer: {
                context: 'query',
                path: 'brand',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'query',
                path: 'model',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'query',
                path: 'sdk_version',
                reasoning: 'obvious property name',
            },

            timezone: {
                context: 'query',
                path: 'timezone',
                reasoning: 'obvious property name',
            },

            carrier: {
                context: 'query',
                path: 'carrier',
                reasoning: 'obvious property name',
            },

            deviceId: {
                context: 'query',
                // There is a `ifa_type` parameter that can for example also be `sessionid`, so we can't list this as
                // the advertising ID.
                path: 'ifa',
                reasoning: 'obvious property name',
            },

            propertyId: {
                context: 'query',
                path: 'publisher_id',
                reasoning: 'obvious property name',
            },
        },
    },
];
