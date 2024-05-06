import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'facebook',
    name: 'Facebook',
    datenanfragenSlug: 'facebook',
};

const graphActivitiesEndpointRegex = /^https:\/\/graph\.facebook\.com\/v\d{1,2}.\d\/\d+\/activities$/;
const graphActivitiesDataPaths = ({
    pathPrefix,
    includeExtinfo,
}: {
    pathPrefix: string;
    includeExtinfo?: boolean;
}): Adapter['containedDataPaths'] => ({
    idfa: {
        context: 'body',
        path: pathPrefix + 'advertiser_id',
        reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
    },

    otherIdentifiers: [
        {
            context: 'body',
            path: pathPrefix + 'anon_id',
            reasoning: 'facebook/anon_id.md',
        },
        {
            context: 'body',
            path: pathPrefix + 'app_user_id',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },
        {
            context: 'body',
            path: pathPrefix + 'device_token',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },
    ],

    osName: {
        context: 'body',
        path: pathPrefix + 'sdk',
        reasoning: 'obvious observed values',
    },

    appId: [
        ...(includeExtinfo !== false
            ? [
                  {
                      context: 'body',
                      path: pathPrefix + 'extinfo.1',
                      reasoning:
                          'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
                  } as const,
              ]
            : []),
        {
            context: 'body',
            path: pathPrefix + 'application_package_name',
            reasoning: 'obvious property name',
        },
    ],

    ...(includeExtinfo !== false && {
        appVersion: [
            {
                context: 'body',
                path: pathPrefix + 'extinfo.2',
                reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
            },
            {
                context: 'body',
                path: pathPrefix + 'extinfo.3',
                reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
            },
        ],

        osVersion: {
            context: 'body',
            path: pathPrefix + 'extinfo.4',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },

        model: {
            context: 'body',
            path: pathPrefix + 'extinfo.5',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },

        language: {
            context: 'body',
            path: pathPrefix + 'extinfo.6',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },

        timezone: [
            {
                context: 'body',
                path: pathPrefix + 'extinfo.7',
                reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
            },
            {
                context: 'body',
                path: pathPrefix + 'extinfo.15',
                reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
            },
        ],

        carrier: {
            context: 'body',
            path: pathPrefix + 'extinfo.8',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },

        screenWidth: {
            context: 'body',
            path: pathPrefix + 'extinfo.9',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },

        screenHeight: {
            context: 'body',
            path: pathPrefix + 'extinfo.10',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },

        diskTotal: {
            context: 'body',
            path: pathPrefix + 'extinfo.13',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },

        diskFree: {
            context: 'body',
            path: pathPrefix + 'extinfo.14',
            reasoning: 'https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities',
        },
    }),
});

const adDataPaths = ({ pathPrefix }: { pathPrefix: string }): Adapter['containedDataPaths'] => ({
    appId: {
        context: 'body',
        path: pathPrefix + 'BUNDLE',
        reasoning: 'obvious property name',
    },

    appName: {
        context: 'body',
        path: pathPrefix + 'APPNAME',
        reasoning: 'obvious property name',
    },

    appVersion: {
        context: 'body',
        path: pathPrefix + 'APPVERS',
        reasoning: 'obvious property name',
    },

    idfa: {
        context: 'body',
        path: pathPrefix + 'IDFA',
        reasoning: 'obvious property name',
    },

    otherIdentifiers: {
        context: 'body',
        path: pathPrefix + 'SESSION_ID',
        reasoning: 'obvious property name',
    },

    manufacturer: {
        context: 'body',
        path: pathPrefix + 'MAKE',
        reasoning: 'obvious property name',
    },

    model: {
        context: 'body',
        path: pathPrefix + 'MODEL',
        reasoning: 'obvious property name',
    },

    isRooted: {
        context: 'body',
        path: pathPrefix + 'ROOTED',
        reasoning: 'obvious property name',
    },

    carrier: {
        context: 'body',
        path: pathPrefix + 'CARRIER',
        reasoning: 'obvious property name',
    },

    screenHeight: {
        context: 'body',
        path: pathPrefix + 'SCREEN_HEIGHT',
        reasoning: 'obvious property name',
    },

    screenWidth: {
        context: 'body',
        path: pathPrefix + 'SCREEN_WIDTH',
        reasoning: 'obvious property name',
    },

    osName: {
        context: 'body',
        path: pathPrefix + 'OS',
        reasoning: 'obvious property name',
    },

    osVersion: {
        context: 'body',
        path: pathPrefix + 'OSVERS',
        reasoning: 'obvious property name',
    },

    language: {
        context: 'body',
        path: pathPrefix + 'LOCALE',
        reasoning: 'obvious property name',
    },

    isEmulator: {
        context: 'body',
        path: pathPrefix + 'VALPARAMS.is_emu',
        reasoning: 'obvious property name',
    },

    timezone: {
        context: 'body',
        path: pathPrefix + 'VALPARAMS.timezone_offset',
        reasoning: 'obvious property name',
    },

    trackerSdkVersion: {
        context: 'body',
        path: pathPrefix + 'SDK_VERSION',
        reasoning: 'obvious property name',
    },

    ramTotal: {
        context: 'body',
        path: pathPrefix + 'ANALOG.total_memory',
        reasoning: 'obvious property name',
    },
    ramFree: {
        context: 'body',
        path: pathPrefix + 'ANALOG.available_memory',
        reasoning: 'obvious property name',
    },

    accelerometerX: {
        context: 'body',
        path: pathPrefix + 'ANALOG.accelerometer_x',
        reasoning: 'obvious property name',
    },
    accelerometerY: {
        context: 'body',
        path: pathPrefix + 'ANALOG.accelerometer_y',
        reasoning: 'obvious property name',
    },
    accelerometerZ: {
        context: 'body',
        path: pathPrefix + 'ANALOG.accelerometer_z',
        reasoning: 'obvious property name',
    },

    rotationX: {
        context: 'body',
        path: pathPrefix + 'ANALOG.rotation_x',
        reasoning: 'obvious property name',
    },
    rotationY: {
        context: 'body',
        path: pathPrefix + 'ANALOG.rotation_y',
        reasoning: 'obvious property name',
    },
    rotationZ: {
        context: 'body',
        path: pathPrefix + 'ANALOG.rotation_z',
        reasoning: 'obvious property name',
    },

    isCharging: {
        context: 'body',
        path: pathPrefix + 'ANALOG.charging',
        reasoning: 'obvious property name',
    },

    batteryLevel: {
        context: 'body',
        path: pathPrefix + 'ANALOG.battery',
        reasoning: 'obvious property name',
    },

    diskFree: {
        context: 'body',
        path: pathPrefix + 'ANALOG.free_space',
        reasoning: 'obvious property name',
    },
});

