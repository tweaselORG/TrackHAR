import { emptyIdfa } from '../common/adapter-util';
import type { Adapter, Context, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'adjust',
    name: 'Adjust GmbH',
    description: 'adjust',
    datenanfragenSlug: 'adjust-com',
    exodusId: 52,
};

const containedDataPaths = (context: Context): Adapter['containedDataPaths'] => ({
    appId: [
        {
            context,
            path: 'package_name',
            reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
        },
        {
            context,
            path: 'bundle_id',
            reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
        },
    ],

    appVersion: [
        {
            context,
            path: 'app_version',
            reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
        },
        {
            context,
            path: 'app_version_short',
            reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
        },
    ],

    advertisingId: [
        {
            context,
            path: 'gps_adid',
            reasoning: 'https://help.adjust.com/en/article/device-identifiers',
        },
        {
            context,
            path: 'idfa',
            notIf: emptyIdfa,
            reasoning: 'https://help.adjust.com/en/article/device-identifiers',
        },
    ],

    developerScopedId: [
        {
            context,
            path: 'idfv',
            reasoning: 'https://help.adjust.com/en/article/device-identifiers',
        },
        {
            context,
            path: 'android_id',
            reasoning: 'https://help.adjust.com/en/article/device-identifiers',
        },
    ],

    deviceId: [
        {
            context,
            path: 'android_uuid',
            reasoning: 'adjust/uuid.md',
        },
        {
            context,
            path: 'ios_uuid',
            reasoning: 'adjust/uuid.md',
        },
        {
            context,
            path: 'persistent_ios_uuid',
            reasoning: 'adjust/uuid.md',
        },
        {
            context,
            path: 'web_uuid',
            reasoning: 'adjust/uuid.md',
        },
        {
            context,
            path: 'fb_anon_id',
            reasoning: 'adjust/fb_anon_id.md',
        },
        {
            context,
            path: 'external_device_id',
            reasoning: 'https://help.adjust.com/en/article/external-device-identifiers',
        },
    ],

    language: {
        context,
        path: 'language',
        reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
    },

    model: {
        context,
        path: 'device_name',
        reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
    },

    osName: {
        context,
        path: 'os_name',
        reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
    },

    osVersion: [
        {
            context,
            path: 'os_version',
            reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
        },
        {
            context,
            path: 'os_build',
            reasoning: 'obvious property name',
        },
    ],

    country: {
        context,
        path: 'country',
        reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
    },

    installTime: {
        context,
        path: 'installed_at',
        reasoning: 'adjust/installed_at.md',
    },
});

export const adapters: Adapter[] = [
    {
        slug: 'body',
        name: 'Adjust (POST body)',
        tracker,

        endpointUrls: [
            /^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/session$/,
            /^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/event$/,
            /^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/sdk_click$/,
            /^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/sdk_info$/,
            /^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/third_party_sharing$/,
            /^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/ad_revenue$/,
            /^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/sdk_click$/,
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'body', output: 'res.body' },
            { function: 'parseJson', input: 'res.body.partner_params', output: 'res.body.partner_params' },
            { function: 'parseJson', input: 'res.body.callback_params', output: 'res.body.callback_params' },
        ],
        containedDataPaths: {
            ...containedDataPaths('body'),

            manufacturer: {
                context: 'body',
                path: 'device_manufacturer',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'display_width',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'display_height',
                reasoning: 'obvious property name',
            },

            timeSpent: [
                {
                    context: 'body',
                    path: 'session_length',
                    reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
                },
                {
                    context: 'body',
                    path: 'time_spent',
                    reasoning: 'https://help.adjust.com/en/article/server-to-server-sessions',
                },
            ],

            revenue: {
                context: 'body',
                path: 'revenue',
                reasoning: 'https://help.adjust.com/en/article/s2s-ad-revenue',
            },
        },
    },

    {
        slug: 'qs',
        name: 'Adjust (query string)',
        tracker,

        endpointUrls: [
            /^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/attribution$/,
            /^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/measurement_consent$/,
        ],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: containedDataPaths('query'),
    },
];
