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
                reasoning:
                    'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
            },

            appVersion: [
                {
                    context: 'body',
                    path: 'app.version',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
                {
                    context: 'body',
                    path: 'app.versionCode',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
                {
                    context: 'body',
                    path: 'app.bundleVersion',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
                {
                    context: 'body',
                    path: 'app.codeBundleId',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
            ],

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

            appName: {
                context: 'body',
                path: 'app.name',
                reasoning: 'obvious property name',
            },

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
                reasoning:
                    'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
            },

            osVersion: [
                {
                    context: 'body',
                    path: 'device.osVersion',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
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
                reasoning:
                    'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
            },

            manufacturer: [
                {
                    context: 'body',
                    path: 'device.manufacturer',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
                {
                    context: 'body',
                    path: 'device.brand',
                    reasoning: 'obvious property name',
                },
            ],

            model: [
                {
                    context: 'body',
                    path: 'device.model',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
                {
                    context: 'body',
                    path: 'device.modelNumber',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
            ],

            language: {
                context: 'body',
                path: 'device.locale',
                reasoning: 'obvious property name',
            },

            userAgent: {
                context: 'body',
                path: 'device.userAgent',
                reasoning:
                    'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
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

            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'device.id',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
                {
                    context: 'body',
                    path: 'sessions.*.user.id',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
                {
                    context: 'body',
                    path: 'sessions.*.id',
                    reasoning:
                        'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
                },
            ],

            startTime: {
                context: 'body',
                path: 'sessions.*.startedAt',
                reasoning:
                    'https://bugsnagsessiontrackingapi.docs.apiary.io/#reference/0/session/report-a-session-starting',
            },
        },
    },
];