export const adapters: Adapter[] = [
    {
        slug: 'graph-activities-json',
        tracker,

        endpointUrls: [graphActivitiesEndpointRegex],
        match: (r) => r.content?.startsWith('{"'),

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'parseJson', input: 'res.body.extinfo', output: 'res.body.extinfo' },
        ],
        containedDataPaths: graphActivitiesDataPaths({ pathPrefix: '' }),
    },

    {
        slug: 'graph-activities-qs',
        tracker,

        endpointUrls: [graphActivitiesEndpointRegex],
        match: (r) => r.content?.includes('format=json&'),

        decodingSteps: [
            { function: 'parseQueryString', input: 'body', output: 'res.body' },
            { function: 'parseJson', input: 'res.body.extinfo', output: 'res.body.extinfo' },
        ],
        containedDataPaths: graphActivitiesDataPaths({ pathPrefix: '' }),
    },

    {
        slug: 'graph',
        tracker,

        endpointUrls: [/^https:\/\/graph\.facebook\.com\/v\d{1,2}.\d$/],
        match: (r) => r.content?.startsWith('{"'),

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'b' },
            { function: 'parseJson', input: 'b.batch', output: 'batch' },
            { function: 'getProperty', mapInput: 'batch', options: { path: 'relative_url' }, output: 'relativeUrls' },
            { function: 'parseQueryString', mapInput: 'relativeUrls', output: 'res.body.batch' },
            { function: 'getProperty', input: 'b', options: { path: 'batch_app_id' }, output: 'res.body.batch_app_id' },
        ],
        // The batch endpoint can receive requests to any of the other endpoints, so we would need to combine the data
        // paths here (see: https://developers.facebook.com/docs/graph-api/batch-requests).
        // However, from the traffic we have observed, it seems like it never receives `network_ads_common` or
        // `adnw_sync2` requests.
        containedDataPaths: graphActivitiesDataPaths({
            pathPrefix: 'batch.*.',
            // The batch objects _can_ have extinfo, but we currently don't support decoding that.
            includeExtinfo: false,
        }),
    },

    {
        slug: 'graph-network-ads-common',
        tracker,

        endpointUrls: ['https://graph.facebook.com/network_ads_common'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'body', output: 'res.body' },
            { function: 'parseJson', input: 'res.body.VALPARAMS', output: 'res.body.VALPARAMS' },
            { function: 'parseJson', input: 'res.body.ANALOG', output: 'res.body.ANALOG' },
        ],
        containedDataPaths: adDataPaths({ pathPrefix: '' }),
    },

    {
        slug: 'adnw-sync2',
        tracker,

        endpointUrls: [/^https:\/\/(www|web)\.facebook\.com\/adnw_sync2?$/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'body', output: 'q' },
            { function: 'getProperty', input: 'q', options: { path: 'payload' }, output: 'payload' },
            { function: 'parseJson', input: 'payload', output: 'res.body' },
            { function: 'parseJson', input: 'res.body.context.VALPARAMS', output: 'res.body.context.VALPARAMS' },
            { function: 'parseJson', input: 'res.body.context.ANALOG', output: 'res.body.context.ANALOG' },
        ],
        containedDataPaths: adDataPaths({ pathPrefix: 'context.' }),
    },
];
