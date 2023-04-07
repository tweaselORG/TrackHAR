import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'branch-io',
    name: 'Branch Metrics, Inc.',
    datenanfragenSlug: 'branch-io',
    exodusId: 167,
};

export const adapters: Adapter[] = [
    {
        slug: 'v1',
        tracker,

        endpointUrls: [
            /^https:\/\/api2?\.branch\.io\/v1\/install$/,
            /^https:\/\/api2?\.branch\.io\/v1\/open$/,
            /^https:\/\/api2?\.branch\.io\/v1\/close$/,
            /^https:\/\/api2?\.branch\.io\/v1\/profile$/,
            /^https:\/\/api2?\.branch\.io\/v1\/logout$/,
        ],
        match: (r) => r.content?.startsWith('{"'),

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            idfa: [
                {
                    context: 'body',
                    path: 'google_advertising_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'advertising_ids.aaid',
                    reasoning: 'obvious property name',
                },
            ],

            idfv: {
                context: 'body',
                path: 'ios_vendor_id',
                reasoning: 'obvious property name',
            },

            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'hardware_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'metadata.$marketing_cloud_visitor_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'metadata.$braze_install_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'metadata.device_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'metadata.uuid',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'metadata.$google_analytics_client_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'metadata.$mixpanel_distinct_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'metadata.$segment_anonymous_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'metadata.transaction_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'metadata.user_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'UDID',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device_fingerprint_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'identity_id',
                    reasoning: 'obvious property name',
                },
            ],

            manufacturer: {
                context: 'body',
                path: 'brand',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'body',
                path: 'model',
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

            networkConnectionType: {
                context: 'body',
                path: 'connection_type',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'os',
                reasoning: 'obvious property name',
            },

            osVersion: [
                {
                    context: 'body',
                    path: 'os_version_android',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'os_version',
                    reasoning: 'obvious property name',
                },
            ],

            language: [
                {
                    context: 'body',
                    path: 'language',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'locale',
                    reasoning: 'obvious property name',
                },
            ],

            localIp: {
                context: 'body',
                path: 'local_ip',
                reasoning: 'obvious property name',
            },

            architecture: {
                context: 'body',
                path: 'cpu_type',
                reasoning: 'obvious property name',
            },

            carrier: {
                context: 'body',
                path: 'device_carrier',
                reasoning: 'obvious property name',
            },

            userAgent: {
                context: 'body',
                path: 'user_agent',
                reasoning: 'obvious property name',
            },

            country: {
                context: 'body',
                path: 'country',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'app_version',
                reasoning: 'obvious property name',
            },

            appId: [
                {
                    context: 'body',
                    path: 'cd.pn',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'body',
                    path: 'ios_bundle_id',
                    reasoning: 'obvious property name',
                },
            ],

            trackerSdkVersion: {
                context: 'body',
                path: 'sdk',
                reasoning: 'obvious property name',
            },
        },
    },
];
