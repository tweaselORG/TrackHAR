import type { Adapter, Context, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'start-io',
    name: 'Start.io Inc.',
    datenanfragenSlug: 'start-io',
    exodusId: 195,
};

const containedDataPaths = (context: Context): Adapter['containedDataPaths'] => ({
    appId: {
        context,
        path: 'packageId',
        reasoning: 'obvious property name',
    },

    appVersion: {
        context,
        path: 'appVersion',
        reasoning: 'obvious property name',
    },

    viewedPage: {
        context,
        path: 'appActivity',
        reasoning: 'obvious property name',
    },

    isInForeground: {
        context,
        path: 'fgApp',
        reasoning: 'obvious property name',
    },

    trackerSdkVersion: {
        context,
        path: 'sdkVersion',
        reasoning: 'obvious property name',
    },

    otherIdentifiers: {
        context,
        path: 'clientSessionId',
        reasoning: 'obvious property name',
    },

    osName: {
        context,
        path: 'os',
        reasoning: 'obvious property name',
    },

    osVersion: {
        context,
        path: 'deviceVersion',
        reasoning: 'obvious property name',
    },

    idfa: {
        context,
        path: 'userAdvertisingId',
        reasoning: 'obvious property name',
    },

    manufacturer: {
        context,
        path: 'manufacturer',
        reasoning: 'obvious property name',
    },

    model: {
        context,
        path: 'model',
        reasoning: 'obvious property name',
    },

    language: {
        context,
        path: 'locale',
        reasoning: 'obvious property name',
    },

    screenWidth: {
        context,
        path: 'width',
        reasoning: 'obvious property name',
    },

    screenHeight: {
        context,
        path: 'height',
        reasoning: 'obvious property name',
    },

    isRoaming: {
        context,
        path: 'roaming',
        reasoning: 'obvious property name',
    },

    uptime: {
        context,
        path: 'timeSinceBoot',
        reasoning: 'obvious property name',
    },

    isRooted: {
        context,
        path: 'root',
        reasoning: 'obvious property name',
    },

    orientation: {
        context,
        path: 'orientation',
        reasoning: 'obvious property name',
    },

    carrier: [
        {
            context,
            path: 'ispName',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: 'ispCarrIdName',
            reasoning: 'obvious property name',
        },
    ],

    ramUsed: {
        context,
        path: 'usedRam',
        reasoning: 'obvious property name',
    },

    ramFree: {
        context,
        path: 'freeRam',
        reasoning: 'obvious property name',
    },

    networkConnectionType: {
        context,
        path: 'grid',
        reasoning: 'obvious observed values',
    },

    signalStrengthCellular: {
        context,
        path: 'cellSignalLevel',
        reasoning: 'obvious property name',
    },

    signalStrengthWifi: {
        context,
        path: 'wifiSignalLevel',
        reasoning: 'obvious property name',
    },
});

export const adapters: Adapter[] = [
    {
        slug: 'infoevent',
        name: 'Start.io (infoevent)',
        tracker,

        endpointUrls: [
            'https://infoevent.startappservice.com/tracking/infoEvent',
            'https://infoevent.startappservice.com/infoevent/api/v1.0/info',
        ],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: containedDataPaths('body'),
    },

    {
        slug: 'trackdownload',
        name: 'Start.io (trackdownload)',
        tracker,

        endpointUrls: ['https://trackdownload.startappservice.com/trackdownload/api/1.0/trackdownload'],

        decodingSteps: [{ function: 'parseQueryString', input: 'query', output: 'res.query' }],
        containedDataPaths: containedDataPaths('query'),
    },
];
