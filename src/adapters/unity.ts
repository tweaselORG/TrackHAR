import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'unity',
    name: 'Unity Technologies ApS',
    datenanfragenSlug: 'unity3d',
    exodusId: 121,
};

export const adapters: Adapter[] = [
    {
        slug: 'unityads-games',
        name: 'Unity Ads',
        tracker,

        endpointUrls: [
            'https://publisher-config.unityads.unity3d.com/games/3268074/configuration',
            'https://auction.unityads.unity3d.com/v4/test/games/3268074/requests',
        ],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: {
            appId: {
                context: 'query',
                path: 'bundleId',
                reasoning: 'obvious property name',
            },

            manufacturer: {
                context: 'query',
                path: 'deviceMake',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'query',
                path: 'deviceModel',
                reasoning: 'obvious property name',
            },

            advertisingId: {
                context: 'query',
                path: 'advertisingTrackingId',
                reasoning: 'obvious observed values',
            },

            userId: {
                context: 'query',
                path: 'analyticsUserId',
                reasoning: 'obvious property name',
            },

            networkConnectionType: {
                context: 'query',
                path: 'connectionType',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'query',
                path: 'screenWidth',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'query',
                path: 'screenHeight',
                reasoning: 'obvious property name',
            },

            isRooted: {
                context: 'query',
                path: 'rooted',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'query',
                path: 'platform',
                reasoning: 'obvious property name',
            },

            osVersion: {
                context: 'query',
                path: 'osVersion',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'query',
                path: 'language',
                reasoning: 'obvious property name',
            },
        },
    },
];
