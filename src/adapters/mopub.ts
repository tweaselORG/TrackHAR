import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'mopub',
    name: 'MoPub',
    description: 'mopub',
    exodusId: 35,
};

const keyUrl = (lineNumber: number) =>
    `https://github.com/mopub/mopub-ios-sdk/blob/4b5e70e4ff69b0c3f4ab71a8791f5e7351ad2828/MoPubSDK/Internal/MPAdServerKeys.m#L${lineNumber}` as const;

export const adapters: Adapter[] = [
    {
        slug: 'ads',
        name: 'MoPub SDK',
        tracker,

        endpointUrls: [
            'https://ads.mopub.com/m/open',
            'https://ads.mopub.com/m/gdpr_sync',
            'https://ads.mopub.com/m/ad',
        ],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            appId: [
                {
                    context: 'body',
                    path: 'bundle',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'id',
                    onlyIf: /^[a-z0-9]+\.[a-z0-9.]+$/i,
                    reasoning: 'obvious observed values',
                },
            ],

            appVersion: {
                context: 'body',
                path: 'av',
                reasoning: keyUrl(14),
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'nv',
                reasoning: keyUrl(19),
            },

            advertisingId: [
                {
                    context: 'body',
                    path: 'consent_ifa',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: '$[?(@property === "udid" && @.match(/ifa:/i))]',
                    reasoning: 'obvious observed values',
                },
            ],

            developerScopedId: {
                context: 'body',
                path: 'ifv',
                reasoning: keyUrl(31),
            },

            otherIdentifiers: {
                context: 'body',
                path: '$[?(@property === "udid" && !@.match(/ifa:/i))]',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'os',
                reasoning: 'obvious observed values',
            },

            osVersion: {
                context: 'body',
                path: 'osv',
                reasoning: 'obvious observed values',
            },

            manufacturer: [
                {
                    context: 'body',
                    path: 'make',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'hwv',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'body',
                    path: 'dn',
                    reasoning: keyUrl(24),
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
                    path: 'dn',
                    reasoning: keyUrl(24),
                },
            ],

            timezone: {
                context: 'body',
                path: 'z',
                reasoning: keyUrl(36),
            },

            carrier: {
                context: 'body',
                path: 'cn',
                reasoning: keyUrl(39),
            },

            screenWidth: {
                context: 'body',
                path: 'w',
                reasoning: keyUrl(45),
            },

            screenHeight: {
                context: 'body',
                path: 'h',
                reasoning: keyUrl(46),
            },
        },
    },
];
