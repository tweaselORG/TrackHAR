import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'microsoft',
    name: 'Microsoft Ireland Operations Ltd.',
    datenanfragenSlug: 'microsoft',
    exodusId: 243,
};

export const adapters: Adapter[] = [
    {
        slug: 'appcenter-logs',
        tracker,

        endpointUrls: ['https://in.appcenter.ms/logs'],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            appId: {
                context: 'body',
                path: 'logs.*.device.appNamespace',
                reasoning: 'obvious observed values',
            },

            appVersion: {
                context: 'body',
                path: 'logs.*.device.appVersion',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'logs.*.device.sdkVersion',
                reasoning: 'obvious property name',
            },

            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'logs.*.sid',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'logs.*.userId',
                    reasoning: 'obvious property name',
                },
            ],

            manufacturer: {
                context: 'body',
                path: 'logs.*.device.oemName',
                reasoning: 'obvious property name',
            },

            model: {
                context: 'body',
                path: 'logs.*.device.model',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'logs.*.device.osName',
                reasoning: 'obvious property name',
            },

            osVersion: [
                {
                    context: 'body',
                    path: 'logs.*.device.osVersion',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'logs.*.device.osBuild',
                    reasoning: 'obvious property name',
                },
            ],

            language: {
                context: 'body',
                path: 'logs.*.device.locale',
                reasoning: 'obvious property name',
            },

            country: {
                context: 'body',
                path: 'logs.*.device.locale',
                reasoning: 'obvious property name',
            },

            timezone: {
                context: 'body',
                path: 'logs.*.device.timeZoneOffset',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'logs.*.device.screenSize',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'logs.*.device.screenSize',
                reasoning: 'obvious property name',
            },

            carrier: {
                context: 'body',
                path: 'logs.*.device.carrierName',
                reasoning: 'obvious property name',
            },
        },
    },
];
