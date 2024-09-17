import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'adcolony',
    name: 'AdColony, Inc.',
    datenanfragenSlug: 'adcolony',
    exodusId: 90,
};

export const adapters: Adapter[] = [
    {
        slug: 'adc3-launch',
        name: 'AdColony (adc3-launch)',
        tracker,

        endpointUrls: ['https://adc3-launch.adcolony.com/v4/launch'],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            advertisingId: {
                context: 'body',
                path: 'advertiser_id',
                reasoning: 'obvious observed values',
            },

            otherIdentifiers: {
                context: 'body',
                path: 'device_id',
                reasoning: 'obvious property name',
            },

            carrier: {
                context: 'body',
                path: 'carrier_name',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'screen_width',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'screen_height',
                reasoning: 'obvious property name',
            },

            language: [
                {
                    context: 'body',
                    path: 'locale_language_code',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'ln',
                    reasoning: 'obvious property name',
                },
            ],

            macAddress: {
                context: 'body',
                path: 'mac_address',
                reasoning: 'obvious property name',
            },

            manufacturer: [
                {
                    context: 'body',
                    path: 'manufacturer',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device_brand',
                    reasoning: 'obvious property name',
                },
            ],

            model: [
                {
                    context: 'body',
                    path: 'model',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device_model',
                    reasoning: 'obvious property name',
                },
            ],

            networkConnectionType: {
                context: 'body',
                path: 'network_type',
                reasoning: 'obvious property name',
            },

            osName: [
                {
                    context: 'body',
                    path: 'os_name',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'platform',
                    reasoning: 'obvious observed values',
                },
            ],

            osVersion: {
                context: 'body',
                path: 'os_version',
                reasoning: 'obvious property name',
            },

            architecture: {
                context: 'body',
                path: 'arch',
                reasoning: 'obvious property name',
            },

            batteryLevel: {
                context: 'body',
                path: 'battery_level',
                reasoning: 'obvious property name',
            },

            timezone: {
                context: 'body',
                path: 'timezone_ietf',
                reasoning: 'obvious property name',
            },

            orientation: {
                context: 'body',
                path: 'current_orientation',
                reasoning: 'obvious property name',
            },

            isInDarkMode: {
                context: 'body',
                path: 'dark_mode',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'sdk_version',
                reasoning: 'obvious property name',
            },

            appName: {
                context: 'body',
                path: 'app_bundle_name',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'app_bundle_version',
                reasoning: 'obvious property name',
            },
        },
    },

    {
        slug: 'configure',
        name: 'AdColony (configure)',
        tracker,

        endpointUrls: [/^https:\/\/(android|ios)?ads\d-?\d\.adcolony\.com\/configure$/],
        match: (r) => r.content?.startsWith('{"'),

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            appId: {
                context: 'body',
                path: 'bundle_id',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'bundle_version_short',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'os_name',
                reasoning: 'obvious property name',
            },

            osVersion: {
                context: 'body',
                path: 'os_version',
                reasoning: 'obvious property name',
            },

            advertisingId: {
                context: 'body',
                path: 'advertiser_id',
                reasoning: 'obvious property name',
            },

            developerScopedId: {
                context: 'body',
                path: 'vendor_id',
                reasoning: 'obvious property name',
            },

            otherIdentifiers: {
                context: 'body',
                path: 'sid',
                reasoning: 'obvious property name',
            },

            carrier: {
                context: 'body',
                path: 'carrier',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'body',
                path: 'ln',
                reasoning: 'obvious property name',
            },

            manufacturer: [
                {
                    context: 'body',
                    path: 'device_brand',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'manufacturer',
                    reasoning: 'obvious property name',
                },
            ],

            model: {
                context: 'body',
                path: 'device_model',
                reasoning: 'obvious property name',
            },

            batteryLevel: {
                context: 'body',
                path: 'battery_level',
                reasoning: 'obvious property name',
            },

            orientation: {
                context: 'body',
                path: 'current_orientation',
                reasoning: 'obvious property name',
            },

            timezone: {
                context: 'body',
                path: 'timezone_ietf',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'screen_width',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'screen_height',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'sdk_version',
                reasoning: 'obvious property name',
            },
        },
    },
];
