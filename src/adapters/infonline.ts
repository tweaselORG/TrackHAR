import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'infonline',
    name: 'INFOnline GmbH',
    datenanfragenSlug: 'infonline-de',
    exodusId: 197,
};

export const adapters: Adapter[] = [
    {
        slug: 'ioam',
        tracker,

        endpointUrls: ['https://config.ioam.de/appcfg.php'],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            appId: [
                {
                    context: 'body',
                    path: 'application.package',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'body',
                    path: 'application.bundleIdentifier',
                    reasoning: 'obvious property name',
                },
            ],

            appVersion: [
                {
                    context: 'body',
                    path: 'application.versionName',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'application.bundleVersion',
                    reasoning: 'obvious property name',
                },
            ],

            trackerSdkVersion: {
                context: 'body',
                path: 'library.libVersion',
                reasoning: 'obvious property name',
            },

            hashedIdfa: {
                context: 'body',
                path: 'client.uuids.advertisingIdentifier',
                reasoning: 'obvious observed values',
            },

            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'client.uuids.installationId',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'client.uuids.vendorIdentifier',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'client.uuids.androidId',
                    reasoning: 'obvious property name',
                },
            ],

            manufacturer: {
                context: 'body',
                path: 'client.platform',
                reasoning: 'obvious observed values',
            },

            model: {
                context: 'body',
                path: 'client.platform',
                reasoning: 'obvious observed values',
            },

            osName: {
                context: 'body',
                path: 'client.osIdentifier',
                reasoning: 'obvious property name',
            },

            osVersion: {
                context: 'body',
                path: 'client.osVersion',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'body',
                path: 'client.language',
                reasoning: 'obvious property name',
            },

            carrier: {
                context: 'body',
                path: 'client.carrier',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'client.screen.resolution',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'client.screen.resolution',
                reasoning: 'obvious property name',
            },

            country: {
                context: 'body',
                path: 'client.country',
                reasoning: 'obvious property name',
            },
        },
    },
];
