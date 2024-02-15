import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'branch-io',
    name: 'Branch Metrics, Inc.',
    description: 'branch-io',
    datenanfragenSlug: 'branch-io',
    exodusId: 167,
};

export const adapters: Adapter[] = [
    {
        slug: 'v1',
        name: 'Branch Attribution API',
        description: 'branch-io-attribution-api',
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
                    reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
                },
                {
                    context: 'body',
                    path: 'advertising_ids.aaid',
                    reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
                },
            ],

            idfv: {
                context: 'body',
                path: 'ios_vendor_id',
                reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
            },

            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'hardware_id',
                    reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
                },
                {
                    context: 'body',
                    path: 'metadata.$marketing_cloud_visitor_id',
                    reasoning: 'https://help.branch.io/partners-portal/docs/adobe-analytics',
                },
                {
                    context: 'body',
                    path: 'metadata.$braze_install_id',
                    reasoning: 'https://help.branch.io/partners-portal/docs/braze',
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
                    reasoning: 'https://help.branch.io/partners-portal/docs/google-analytics',
                },
                {
                    context: 'body',
                    path: 'metadata.$mixpanel_distinct_id',
                    reasoning: 'https://help.branch.io/partners-portal/docs/mixpanel',
                },
                {
                    context: 'body',
                    path: 'metadata.$segment_anonymous_id',
                    reasoning: 'https://help.branch.io/partners-portal/docs/segment-export',
                },
                {
                    context: 'body',
                    path: 'metadata.user_id',
                    reasoning: 'https://help.branch.io/using-branch/docs/advertising-identifiers-for-attribution',
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
                {
                    context: 'body',
                    path: 'identity',
                    reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
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
                reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
            },

            screenHeight: {
                context: 'body',
                path: 'screen_height',
                reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
            },

            networkConnectionType: {
                context: 'body',
                path: 'connection_type',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'os',
                reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
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
                    reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
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
                reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
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
                reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
            },

            country: {
                context: 'body',
                path: 'country',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'app_version',
                reasoning: 'https://help.branch.io/developers-hub/reference/attribution-api',
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
