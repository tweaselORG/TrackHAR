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
        // See: https://learn.microsoft.com/en-us/appcenter/
        name: 'Visual Studio App Center',
        description: 'microsoft-appcenter',
        tracker,

        endpointUrls: ['https://in.appcenter.ms/logs'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            {
                function: 'getProperty',
                input: 'header',
                output: 'res.header.Install-ID',
                options: { path: 'Install-ID' },
            },
        ],
        containedDataPaths: {
            appId: {
                context: 'body',
                path: 'logs.*.device.appNamespace',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            appVersion: [
                {
                    context: 'body',
                    path: 'logs.*.device.appVersion',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
                {
                    context: 'body',
                    path: 'logs.*.device.appBuild',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
            ],

            trackerSdkVersion: {
                context: 'body',
                path: 'logs.*.device.sdkVersion',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            otherIdentifiers: [
                {
                    context: 'header',
                    path: 'Install-ID',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
                {
                    context: 'body',
                    path: 'logs.*.sid',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
                {
                    context: 'body',
                    path: 'logs.*.userId',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
            ],

            manufacturer: {
                context: 'body',
                path: 'logs.*.device.oemName',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            model: {
                context: 'body',
                path: 'logs.*.device.model',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            osName: {
                context: 'body',
                path: 'logs.*.device.osName',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            osVersion: [
                {
                    context: 'body',
                    path: 'logs.*.device.osVersion',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
                {
                    context: 'body',
                    path: 'logs.*.device.osBuild',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
                {
                    context: 'body',
                    path: 'logs.*.device.osApiLevel',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
            ],

            language: {
                context: 'body',
                path: 'logs.*.device.locale',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            timezone: {
                context: 'body',
                path: 'logs.*.device.timeZoneOffset',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            screenWidth: {
                context: 'body',
                path: 'logs.*.device.screenSize',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            screenHeight: {
                context: 'body',
                path: 'logs.*.device.screenSize',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            carrier: {
                context: 'body',
                path: 'logs.*.device.carrierName',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },
        },
    },
];
