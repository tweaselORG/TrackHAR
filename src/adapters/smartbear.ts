import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'smartbear',
    name: 'SmartBear Software',
    exodusId: 207,
};

export const adapters: Adapter[] = [
    {
        slug: 'bugsnag-sessions',
        tracker,

        endpointUrls: ['https://sessions.bugsnag.com/'],
        match: (r) => r.method === 'POST',

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            trackerSdkVersion: {
                context: 'body',
                path: 'notifier.version',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'app.version',
                reasoning: 'obvious property name',
            },

            appId: [
                {
                    context: 'body',
                    path: 'app.id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'app.packageName',
                    reasoning: 'obvious property name',
                },
            ],

            isInForeground: {
                context: 'body',
                path: 'app.inForeground',
                reasoning: 'obvious property name',
            },

            viewedPage: {
                context: 'body',
                path: 'app.activeScreen',
                reasoning: 'obvious property name',
            },

            architecture: {
                context: 'body',
                path: 'device.cpuAbi',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'body',
                path: 'device.osName',
                reasoning: 'obvious property name',
            },

            osVersion: [
                {
                    context: 'body',
                    path: 'device.osVersion',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.osBuild',
                    reasoning: 'obvious property name',
                },
            ],

            isRooted: {
                context: 'body',
                path: 'device.jailbroken',
                reasoning: 'obvious property name',
            },

            manufacturer: [
                {
                    context: 'body',
                    path: 'device.manufacturer',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device.brand',
                    reasoning: 'obvious property name',
                },
            ],

            model: {
                context: 'body',
                path: 'device.model',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'body',
                path: 'device.locale',
                reasoning: 'obvious property name',
            },

            userAgent: {
                context: 'body',
                path: 'device.userAgent',
                reasoning: 'obvious property name',
            },

            orientation: {
                context: 'body',
                path: 'device.orientation',
                reasoning: 'obvious property name',
            },

            ramTotal: {
                context: 'body',
                path: 'device.totalMemory',
                reasoning: 'obvious property name',
            },

            ramFree: {
                context: 'body',
                path: 'device.freeMemory',
                reasoning: 'obvious property name',
            },

            timezone: {
                context: 'body',
                path: 'device.timezone',
                reasoning: 'obvious property name',
            },

            isCharging: {
                context: 'body',
                path: 'device.charging',
                reasoning: 'obvious property name',
            },

            diskFree: {
                context: 'body',
                path: 'device.freeDisk',
                reasoning: 'obvious property name',
            },

            networkConnectionType: {
                context: 'body',
                path: 'device.networkAccess',
                reasoning: 'obvious property name',
            },

            isEmulator: {
                context: 'body',
                path: 'device.emulator',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'device.screenResolution',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'device.screenResolution',
                reasoning: 'obvious property name',
            },

            batteryLevel: {
                context: 'body',
                path: 'device.batteryLevel',
                reasoning: 'obvious property name',
            },
        },
    },
];
