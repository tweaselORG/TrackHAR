import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'facebook',
    name: 'Facebook',
    datenanfragenSlug: 'facebook',
};

const graphActivitiesEndpointRegex = /^https:\/\/graph\.facebook\.com\/v\d{1,2}.\d\/\d+\/activities$/;

const graphContainedDataPaths: Adapter['containedDataPaths'] = {
    appId: {
        context: 'body',
        path: 'application_package_name',
        reasoning: 'obvious property name',
    },

    trackerSdkVersion: {
        context: 'body',
        path: 'sdk_version',
        reasoning: 'obvious property name',
    },

    idfa: {
        context: 'body',
        path: 'advertiser_id',
        reasoning: 'obvious property name',
    },

    otherIdentifiers: [
        {
            context: 'body',
            path: 'anon_id',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'app_user_id',
            reasoning: 'obvious property name',
        },
    ],

    osName: [
        {
            context: 'body',
            path: 'platform',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'sdk',
            reasoning: 'obvious observed values',
        },
    ],

    osVersion: {
        context: 'body',
        path: 'os_version',
        reasoning: 'obvious property name',
    },
};
const graph2ContainedDataPaths: Adapter['containedDataPaths'] = {
    appId: [
        {
            context: 'body',
            path: 'BUNDLE',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.BUNDLE',
            reasoning: 'obvious property name',
        },
    ],

    appVersion: [
        {
            context: 'body',
            path: 'APPVERS',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.APPVERS',
            reasoning: 'obvious property name',
        },
    ],

    idfa: [
        {
            context: 'body',
            path: 'IDFA',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.IDFA',
            reasoning: 'obvious property name',
        },
    ],

    otherIdentifiers: [
        {
            context: 'body',
            path: 'SESSION_ID',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'ANON_ID',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.SESSION_ID',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANON_ID',
            reasoning: 'obvious property name',
        },
    ],

    manufacturer: [
        {
            context: 'body',
            path: 'MAKE',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.MAKE',
            reasoning: 'obvious property name',
        },
    ],

    model: [
        {
            context: 'body',
            path: 'MODEL',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.MODEL',
            reasoning: 'obvious property name',
        },
    ],

    isEmulator: [
        {
            context: 'body',
            path: 'VALPARAMS.is_emu',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.VALPARAMS.is_emu',
            reasoning: 'obvious property name',
        },
    ],

    isRooted: [
        {
            context: 'body',
            path: 'ROOTED',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ROOTED',
            reasoning: 'obvious property name',
        },
    ],

    carrier: [
        {
            context: 'body',
            path: 'CARRIER',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.CARRIER',
            reasoning: 'obvious property name',
        },
    ],

    screenHeight: [
        {
            context: 'body',
            path: 'SCREEN_HEIGHT',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.SCREEN_HEIGHT',
            reasoning: 'obvious property name',
        },
    ],

    screenWidth: [
        {
            context: 'body',
            path: 'SCREEN_WIDTH',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.SCREEN_WIDTH',
            reasoning: 'obvious property name',
        },
    ],

    osName: [
        {
            context: 'body',
            path: 'OS',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.OS',
            reasoning: 'obvious property name',
        },
    ],

    osVersion: [
        {
            context: 'body',
            path: 'OSVERS',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.OSVERS',
            reasoning: 'obvious property name',
        },
    ],

    isCharging: [
        {
            context: 'body',
            path: 'ANALOG.charging',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.charging',
            reasoning: 'obvious property name',
        },
    ],

    batteryLevel: [
        {
            context: 'body',
            path: 'ANALOG.battery',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.battery',
            reasoning: 'obvious property name',
        },
    ],

    ramTotal: [
        {
            context: 'body',
            path: 'ANALOG.total_memory',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.total_memory',
            reasoning: 'obvious property name',
        },
    ],

    ramFree: [
        {
            context: 'body',
            path: 'ANALOG.available_memory',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.available_memory',
            reasoning: 'obvious property name',
        },
    ],

    diskFree: [
        {
            context: 'body',
            path: 'ANALOG.free_space',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.free_space',
            reasoning: 'obvious property name',
        },
    ],

    accelerometerX: [
        {
            context: 'body',
            path: 'ANALOG.accelerometer_x',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.accelerometer_x',
            reasoning: 'obvious property name',
        },
    ],

    accelerometerY: [
        {
            context: 'body',
            path: 'ANALOG.accelerometer_y',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.accelerometer_y',
            reasoning: 'obvious property name',
        },
    ],

    accelerometerZ: [
        {
            context: 'body',
            path: 'ANALOG.accelerometer_z',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.accelerometer_z',
            reasoning: 'obvious property name',
        },
    ],

    rotationX: [
        {
            context: 'body',
            path: 'ANALOG.rotation_x',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.rotation_x',
            reasoning: 'obvious property name',
        },
    ],

    rotationY: [
        {
            context: 'body',
            path: 'ANALOG.rotation_y',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.rotation_y',
            reasoning: 'obvious property name',
        },
    ],

    rotationZ: [
        {
            context: 'body',
            path: 'ANALOG.rotation_z',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.ANALOG.rotation_z',
            reasoning: 'obvious property name',
        },
    ],

    language: [
        {
            context: 'body',
            path: 'LOCALE',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'context.LOCALE',
            reasoning: 'obvious property name',
        },
    ],
};

export const adapters: Adapter[] = [
    {
        slug: 'graph-activities-json',
        tracker,

        endpointUrls: [graphActivitiesEndpointRegex],
        match: (r) => r.content?.startsWith('{"'),

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: graphContainedDataPaths,
    },

    {
        slug: 'graph-activities-qs',
        tracker,

        endpointUrls: [graphActivitiesEndpointRegex],
        match: (r) => r.content?.startsWith('format=json&'),

        decodingSteps: [{ function: 'parseQueryString', input: 'body', output: 'res.body' }],
        containedDataPaths: graphContainedDataPaths,
    },

    {
        slug: 'graph',
        tracker,

        endpointUrls: [/^https:\/\/graph\.facebook\.com\/v\d{1,2}.\d$/],
        match: (r) => r.content?.startsWith('format=json&'),

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'b' },
            { function: 'parseJson', input: 'b.batch', output: 'batch' },
            { function: 'getProperty', mapInput: 'batch', options: { path: 'relative_url' }, output: 'relativeUrls' },
            { function: 'parseQueryString', mapInput: 'relativeUrls', output: 'res.body' },
            { function: 'getProperty', input: 'b', options: { path: 'batch_app_id' }, output: 'res.body.batch_app_id' },
        ],
        containedDataPaths: graphContainedDataPaths,
    },

    {
        slug: 'graph-network-ads-common',
        tracker,

        endpointUrls: ['https://graph.facebook.com/network_ads_common'],

        decodingSteps: [{ function: 'parseQueryString', input: 'body', output: 'res.body' }],
        containedDataPaths: graph2ContainedDataPaths,
    },

    {
        slug: 'adnw-sync2',
        tracker,

        endpointUrls: [/^https:\/\/(www|web)\.facebook\.com\/adnw_sync2$/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'body', output: 'q' },
            { function: 'getProperty', input: 'q', options: { path: 'payload' }, output: 'payload' },
            { function: 'parseJson', input: 'payload', output: 'res.body' },
            { function: 'parseJson', input: 'res.body.VALPARAMS', output: 'res.body.VALPARAMS' },
            { function: 'parseJson', input: 'res.body.ANALOG', output: 'res.body.ANALOG' },
        ],
        containedDataPaths: graph2ContainedDataPaths,
    },
];
