import type { Adapter, Context, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'google',
    name: 'Google LLC',
    datenanfragenSlug: 'google',
};

const containedDataPathsDoubleclickMadsGma = (context: Context): Adapter['containedDataPaths'] => ({
    manufacturer: {
        context,
        path: 'platform',
        reasoning: 'obvious property name',
    },

    model: {
        context,
        path: 'submodel',
        reasoning: 'obvious property name',
    },

    osName: {
        context,
        path: 'sys_name',
        reasoning: 'obvious property name',
    },

    osVersion: {
        context,
        path: 'os_version',
        reasoning: 'obvious property name',
    },

    volume: [
        {
            context,
            path: 'android_app_volume',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'ios_app_volume',
            reasoning: 'obvious property name',
        },
    ],

    language: {
        context,
        path: 'hl',
        reasoning: 'obvious observed values',
    },

    networkConnectionType: {
        context,
        path: 'net',
        reasoning: 'obvious property name',
    },

    architecture: {
        context,
        path: 'binary_arch',
        reasoning: 'obvious property name',
    },

    isRooted: {
        context,
        path: 'ios_jb',
        reasoning: 'obvious property name',
    },

    appId: [
        {
            context,
            path: 'app_name',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: '_package_name',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'an',
            reasoning: 'obvious observed values',
        },
        {
            context,
            path: 'msid',
            reasoning: 'obvious observed values',
        },
    ],

    trackerSdkVersion: {
        context,
        path: 'dtsdk',
        reasoning: 'obvious property name',
    },
});

export const adapters: Adapter[] = [
    {
        slug: 'app-measurement',
        tracker,

        endpointUrls: ['https://app-measurement.com/a'],

        decodingSteps: [
            { function: 'decodeProtobuf', input: 'body', output: 'res.body' },
            { function: 'ensureArray', input: 'res.body.1', output: 'res.body.1' },
        ],
        containedDataPaths: {
            appId: {
                context: 'body',
                path: '1.*.14',
                reasoning: 'obvious observed values',
            },

            appVersion: {
                context: 'body',
                path: '1.*.16',
                reasoning: 'obvious observed values',
            },

            idfa: {
                context: 'body',
                path: '1.*.19',
                reasoning: 'obvious observed values',
            },

            idfv: {
                context: 'body',
                path: '1.*.27',
                reasoning: 'obvious observed values',
            },

            osName: {
                context: 'body',
                path: '1.*.8',
                reasoning: 'obvious observed values',
            },

            osVersion: {
                context: 'body',
                path: '1.*.9',
                reasoning: 'obvious observed values',
            },
        },
    },

    {
        slug: 'device-provisioning-checkin',
        tracker,

        endpointUrls: ['https://device-provisioning.googleapis.com/checkin'],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            language: {
                context: 'body',
                path: 'locale',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'body',
                path: 'checkin.iosbuild.model',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'checkin.iosbuild.os_version',
                reasoning: 'obvious observed values',
            },

            osVersion: {
                context: 'body',
                path: 'checkin.iosbuild.os_version',
                reasoning: 'obvious property name',
            },

            timezone: [
                {
                    context: 'body',
                    path: 'time_zone',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'timezone',
                    reasoning: 'obvious property name',
                },
            ],
        },
    },

    {
        slug: 'fcmtoken-register',
        tracker,

        endpointUrls: ['https://fcmtoken.googleapis.com/register'],

        decodingSteps: [{ function: 'parseQueryString', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            osName: {
                context: 'body',
                path: 'plat',
                reasoning: 'obvious property name',
            },

            osVersion: {
                context: 'body',
                path: 'X-osv',
                reasoning: 'obvious property name',
            },

            otherIdentifiers: {
                context: 'body',
                path: 'device',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'body',
                path: 'app',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'app_ver',
                reasoning: 'obvious property name',
            },
        },
    },

    {
        slug: 'doubleclick-mads-gma-body',
        tracker,

        endpointUrls: ['https://googleads.g.doubleclick.net/mads/gma'],

        decodingSteps: [{ function: 'parseQueryString', input: 'body', output: 'res.body' }],
        containedDataPaths: containedDataPathsDoubleclickMadsGma('body'),
    },

    {
        slug: 'doubleclick-mads-gma-qs',
        tracker,

        endpointUrls: ['https://googleads.g.doubleclick.net/mads/gma'],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: containedDataPathsDoubleclickMadsGma('query'),
    },
];
