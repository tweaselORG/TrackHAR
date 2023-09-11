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

    {
        slug: 'bugsnag-notify',
        tracker,

        endpointUrls: ['https://notify.bugsnag.com/'],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        // The `events.*.metaData.*` properties are custom properties that can be set by the app developer, though the
        // properties included here have been set in pretty much every request we've seen.
        containedDataPaths: {
            trackerSdkVersion: {
                context: 'body',
                path: 'notifier.version',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            otherIdentifiers: [
                {
                    context: 'body',
                    path: 'events.*.user.id',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
                {
                    context: 'body',
                    path: 'events.*.device.id',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
                {
                    context: 'body',
                    path: 'events.*.session.id',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
            ],

            appId: {
                context: 'body',
                path: 'events.*.app.id',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            appVersion: [
                {
                    context: 'body',
                    path: 'events.*.app.version',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
                {
                    context: 'body',
                    path: 'events.*.app.versionCode',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
                {
                    context: 'body',
                    path: 'events.*.app.bundleVersion',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
                {
                    context: 'body',
                    path: 'events.*.app.codeBundleId',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
                {
                    context: 'body',
                    path: 'events.*.app.buildUUID',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
            ],

            timeSpent: {
                context: 'body',
                path: 'events.*.app.duration',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            isInForeground: {
                context: 'body',
                path: 'events.*.app.inForeground',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            architecture: {
                context: 'body',
                path: 'events.*.device.cpuAbi',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            manufacturer: [
                {
                    context: 'body',
                    path: 'events.*.device.manufacturer',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
                {
                    context: 'body',
                    path: 'events.*.metaData.device.brand',
                    reasoning: 'obvious property name',
                },
            ],

            model: [
                {
                    context: 'body',
                    path: 'events.*.device.model',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
                {
                    context: 'body',
                    path: 'events.*.device.modelNumber',
                    reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
                },
            ],

            osName: {
                context: 'body',
                path: 'events.*.device.osName',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            osVersion: {
                context: 'body',
                path: 'events.*.device.osVersion',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            ramFree: {
                context: 'body',
                path: 'events.*.device.freeMemory',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            ramTotal: {
                context: 'body',
                path: 'events.*.device.totalMemory',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            isRooted: {
                context: 'body',
                path: 'events.*.device.jailbroken',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            orientation: {
                context: 'body',
                path: 'events.*.device.orientation',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            viewedPage: {
                context: 'body',
                path: 'events.*.context',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            startTime: {
                context: 'body',
                path: 'events.*.session.startedAt',
                reasoning: 'https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports',
            },

            appName: {
                context: 'body',
                path: 'events.*.metaData.app.name',
                reasoning: 'obvious property name',
            },

            isEmulator: {
                context: 'body',
                path: 'events.*.metaData.device.emulator',
                reasoning: 'obvious property name',
            },

            networkConnectionType: {
                context: 'body',
                path: 'events.*.metaData.device.networkAccess',
                reasoning: 'obvious property name',
            },

            isCharging: {
                context: 'body',
                path: 'events.*.metaData.device.charging',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'events.*.metaData.device.screenResolution',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'events.*.metaData.device.screenResolution',
                reasoning: 'obvious property name',
            },

            batteryLevel: {
                context: 'body',
                path: 'events.*.metaData.device.batteryLevel',
                reasoning: 'obvious property name',
            },
        },
    },
];
