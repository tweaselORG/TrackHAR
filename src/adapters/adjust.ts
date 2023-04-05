import type { Adapter, Context, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'adjust',
    name: 'Adjust GmbH',
    datenanfragenSlug: 'adjust-com',
    exodusId: 52,
};

const containedDataPaths = (context: Context): Adapter['containedDataPaths'] => ({
    appId: [
        {
            context,
            path: 'package_name',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'bundle_id',
            reasoning: 'obvious property name',
        },
    ],

    appVersion: {
        context,
        path: 'app_version',
        reasoning: 'obvious property name',
    },

    idfa: [
        {
            context,
            path: 'gps_adid',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'idfa',
            reasoning: 'obvious property name',
        },
    ],

    idfv: {
        context,
        path: 'idfv',
        reasoning: 'obvious property name',
    },

    otherIdentifiers: [
        {
            context,
            path: 'android_uuid',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'ios_uuid',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'fb_anon_id',
            reasoning: 'obvious property name',
        },
    ],

    language: {
        context,
        path: 'language',
        reasoning: 'obvious property name',
    },

    manufacturer: {
        context,
        path: 'device_manufacturer',
        reasoning: 'obvious property name',
    },

    model: {
        context,
        path: 'device_name',
        reasoning: 'obvious observed values',
    },

    screenWidth: {
        context,
        path: 'display_width',
        reasoning: 'obvious property name',
    },

    screenHeight: {
        context,
        path: 'display_height',
        reasoning: 'obvious property name',
    },

    osName: {
        context,
        path: 'os_name',
        reasoning: 'obvious property name',
    },

    osVersion: [
        {
            context,
            path: 'os_version',
            reasoning: 'obvious property name',
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
        reasoning: 'obvious property name',
    },
});

export const adapters: Adapter[] = [
    {
        slug: 'body',
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
        containedDataPaths: containedDataPaths('body'),
    },

    {
        slug: 'qs',
        tracker,

        endpointUrls: [/^https:\/\/app(\.eu)?\.adjust\.(com|net\.in|world)\/attribution$/],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: containedDataPaths('body'),
    },
];
