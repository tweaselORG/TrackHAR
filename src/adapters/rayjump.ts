import type { Adapter, Context, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'rayjump',
    name: 'Rayjump',
};

const containedDataPaths = (context: Context): Adapter['containedDataPaths'] => ({
    osName: [
        {
            context,
            path: 'os',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'db',
            reasoning: 'obvious observed values',
        },
    ],

    osVersion: [
        {
            context,
            path: 'osv',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'os_version',
            reasoning: 'obvious property name',
        },
    ],

    orientation: {
        context,
        path: 'orientation',
        reasoning: 'obvious property name',
    },

    manufacturer: {
        context,
        path: 'brand',
        reasoning: 'obvious property name',
    },

    model: {
        context,
        path: 'model',
        reasoning: 'obvious property name',
    },

    advertisingId: [
        {
            context,
            path: 'gaid',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'data.gaid',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'idfa',
            reasoning: 'obvious property name',
        },
    ],

    developerScopedId: {
        context,
        path: 'idfv',
        reasoning: 'obvious property name',
    },

    language: {
        context,
        path: 'language',
        reasoning: 'obvious property name',
    },

    timezone: {
        context,
        path: 'timezone',
        reasoning: 'obvious property name',
    },

    userAgent: [
        {
            context,
            path: 'useragent',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'ua',
            reasoning: 'obvious observed values',
        },
    ],

    screenWidth: {
        context,
        path: 'screen_size',
        reasoning: 'obvious property name',
    },

    screenHeight: {
        context,
        path: 'screen_size',
        reasoning: 'obvious property name',
    },

    appId: [
        {
            context,
            path: 'package_name',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'pn',
            reasoning: 'obvious observed values',
        },
    ],

    appVersion: {
        context,
        path: 'app_version_name',
        reasoning: 'obvious property name',
    },

    trackerSdkVersion: {
        context,
        path: 'sdk_version',
        reasoning: 'obvious property name',
    },

    country: [
        {
            context,
            path: 'ct',
            reasoning: 'obvious observed values',
        },
        {
            context,
            path: 'country_code',
            reasoning: 'obvious property name',
        },
    ],

    publicIp: {
        context,
        path: 'ip',
        reasoning: 'obvious property name',
    },
});

export const adapters: Adapter[] = [
    {
        slug: 'setting',
        name: 'Rayjump (setting)',
        tracker,

        endpointUrls: ['https://configure.rayjump.com/setting'],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: containedDataPaths('query'),
    },

    {
        slug: 'analytics',
        name: 'Rayjump (analytics)',
        tracker,

        endpointUrls: ['https://analytics.rayjump.com'],

        decodingSteps: [
            { function: 'decodeUrl', input: 'body', output: 'q' },
            { function: 'parseQueryString', input: 'q', output: 'res.body' },
            { function: 'parseQueryString', input: 'res.body.data', output: 'res.body.data' },
        ],
        containedDataPaths: containedDataPaths('body'),
    },
];
