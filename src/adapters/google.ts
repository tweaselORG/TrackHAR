import { mergeContainedDataPaths } from '../common/adapter-util';
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
            path: 'msid',
            reasoning: 'https://support.google.com/admanager/answer/10678356#msid-an',
        },
    ],

    appName: {
        context,
        path: 'an',
        reasoning: 'https://support.google.com/admanager/answer/10678356#msid-an',
    },

    trackerSdkVersion: {
        context,
        path: 'dtsdk',
        reasoning: 'obvious property name',
    },

    otherIdentifiers: {
        context: 'cookie',
        path: 'IDE',
        reasoning: 'google/IDE.md',
    },
});

const cctAndroidUrl = (lines: string) =>
    `https://github.com/firebase/firebase-android-sdk/blob/bb0823ffc999ccfc38d75a165f6c0391ed884f6b/transport/transport-backend-cct/src/test/proto/google/cct/google_cct.proto#${lines}` as const;
const cctIosUrl = (lines: string) =>
    `https://github.com/google/GoogleDataTransport/blob/78c44ad53d41c84d7d04ceab9e8773327befbf2c/GoogleDataTransport/ProtoSupport/Protos/cct.proto#${lines}` as const;
const fireperfAndroidUrl = (lines: string) =>
    `https://github.com/firebase/firebase-android-sdk/blob/132b8ba8563aa00b06e27b56ee811e738d14c791/firebase-perf/src/main/proto/firebase/perf/v1/perf_metric.proto#${lines}` as const;
const fireperfIosUrl = (lines: string) =>
    `https://github.com/firebase/firebase-ios-sdk/blob/7a0145207ec66f24e4bd1ceccd4f861a3e22535b/FirebasePerformance/ProtoSupport/Protos/perf_metric.proto#${lines}` as const;
const crashlyticsUrl = (lines: string) =>
    `https://github.com/firebase/firebase-ios-sdk/blob/7a0145207ec66f24e4bd1ceccd4f861a3e22535b/Crashlytics/ProtoSupport/Protos/crashlytics.proto#${lines}` as const;
const appqualityUrl = (lines: string) =>
    `https://github.com/firebase/firebase-ios-sdk/blob/7a0145207ec66f24e4bd1ceccd4f861a3e22535b/FirebaseSessions/ProtoSupport/Protos/sessions.proto#${lines}` as const;
const corediagnosticsUrl = (lines: string) =>
    `https://github.com/firebase/firebase-ios-sdk/blob/af1201c8a3e64d7c1893cebbec6877cd8c39abf7/Firebase/CoreDiagnostics/ProtoSupport/Protos/firebasecore.proto#${lines}` as const;
const mlLogUrlAndroid = (lines: string) =>
    `https://github.com/firebase/firebase-android-sdk/blob/master/firebase-ml-modeldownloader/src/test/proto/firebase/ml/modeldownloader/firebase_ml_log_sdk.proto#${lines}` as const;
const mlLogUrlIos = (lines: string) =>
    `https://github.com/firebase/firebase-ios-sdk/blob/477bb2a6961b18dc6210a0dafc90a975e6a448c6/FirebaseMLModelDownloader/Sources/proto/firebase_ml_log_sdk.proto#${lines}` as const;

const containedDataPathsFireperf: Adapter['containedDataPaths'] = {
    appId: {
        context: 'body',
        path: 'logEvents_FIREPERF.*.1.3.1',
        reasoning: fireperfAndroidUrl('L326-L328'),
    },

    trackerSdkVersion: [
        {
            context: 'body',
            path: 'logEvents_FIREPERF.*.1.3.2',
            reasoning: fireperfAndroidUrl('L330-L331'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREPERF.*.1.4.2',
            reasoning: fireperfIosUrl('L454-L455'),
        },
    ],

    appVersion: [
        {
            context: 'body',
            path: 'logEvents_FIREPERF.*.1.3.3',
            reasoning: fireperfAndroidUrl('L333-L338'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREPERF.*.1.4.3',
            reasoning: fireperfIosUrl('L457-L461'),
        },
    ],

    networkConnectionType: {
        context: 'body',
        path: 'logEvents_FIREPERF.*.1.4.5.1',
        reasoning: fireperfIosUrl('L469-L470'),
    },

    isInForeground: {
        context: 'body',
        path: 'logEvents_FIREPERF.*.1.5',
        reasoning: fireperfAndroidUrl('L314-L315'),
    },

    sessionId: {
        context: 'body',
        path: 'logEvents_FIREPERF.*.4.1',
        reasoning: fireperfAndroidUrl('L213-L217'),
    },

    ramUsed: {
        context: 'body',
        path: 'logEvents_FIREPERF.*.4.4.*.2',
        reasoning: fireperfAndroidUrl('L255-L256'),
    },
};
const containedDataPathsGdtClientMetrics: Adapter['containedDataPaths'] = {
    appId: {
        context: 'body',
        path: 'logEvents_GDT_CLIENT_METRICS.*.4',
        reasoning: `https://github.com/firebase/firebase-android-sdk/blob/132b8ba8563aa00b06e27b56ee811e738d14c791/transport/transport-runtime/src/main/proto/client_analytics.proto#L38-L39`,
    },
};
const containedDataPathsInAppMessaging: Adapter['containedDataPaths'] = {
    trackerSdkVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_INAPPMESSAGING.*.9',
        reasoning: `https://github.com/firebase/firebase-android-sdk/blob/132b8ba8563aa00b06e27b56ee811e738d14c791/firebase-inappmessaging/src/proto/logs/proto/firebase/inappmessaging/campaign_analytics.proto#L57-L58`,
    },
};
const containedDataPathsCrashlyticsReport: Adapter['containedDataPaths'] = {
    trackerSdkVersion: [
        {
            context: 'body',
            path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.sdkVersion',
            reasoning: crashlyticsUrl('L28-L29'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.generator',
            reasoning: 'obvious observed values',
        },
    ],

    osName: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.platform',
        reasoning: crashlyticsUrl('L34-L35'),
    },

    installationId: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.installationUuid',
        reasoning: crashlyticsUrl('L37-L39'),
    },

    appVersion: [
        {
            context: 'body',
            path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.buildVersion',
            reasoning: crashlyticsUrl('L47-L48'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.displayVersion',
            reasoning: crashlyticsUrl('L50-L51'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.app.version',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.app.displayVersion',
            reasoning: 'obvious property name',
        },
    ],

    appId: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.app.identifier',
        reasoning: 'obvious property name',
    },

    osVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.os.version',
        reasoning: 'obvious property name',
    },

    isRooted: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.os.jailbroken',
        reasoning: 'obvious property name',
    },

    architecture: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.device.arch',
        reasoning: 'obvious property name',
    },

    model: [
        {
            context: 'body',
            path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.device.model',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.device.modelClass',
            reasoning: 'obvious property name',
        },
    ],

    ramTotal: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.device.ram',
        reasoning: 'obvious property name',
    },

    diskTotal: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.device.diskSpace',
        reasoning: 'obvious property name',
    },

    isEmulator: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.device.simulator',
        reasoning: 'obvious property name',
    },

    manufacturer: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.device.manufacturer',
        reasoning: 'obvious property name',
    },

    batteryLevel: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.events.*.device.batteryLevel',
        reasoning: 'obvious property name',
    },

    orientation: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.events.*.device.orientation',
        reasoning: 'obvious property name',
    },

    ramUsed: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.events.*.device.ramUsed',
        reasoning: 'obvious property name',
    },

    diskUsed: {
        context: 'body',
        path: 'logEvents_FIREBASE_CRASHLYTICS_REPORT.*.session.events.*.device.diskUsed',
        reasoning: 'obvious property name',
    },
};
const containedDataPathsAppQualityAndroid: Adapter['containedDataPaths'] = {
    sessionId: [
        {
            context: 'body',
            path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.sessionData.sessionId',
            reasoning: appqualityUrl('L120-L121'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.sessionData.firstSessionId',
            reasoning: appqualityUrl('L122-L124'),
        },
    ],

    installationId: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.sessionData.firebaseInstallationId',
        reasoning: appqualityUrl('L128-L129'),
    },

    model: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.applicationInfo.deviceModel',
        reasoning: appqualityUrl('L172-L173'),
    },

    trackerSdkVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.applicationInfo.sessionSdkVersion',
        reasoning: appqualityUrl('L178-L179'),
    },

    osVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.applicationInfo.osVersion',
        reasoning: appqualityUrl('L180-L181'),
    },

    appId: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.applicationInfo.androidAppInfo.appId',
        reasoning: appqualityUrl('L204-L205'),
    },

    appVersion: [
        {
            context: 'body',
            path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.applicationInfo.androidAppInfo.versionName',
            reasoning: appqualityUrl('L207-L208'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.applicationInfo.androidAppInfo.appBuildVersion',
            reasoning: 'obvious property name',
        },
    ],

    manufacturer: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.applicationInfo.androidAppInfo.deviceManufacturer',
        reasoning: 'obvious property name',
    },
};
const containedDataPathsAppQualityIos: Adapter['containedDataPaths'] = {
    sessionId: [
        {
            context: 'body',
            path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.2.1',
            reasoning: appqualityUrl('L120-L121'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.2.7',
            reasoning: appqualityUrl('L122-L124'),
        },
    ],

    installationId: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.2.3',
        reasoning: appqualityUrl('L128-L129'),
    },

    model: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.3.2',
        reasoning: appqualityUrl('L172-L173'),
    },

    trackerSdkVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.3.7',
        reasoning: appqualityUrl('L178-L179'),
    },

    osVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.3.9',
        reasoning: appqualityUrl('L180-L181'),
    },

    appVersion: [
        {
            context: 'body',
            path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.3.6.1',
            reasoning: appqualityUrl('L207-L208'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.3.6.6',
            reasoning: appqualityUrl('L222-L223'),
        },
    ],

    networkConnectionType: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.3.6.3.1',
        reasoning: appqualityUrl('L224-L225'),
    },

    osName: {
        context: 'body',
        path: 'logEvents_FIREBASE_APPQUALITY_SESSION.*.3.6.4',
        reasoning: appqualityUrl('L226-L227'),
    },
};
const containedDataPathsFirebaseCoreDiagnostics: Adapter['containedDataPaths'] = {
    trackerSdkVersion: [
        {
            context: 'body',
            path: 'logEvents_FIREBASE_COREDIAGNOSTICS.*.18',
            reasoning: corediagnosticsUrl('L68'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_COREDIAGNOSTICS.*.19',
            reasoning: corediagnosticsUrl('L69'),
        },
        {
            context: 'body',
            path: 'logEvents_FIREBASE_COREDIAGNOSTICS.*.31',
            reasoning: corediagnosticsUrl('L86'),
        },
    ],

    model: {
        context: 'body',
        path: 'logEvents_FIREBASE_COREDIAGNOSTICS.*.9',
        reasoning: corediagnosticsUrl('L74'),
    },

    osVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_COREDIAGNOSTICS.*.22',
        reasoning: corediagnosticsUrl('L75'),
    },

    appId: {
        context: 'body',
        path: 'logEvents_FIREBASE_COREDIAGNOSTICS.*.12',
        reasoning: corediagnosticsUrl('L77'),
    },
};
const containedDataPathsMlLogsAndroid: Adapter['containedDataPaths'] = {
    appId: {
        context: 'body',
        path: 'logEvents_FIREBASE_ML_LOG_SDK.*.systemInfo.appId',
        reasoning: mlLogUrlAndroid('L28-L30'),
    },

    appVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_ML_LOG_SDK.*.systemInfo.appVersion',
        reasoning: mlLogUrlAndroid('L32-34'),
    },

    trackerSdkVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_ML_LOG_SDK.*.systemInfo.mlSdkVersion',
        reasoning: mlLogUrlAndroid('L41-L43'),
    },
};
const containedDataPathsMlLogsIos: Adapter['containedDataPaths'] = {
    appId: {
        context: 'body',
        path: 'logEvents_FIREBASE_ML_LOG_SDK.*.1.1',
        reasoning: mlLogUrlIos('L23-L24'),
    },

    appVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_ML_LOG_SDK.*.1.2',
        reasoning: mlLogUrlIos('L26-L27'),
    },

    trackerSdkVersion: {
        context: 'body',
        path: 'logEvents_FIREBASE_ML_LOG_SDK.*.1.4',
        reasoning: mlLogUrlIos('L34-L35'),
    },
};
const containedDataPathsMlSdk: Adapter['containedDataPaths'] = {
    appId: {
        context: 'body',
        path: 'logEvents_FIREBASE_ML_SDK.*.1.1',
        reasoning: 'obvious observed values',
    },
};
const containedDataPathsPlayBilling: Adapter['containedDataPaths'] = {
    trackerSdkVersion: {
        context: 'body',
        path: 'logEvents_PLAY_BILLING_LIBRARY.*.1.1',
        reasoning: 'obvious observed values',
    },
    appId: {
        context: 'body',
        path: 'logEvents_PLAY_BILLING_LIBRARY.*.1.2',
        reasoning: 'obvious observed values',
    },
};
const containedDataPathsCastSender: Adapter['containedDataPaths'] = {
    appId: {
        context: 'body',
        path: 'logEvents_CAST_SENDER_SDK.*.48.1.1',
        reasoning: 'obvious observed values',
    },
};
const containedDataPathsLocationEngine: Adapter['containedDataPaths'] = {
    appId: {
        context: 'body',
        path: 'logEvents_LE.*.2.2.1',
        reasoning: 'obvious observed values',
    },
};
const containedDataPathsIdentityToolkitHeaders: Adapter['containedDataPaths'] = {
    trackerSdkVersion: [
        {
            context: 'header',
            path: 'x-client-version',
            reasoning: 'obvious property name',
        },
        {
            context: 'header',
            path: 'X-Client-Version',
            reasoning: 'obvious property name',
        },
        {
            context: 'header',
            path: 'x-firebase-client',
            reasoning: 'obvious property name',
        },
    ],

    appId: [
        {
            context: 'header',
            path: 'x-requested-with',
            reasoning: 'obvious observed values',
        },
        {
            context: 'header',
            path: 'X-Android-Package',
            reasoning: 'obvious property name',
        },
        {
            context: 'header',
            path: 'x-ios-bundle-identifier',
            reasoning: 'obvious property name',
        },
    ],
};

export const adapters: Adapter[] = [
    {
        slug: 'app-measurement',
        name: 'Google Analytics for Firebase (app-measurement.com)',
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

            advertisingId: {
                context: 'body',
                path: '1.*.19',
                reasoning: 'obvious observed values',
            },

            developerScopedId: {
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
        // See: https://github.com/firebase/firebase-ios-sdk/blob/ab0d0854a3682f14c0ee26859469cb4b1636d5e1/FirebaseMessaging/Sources/Token/FIRMessagingCheckinService.m#L27
        name: 'Firebase Cloud Messaging (device checkin)',
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
        // See: https://github.com/firebase/firebase-ios-sdk/blob/ab0d0854a3682f14c0ee26859469cb4b1636d5e1/FirebaseMessaging/Sources/FIRMessagingUtilities.m#L41
        name: 'Firebase Cloud Messaging (register token)',
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

            deviceId: {
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
        name: 'Google Mobile Ads SDK (DoubleClick, body)',
        tracker,

        endpointUrls: ['https://googleads.g.doubleclick.net/mads/gma'],
        match: (r) => !!r.content,

        decodingSteps: [
            { function: 'parseQueryString', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie.IDE', options: { path: 'IDE' } },
        ],
        containedDataPaths: containedDataPathsDoubleclickMadsGma('body'),
    },

    {
        slug: 'doubleclick-mads-gma-qs',
        name: 'Google Mobile Ads SDK (DoubleClick, query string)',
        tracker,

        endpointUrls: ['https://googleads.g.doubleclick.net/mads/gma'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie.IDE', options: { path: 'IDE' } },
        ],
        containedDataPaths: {
            ...containedDataPathsDoubleclickMadsGma('query'),

            appVersion: {
                context: 'query',
                path: 'vnm',
                reasoning: 'google/vnm.md',
            },
        },
    },

    {
        slug: 'doubleclick-getconfig-pubsetting',
        name: 'DoubleClick (getconfig/pubsetting)',
        tracker,

        endpointUrls: ['https://googleads.g.doubleclick.net/getconfig/pubsetting'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            {
                function: 'getProperty',
                input: 'header',
                output: 'res.header.x-requested-with',
                options: { path: 'x-requested-with' },
            },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie.IDE', options: { path: 'IDE' } },
        ],
        containedDataPaths: {
            appId: [
                {
                    context: 'query',
                    path: 'app_name',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'header',
                    path: 'x-requested-with',
                    reasoning: 'obvious observed values',
                },
            ],

            appVersion: {
                context: 'query',
                path: 'vnm',
                reasoning: 'google/vnm.md',
            },

            otherIdentifiers: {
                context: 'cookie',
                path: 'IDE',
                reasoning: 'google/IDE.md',
            },
        },
    },

    {
        slug: 'fundingchoicesmessages',
        name: 'Privacy & Messaging API',
        description: 'google-fundingchoices',
        tracker,

        endpointUrls: ['https://fundingchoicesmessages.google.com/a/consent'],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: {
            advertisingId: {
                context: 'body',
                path: 'adid',
                reasoning: 'observed values match known device parameters',
            },

            osName: {
                context: 'body',
                path: 'device_info.os_type',
                reasoning: 'google/device_info.os_type.md',
            },

            model: {
                context: 'body',
                path: 'device_info.model',
                reasoning: 'obvious property name',
            },

            osVersion: [
                {
                    context: 'body',
                    path: 'device_info.android_api_level',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'device_info.version',
                    reasoning: 'observed values match known device parameters',
                },
            ],

            language: {
                context: 'body',
                path: 'language_code',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'screen_info.width',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'screen_info.height',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'body',
                path: 'app_info.package_name',
                reasoning: 'obvious property name',
            },

            appName: {
                context: 'body',
                path: 'app_info.publisher_display_name',
                reasoning: 'obvious property name',
            },

            appVersion: {
                context: 'body',
                path: 'app_info.version',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'sdk_info.version',
                reasoning: 'obvious property name',
            },

            deviceId: {
                context: 'body',
                path: 'rdid',
                reasoning: 'google/rdid.md',
            },
        },
    },

    {
        slug: 'doubleclick-pagead-interaction',
        name: 'DoubleClick (pagead/interaction)',
        tracker,

        endpointUrls: ['https://googleads.g.doubleclick.net/pagead/interaction'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie.IDE', options: { path: 'IDE' } },
            {
                function: 'getProperty',
                input: 'header',
                output: 'res.header.x-requested-with',
                options: { path: 'x-requested-with' },
            },
        ],
        containedDataPaths: {
            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            otherIdentifiers: {
                context: 'cookie',
                path: 'IDE',
                reasoning: 'google/IDE.md',
            },
        },
    },

    {
        slug: 'googledatatransport-firelog-batchlog-json',
        name: 'GoogleDataTransport (FireLog BatchedLogRequest, JSON)',
        description: 'googledatatransport-batchlog',
        tracker,

        endpointUrls: [
            'https://firebaselogging-pa.googleapis.com/v1/firelog/legacy/batchlog',
            'https://crashlyticsreports-pa.googleapis.com/v1/firelog/legacy/batchlog',
            'https://firebaselogging.googleapis.com/v0cc/log/batch',
        ],
        match: (r) => r.content?.startsWith('{"'),

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_FIREPERF_base64',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'FIREPERF')].sourceExtension",
                },
            },
            {
                function: 'decodeBase64',
                mapInput: 'logEvents_FIREPERF_base64',
                output: 'logEvents_FIREPERF_protobuf',
            },
            {
                function: 'decodeProtobuf',
                mapInput: 'logEvents_FIREPERF_protobuf',
                output: 'res.body.logEvents_FIREPERF',
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_GDT_CLIENT_METRICS_base64',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'GDT_CLIENT_METRICS')].sourceExtension",
                },
            },
            {
                function: 'decodeBase64',
                mapInput: 'logEvents_GDT_CLIENT_METRICS_base64',
                output: 'logEvents_GDT_CLIENT_METRICS_protobuf',
            },
            {
                function: 'decodeProtobuf',
                mapInput: 'logEvents_GDT_CLIENT_METRICS_protobuf',
                output: 'res.body.logEvents_GDT_CLIENT_METRICS',
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_FIREBASE_INAPPMESSAGING_base64',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'FIREBASE_INAPPMESSAGING')].sourceExtension",
                },
            },
            {
                function: 'decodeBase64',
                mapInput: 'logEvents_FIREBASE_INAPPMESSAGING_base64',
                output: 'logEvents_FIREBASE_INAPPMESSAGING_protobuf',
            },
            {
                function: 'decodeProtobuf',
                mapInput: 'logEvents_FIREBASE_INAPPMESSAGING_protobuf',
                output: 'res.body.logEvents_FIREBASE_INAPPMESSAGING',
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_PLAY_BILLING_LIBRARY_base64',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'PLAY_BILLING_LIBRARY')].sourceExtension",
                },
            },
            {
                function: 'decodeBase64',
                mapInput: 'logEvents_PLAY_BILLING_LIBRARY_base64',
                output: 'logEvents_PLAY_BILLING_LIBRARY_protobuf',
            },
            {
                function: 'decodeProtobuf',
                mapInput: 'logEvents_PLAY_BILLING_LIBRARY_protobuf',
                output: 'res.body.logEvents_PLAY_BILLING_LIBRARY',
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_FIREBASE_ML_SDK_base64',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'FIREBASE_ML_SDK')].sourceExtension",
                },
            },
            {
                function: 'decodeBase64',
                mapInput: 'logEvents_FIREBASE_ML_SDK_base64',
                output: 'logEvents_FIREBASE_ML_SDK_protobuf',
            },
            {
                function: 'decodeProtobuf',
                mapInput: 'logEvents_FIREBASE_ML_SDK_protobuf',
                output: 'res.body.logEvents_FIREBASE_ML_SDK',
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_CAST_SENDER_SDK_base64',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'CAST_SENDER_SDK')].sourceExtension",
                },
            },
            {
                function: 'decodeBase64',
                mapInput: 'logEvents_CAST_SENDER_SDK_base64',
                output: 'logEvents_CAST_SENDER_SDK_protobuf',
            },
            {
                function: 'decodeProtobuf',
                mapInput: 'logEvents_CAST_SENDER_SDK_protobuf',
                output: 'res.body.logEvents_CAST_SENDER_SDK',
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_LE_base64',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'LE')].sourceExtension",
                },
            },
            {
                function: 'decodeBase64',
                mapInput: 'logEvents_LE_base64',
                output: 'logEvents_LE_protobuf',
            },
            {
                function: 'decodeProtobuf',
                mapInput: 'logEvents_LE_protobuf',
                output: 'res.body.logEvents_LE',
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_FIREBASE_CRASHLYTICS_REPORT_json',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'FIREBASE_CRASHLYTICS_REPORT')].sourceExtensionJsonProto3",
                },
            },
            {
                function: 'parseJson',
                mapInput: 'logEvents_FIREBASE_CRASHLYTICS_REPORT_json',
                output: 'res.body.logEvents_FIREBASE_CRASHLYTICS_REPORT',
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_FIREBASE_APPQUALITY_SESSION_json',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'FIREBASE_APPQUALITY_SESSION')].sourceExtensionJsonProto3",
                },
            },
            {
                function: 'parseJson',
                mapInput: 'logEvents_FIREBASE_APPQUALITY_SESSION_json',
                output: 'res.body.logEvents_FIREBASE_APPQUALITY_SESSION',
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'logEvents_FIREBASE_ML_LOG_SDK_json',
                options: {
                    path: "$.logRequest.*.logEvent[?(@parent.logSourceName === 'FIREBASE_ML_LOG_SDK')].sourceExtensionJsonProto3",
                },
            },
            {
                function: 'parseJson',
                mapInput: 'logEvents_FIREBASE_ML_LOG_SDK_json',
                output: 'res.body.logEvents_FIREBASE_ML_LOG_SDK',
            },
        ],
        containedDataPaths: mergeContainedDataPaths(
            {
                osName: {
                    context: 'body',
                    path: 'logRequest.*.clientInfo.clientType',
                    reasoning: 'obvious observed values',
                },
                osVersion: [
                    {
                        context: 'body',
                        path: 'logRequest.*.clientInfo.androidClientInfo.sdkVersion',
                        reasoning: cctAndroidUrl('L101-L102'),
                    },
                    {
                        context: 'body',
                        path: 'logRequest.*.clientInfo.androidClientInfo.osBuild',
                        reasoning: cctAndroidUrl('L120-L121'),
                    },
                ],
                model: [
                    {
                        context: 'body',
                        path: 'logRequest.*.clientInfo.androidClientInfo.model',
                        reasoning: cctAndroidUrl('L104-L106'),
                    },
                    {
                        context: 'body',
                        path: 'logRequest.*.clientInfo.androidClientInfo.device',
                        reasoning: cctAndroidUrl('L108-L110'),
                    },
                    {
                        context: 'body',
                        path: 'logRequest.*.clientInfo.androidClientInfo.hardware',
                        reasoning: cctAndroidUrl('L116-L118'),
                    },
                    {
                        context: 'body',
                        path: 'logRequest.*.clientInfo.androidClientInfo.product',
                        reasoning: cctAndroidUrl('L108-L110'),
                    },
                    {
                        context: 'body',
                        path: 'logRequest.*.clientInfo.androidClientInfo.fingerprint',
                        reasoning: cctAndroidUrl('L158-L160'),
                    },
                ],
                manufacturer: {
                    context: 'body',
                    path: 'logRequest.*.clientInfo.androidClientInfo.manufacturer',
                    reasoning: cctAndroidUrl('L138-L140'),
                },
                appVersion: {
                    context: 'body',
                    path: 'logRequest.*.clientInfo.androidClientInfo.applicationBuild',
                    reasoning: cctAndroidUrl('L123-L125'),
                },
                carrier: {
                    context: 'body',
                    path: 'logRequest.*.clientInfo.androidClientInfo.mccMnc',
                    reasoning: cctAndroidUrl('L127-L129'),
                },
                language: {
                    context: 'body',
                    path: 'logRequest.*.clientInfo.androidClientInfo.locale',
                    reasoning: cctAndroidUrl('L131-L133'),
                },
                country: {
                    context: 'body',
                    path: 'logRequest.*.clientInfo.androidClientInfo.country',
                    reasoning: cctAndroidUrl('L135-L136'),
                },
                networkConnectionType: [
                    {
                        context: 'body',
                        path: 'logRequest.*.logEvent.*.networkConnectionInfo.networkType',
                        reasoning: 'obvious property name',
                    },
                    {
                        context: 'body',
                        path: 'logRequest.*.logEvent.*.networkConnectionInfo.mobileSubtype',
                        reasoning: 'obvious property name',
                    },
                ],
                timezone: {
                    context: 'body',
                    path: 'logRequest.*.logEvent.*.timezoneOffsetSeconds',
                    reasoning: 'obvious property name',
                },
            },
            containedDataPathsFireperf,
            containedDataPathsGdtClientMetrics,
            containedDataPathsInAppMessaging,
            containedDataPathsCrashlyticsReport,
            containedDataPathsAppQualityAndroid,
            containedDataPathsPlayBilling,
            containedDataPathsMlLogsAndroid,
            containedDataPathsMlSdk,
            containedDataPathsCastSender,
            containedDataPathsLocationEngine
        ),
    },

    {
        slug: 'googledatatransport-firelog-batchlog-protobuf',
        name: 'GoogleDataTransport (FireLog BatchedLogRequest, Protobuf)',
        description: 'googledatatransport-batchlog',
        tracker,

        endpointUrls: [
            'https://firebaselogging-pa.googleapis.com/v1/firelog/legacy/batchlog',
            'https://crashlyticsreports-pa.googleapis.com/v1/firelog/legacy/batchlog',
            'https://firebaselogging.googleapis.com/v0cc/log/batch',
        ],
        match: (r) => !r.content?.startsWith('{"'),

        decodingSteps: [
            { function: 'decodeProtobuf', input: 'body', output: 'res.body' },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'res.body.logEvents_FIREPERF',
                options: {
                    path: '$.1[?(@[2] === 462)].3.*.6',
                },
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'res.body.logEvents_GDT_CLIENT_METRICS',
                options: {
                    path: '$.1[?(@[2] === 1710)].3.6',
                },
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'res.body.logEvents_FIREBASE_APPQUALITY_SESSION',
                options: {
                    path: '$.1[?(@[2] === 1974)].3.6',
                },
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'res.body.logEvents_FIREBASE_COREDIAGNOSTICS',
                options: {
                    path: '$.1[?(@[2] === 137)].3.6',
                },
            },

            {
                function: 'getProperty',
                input: 'res.body',
                output: 'res.body.logEvents_FIREBASE_ML_LOG_SDK',
                options: {
                    path: '$.1[?(@[2] === 1326)].3.*.6',
                },
            },
        ],
        containedDataPaths: mergeContainedDataPaths(
            {
                osName: {
                    context: 'body',
                    path: '1.1.1.1',
                    reasoning: cctIosUrl('L139-L143'),
                },
                osVersion: [
                    {
                        context: 'body',
                        path: '1.1.4.3',
                        reasoning: cctIosUrl('L108-L109'),
                    },
                    {
                        context: 'body',
                        path: '1.1.4.4',
                        reasoning: cctIosUrl('L111-L112'),
                    },
                ],
                appVersion: {
                    context: 'body',
                    path: '1.1.4.5',
                    reasoning: cctIosUrl('L114-L116'),
                },
                country: {
                    context: 'body',
                    path: '1.1.4.6',
                    reasoning: cctIosUrl('L118-L121'),
                },
                model: {
                    context: 'body',
                    path: '1.1.4.7',
                    reasoning: cctIosUrl('L123-L125'),
                },
                language: {
                    context: 'body',
                    path: '1.1.4.8',
                    reasoning: cctIosUrl('L127-L131'),
                },
                appId: {
                    context: 'body',
                    path: '1.1.4.11',
                    reasoning: cctIosUrl('L133-L134'),
                },
            },
            containedDataPathsFireperf,
            containedDataPathsGdtClientMetrics,
            containedDataPathsAppQualityIos,
            containedDataPathsFirebaseCoreDiagnostics,
            containedDataPathsMlLogsIos
        ),
    },

    {
        slug: 'firebaseinstallations',
        name: 'Firebase Installations SDK',
        description: 'firebaseinstallations',
        tracker,

        endpointUrls: [/^https:\/\/firebaseinstallations\.googleapis\.com\/v1\/projects\/.+\/installations$/],
        match: (r) => r.content?.startsWith('{"'),

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },

            // The `x-firebase-client` header can be plain text or encoded.
            {
                function: 'decodeBase64',
                input: 'res.header.x-firebase-client',
                output: 'res.header.x-firebase-client-encoded',
            },
            {
                function: 'gunzip',
                input: 'res.header.x-firebase-client-encoded',
                output: 'res.header.x-firebase-client-encoded',
            },
            {
                function: 'parseJson',
                input: 'res.header.x-firebase-client-encoded',
                output: 'res.header.x-firebase-client-decoded',
            },

            // The `x-firebase-client` header contains space-separated fields (e.g. `device-model/generic_x86_64_arm64
            // fire-fcm/23.0.5 android-installer/ device-name/sdk_gphone_x86_64_arm64`).
            {
                function: 'split',
                input: 'res.header.x-firebase-client',
                output: 'res.header.x-firebase-client-fields',
                options: { separator: ' ' },
            },
            {
                function: 'split',
                mapInput: 'res.header.x-firebase-client-decoded.heartbeats.*.agent',
                output: 'res.header.x-firebase-client-decoded-fields',
                options: { separator: ' ' },
            },
        ],
        containedDataPaths: {
            installationId: {
                context: 'body',
                path: 'fid',
                reasoning: 'https://firebase.google.com/docs/projects/manage-installations',
            },

            trackerSdkVersion: [
                {
                    context: 'body',
                    path: 'sdkVersion',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'x-firebase-client',
                    onlyIf: /\//,
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'x-firebase-client-decoded.heartbeats.*.agent',
                    reasoning: 'obvious property name',
                },
            ],

            appId: [
                {
                    context: 'header',
                    path: 'X-Android-Package',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'x-ios-bundle-identifier',
                    reasoning: 'obvious property name',
                },
            ],

            manufacturer: [
                {
                    context: 'header',
                    path: "$.x-firebase-client-fields[?(@.startsWith('device-brand/'))]",
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: "$.x-firebase-client-decoded-fields.*[?(@.startsWith('device-brand/'))]",
                    reasoning: 'obvious property name',
                },
            ],

            model: [
                {
                    context: 'header',
                    path: "$.x-firebase-client-fields[?(@.startsWith('device-model/'))]",
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: "$.x-firebase-client-fields[?(@.startsWith('device/'))]",
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: "$.x-firebase-client-decoded-fields.*[?(@.startsWith('device-model/'))]",
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: "$.x-firebase-client-decoded-fields.*[?(@.startsWith('device/'))]",
                    reasoning: 'obvious property name',
                },
            ],

            deviceName: [
                {
                    context: 'header',
                    path: "$.x-firebase-client-fields[?(@.startsWith('device-name/'))]",
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: "$.x-firebase-client-decoded-fields.*[?(@.startsWith('device-name/'))]",
                    reasoning: 'obvious property name',
                },
            ],
        },
    },

    {
        slug: 'identitytoolkit-relyingparty-getaccountinfo-json',
        name: 'Identity Toolkit API v3 (getAccountInfo, JSON)',
        tracker,

        endpointUrls: ['https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo'],
        match: (r) => r.content?.startsWith('{"'),

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'decodeJwt', input: 'res.body.idToken', output: 'res.body.idToken' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: {
            ...containedDataPathsIdentityToolkitHeaders,

            userId: [
                {
                    context: 'body',
                    path: 'idToken.user_id',
                    reasoning: 'google/idToken.md',
                },
                {
                    context: 'body',
                    path: 'idToken.firebase.identities.email.*',
                    reasoning: 'google/idToken.md',
                },
                {
                    context: 'body',
                    path: 'idToken.email',
                    reasoning: 'google/idToken.md',
                },
            ],
        },
    },

    {
        slug: 'identitytoolkit-relyingparty-getaccountinfo-protobuf',
        name: 'Identity Toolkit API v3 (getAccountInfo, Protobuf)',
        tracker,

        endpointUrls: ['https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo'],
        match: (r) => !r.content?.startsWith('{"'),

        decodingSteps: [
            { function: 'decodeProtobuf', input: 'body', output: 'res.body' },
            { function: 'decodeJwt', input: 'res.body.1', output: 'res.body.idToken' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: {
            ...containedDataPathsIdentityToolkitHeaders,

            userId: {
                context: 'body',
                path: 'idToken.user_id',
                reasoning: 'google/idToken.md',
            },
        },
    },

    {
        slug: 'identitytoolkit-relyingparty-verifycustomtoken',
        name: 'Identity Toolkit API v3 (verifyCustomToken)',
        tracker,

        endpointUrls: ['https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'decodeJwt', input: 'res.body.token', output: 'res.body.token' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: {
            ...containedDataPathsIdentityToolkitHeaders,

            userId: {
                context: 'body',
                path: 'token.uid',
                reasoning: 'google/idToken.md',
            },
        },
    },

    {
        slug: 'identitytoolkit-relyingparty-signupnewuser',
        name: 'Identity Toolkit API v3 (signupNewUser)',
        tracker,

        endpointUrls: ['https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: {
            ...containedDataPathsIdentityToolkitHeaders,

            userId: {
                context: 'body',
                path: 'email',
                reasoning:
                    'https://developers.google.com/resources/api-libraries/documentation/identitytoolkit/v3/csharp/latest/classGoogle_1_1Apis_1_1IdentityToolkit_1_1v3_1_1Data_1_1IdentitytoolkitRelyingpartySignupNewUserRequest.html#a0a6e4c4c92b9ff59c34877f4d6c5e964',
            },

            osName: {
                context: 'body',
                path: 'clientType',
                reasoning: 'obvious observed values',
            },
        },
    },

    {
        slug: 'identitytoolkit-relyingparty-getprojectconfig',
        name: 'Identity Toolkit API v3 (getProjectConfig)',
        tracker,

        endpointUrls: ['https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: containedDataPathsIdentityToolkitHeaders,
    },

    {
        slug: 'firebaseremoteconfig',
        name: 'Firebase Remote Config',
        description: 'firebaseremoteconfig',
        tracker,

        endpointUrls: [
            /^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/.+\/namespaces\/firebase:fetch$/,
        ],
        match: (r) => r.content?.startsWith('{"'),

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: {
            appVersion: {
                context: 'body',
                path: 'appVersion',
                reasoning: 'obvious property name',
            },

            country: [
                {
                    context: 'body',
                    path: 'countryCode',
                    reasoning: 'obvious property name',
                },
            ],

            language: [
                {
                    context: 'body',
                    path: 'analyticsUserProperties.language',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'languageCode',
                    reasoning: 'obvious property name',
                },
            ],

            installTime: [
                {
                    context: 'body',
                    path: 'analyticsUserProperties.FirstAppStartTimestamp',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'firstOpenTime',
                    reasoning: 'obvious property name',
                },
            ],

            screenHeight: {
                context: 'body',
                path: 'analyticsUserProperties.Screensize',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'analyticsUserProperties.Screensize',
                reasoning: 'obvious property name',
            },

            appId: [
                {
                    context: 'body',
                    path: 'analyticsUserProperties.PackageName',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'X-Android-Package',
                    reasoning: 'obvious property name',
                },
            ],

            networkConnectionType: [
                {
                    context: 'body',
                    path: 'analyticsUserProperties.network_type_name',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'analyticsUserProperties.network_type',
                    reasoning: 'obvious property name',
                },
            ],

            deviceId: [
                {
                    context: 'body',
                    path: 'analyticsUserProperties.deviceId',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'analyticsUserProperties.device_id',
                    reasoning: 'obvious property name',
                },
            ],

            otherIdentifiers: {
                context: 'body',
                path: 'analyticsUserProperties.uuid',
                reasoning: 'obvious property name',
            },

            installationId: [
                {
                    context: 'body',
                    path: 'appInstanceIdToken',
                    reasoning: 'google/appInstanceIdToken.md',
                },
                {
                    context: 'header',
                    path: 'X-Goog-Firebase-Installations-Auth',
                    reasoning: 'google/appInstanceIdToken.md',
                },
            ],

            osVersion: [
                {
                    context: 'body',
                    path: 'analyticsUserProperties.android_sdk',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'platformVersion',
                    reasoning: 'obvious property name',
                },
            ],

            timezone: {
                context: 'body',
                path: 'timeZone',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'sdkVersion',
                reasoning: 'obvious property name',
            },
        },
    },

    {
        slug: 'googletagmanager-gtag',
        // See: https://developers.google.com/tag-platform/gtagjs
        name: 'Google tag (gtag.js)',
        description: 'google-gtag',
        tracker,

        endpointUrls: ['https://www.googletagmanager.com/gtag/js', 'https://www.googletagmanager.com/gtag/destination'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: {
            propertyId: {
                context: 'query',
                path: 'id',
                onlyIf: /^[a-z]{1,3}-[a-z0-9-]{5,}$/i,
                reasoning: 'https://support.google.com/tagmanager/answer/12326985',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            referer: [
                {
                    context: 'header',
                    path: 'referer',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'Referer',
                    reasoning: 'obvious property name',
                },
            ],
        },
    },

    {
        slug: 'googletagmanager-gtm',
        name: 'Google Tag Manager (gtm.js)',
        description: 'googletagmanager-gtm',
        tracker,

        endpointUrls: [
            'https://www.googletagmanager.com/gtm.js',
            'https://www.google-analytics.com/gtm/js',
            'https://www.googletagmanager.com/gtm/ios',
            'https://www.google-analytics.com/gtm/android',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: {
            propertyId: {
                context: 'query',
                path: 'id',
                onlyIf: /^[a-z]{1,3}-[a-z0-9-]{5,}$/i,
                reasoning: 'https://support.google.com/tagmanager/answer/12326985',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            referer: [
                {
                    context: 'header',
                    path: 'referer',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'Referer',
                    reasoning: 'obvious property name',
                },
            ],
        },
    },

    {
        // This adapter is mixing GA4 and UA (and various other GA endpoints?) since they use very similar data formats.
        slug: 'google-analytics',
        name: 'Google Analytics',
        description: 'google-analytics',
        tracker,

        endpointUrls: [
            'https://region1.google-analytics.com/g/collect',
            'https://region1.analytics.google.com/g/collect',
            'https://region1.analytics.google.com/g/s/collect',
            'https://www.google-analytics.com/j/collect',
            'https://www.google-analytics.com/g/collect',
            'https://www.google-analytics.com/collect',
            'https://analytics.google.com/g/s/collect',
            'https://ssl.google-analytics.com/collect',
            'https://www.google.com/ccm/collect',
            'https://region1.google-analytics.com/privacy-sandbox/register-conversion',
            'https://ssl.google-analytics.com/batch',
            /^https:\/\/www\.google\..+\/ads\/ga-audiences$/,

            'https://www.google-analytics.com/analytics.js',
            'https://ssl.google-analytics.com/ga.js',
            'https://www.google-analytics.com/plugins/ua/ec.js',
            'https://www.google-analytics.com/plugins/ua/linkid.js',
            'https://www.google-analytics.com/plugins/ua/ecommerce.js',
            'https://www.google-analytics.com/ga.js',
            'https://www.google-analytics.com/urchin.js',
            'http://www.google-analytics.com/urchin.js',
            'http://www.google-analytics.com/ga.js',
            'http://www.google-analytics.com/analytics.js',

            // GA can also collect through DoubleClick endpoints, cf.: https://news.ycombinator.com/item?id=33733239 and
            // https://www.namehero.com/blog/how-to-disable-doubleclick-in-google-analytics/
            'https://stats.g.doubleclick.net/g/collect',
            'https://stats.g.doubleclick.net/j/collect',
            'https://stats.g.doubleclick.net/r/collect',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'parseQueryString', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: {
            propertyId: [
                {
                    context: 'query',
                    path: 'tid',
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tid',
                },
                {
                    context: 'body',
                    path: 'tid',
                    notIf: '__GTM_DEFAULT_TRACKER__',
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tid',
                },
            ],

            consentState: [
                {
                    context: 'query',
                    path: 'gcs',
                    reasoning:
                        'https://www.simoahava.com/analytics/consent-mode-v2-google-tags/#how-do-i-check-if-consent-mode-is-active',
                },
                {
                    context: 'body',
                    path: 'gcs',
                    reasoning:
                        'https://www.simoahava.com/analytics/consent-mode-v2-google-tags/#how-do-i-check-if-consent-mode-is-active',
                },
                {
                    context: 'query',
                    path: 'gcd',
                    reasoning:
                        'https://www.simoahava.com/analytics/consent-mode-v2-google-tags/#consent-mode-v2-signals',
                },
                {
                    context: 'body',
                    path: 'gcd',
                    reasoning:
                        'https://www.simoahava.com/analytics/consent-mode-v2-google-tags/#consent-mode-v2-signals',
                },
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious property name',
                },
            ],

            language: [
                {
                    context: 'query',
                    path: 'ul',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ul',
                },
                {
                    context: 'body',
                    path: 'ul',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ul',
                },
            ],

            screenHeight: [
                {
                    context: 'query',
                    path: 'sr',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sr',
                },
                {
                    context: 'query',
                    path: 'vp',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#vp',
                },
                {
                    context: 'body',
                    path: 'sr',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sr',
                },
                {
                    context: 'body',
                    path: 'vp',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#vp',
                },
            ],

            screenWidth: [
                {
                    context: 'query',
                    path: 'sr',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sr',
                },
                {
                    context: 'query',
                    path: 'vp',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#vp',
                },
                {
                    context: 'body',
                    path: 'sr',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sr',
                },
                {
                    context: 'body',
                    path: 'vp',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#vp',
                },
            ],

            browserId: [
                {
                    context: 'query',
                    path: 'cid',
                    reasoning:
                        'https://louder.com.au/2022/06/27/client-id-in-ga4-what-is-it-and-how-to-get-it-in-your-report/',
                },
                {
                    context: 'body',
                    path: 'cid',
                    reasoning:
                        'https://louder.com.au/2022/06/27/client-id-in-ga4-what-is-it-and-how-to-get-it-in-your-report/',
                },
            ],

            viewedPage: [
                {
                    context: 'query',
                    path: 'dl',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dl',
                },
                {
                    context: 'query',
                    path: 'dt',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dt',
                },
                {
                    context: 'body',
                    path: 'dl',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dl',
                },
                {
                    context: 'body',
                    path: 'dt',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dt',
                },
                {
                    context: 'query',
                    path: 'dp',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dp',
                },
                {
                    context: 'body',
                    path: 'dp',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dp',
                },
            ],

            sessionId: {
                context: 'query',
                path: 'sid',
                reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/',
            },

            sessionCount: {
                context: 'query',
                path: 'sct',
                reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/',
            },

            isUserActive: [
                {
                    context: 'query',
                    path: 'seg',
                    reasoning:
                        'https://www.optimizesmart.com/what-is-measurement-protocol-in-google-analytics-4-ga4/#37-19-session-engaged',
                },
                {
                    context: 'body',
                    path: 'seg',
                    reasoning:
                        'https://www.optimizesmart.com/what-is-measurement-protocol-in-google-analytics-4-ga4/#37-19-session-engaged',
                },
            ],

            isUserInactive: [
                {
                    context: 'query',
                    path: 'ni',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ni',
                },
                {
                    context: 'body',
                    path: 'ni',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ni',
                },
            ],

            architecture: [
                {
                    context: 'query',
                    path: 'uaa',
                    reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua-arch',
                    reasoning: 'obvious property name',
                },
            ],

            model: [
                {
                    context: 'query',
                    path: 'uam',
                    reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua-model',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'dm',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'body',
                    path: 'dm',
                    reasoning: 'obvious observed values',
                },
            ],

            osName: [
                {
                    context: 'query',
                    path: 'uap',
                    reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua-platform',
                    reasoning: 'obvious property name',
                },
            ],

            osVersion: [
                {
                    context: 'query',
                    path: 'uapv',
                    reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua-platform-version',
                    reasoning: 'obvious property name',
                },
            ],

            installationId: {
                context: 'query',
                path: '_fid',
                reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet-beta/?p=_fid',
            },

            userId: [
                {
                    context: 'query',
                    path: 'uid',
                    notIf: /nologin|0|(\r\n)|anonymous|(Without Profile)|(not set)|hashedId|--|na|notloggedin/i,
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uid',
                },
                {
                    context: 'body',
                    path: 'uid',
                    notIf: /nologin|0|(\r\n)|anonymous|(Without Profile)|(not set)|hashedId|--|na|notloggedin/i,
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uid',
                },
                {
                    context: 'query',
                    path: '_utma',
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?csw=1#gajs_-_cookie_usage',
                },
                {
                    context: 'query',
                    path: '_gid',
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?csw=1#gtagjs_and_analyticsjs_universal_analytics_-_cookie_usage',
                },
                {
                    context: 'body',
                    path: '_gid',
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?csw=1#gtagjs_and_analyticsjs_universal_analytics_-_cookie_usage',
                },
            ],

            currency: [
                {
                    context: 'query',
                    path: 'cu',
                    notIf: /not found/i,
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cu',
                },
                {
                    context: 'body',
                    path: 'cu',
                    notIf: /not found/i,
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cu',
                },
            ],

            appId: [
                {
                    context: 'header',
                    path: 'x-requested-with',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'aid',
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid',
                },
                {
                    context: 'body',
                    path: 'aid',
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid',
                },
                {
                    context: 'body',
                    path: 'msid',
                    reasoning: 'https://support.google.com/admanager/answer/10678356#msid-an',
                },
            ],

            appName: [
                {
                    context: 'query',
                    path: 'an',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#an',
                },
                {
                    context: 'body',
                    path: 'an',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#an',
                },
            ],

            appVersion: [
                {
                    context: 'query',
                    path: 'av',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av',
                },
                {
                    context: 'body',
                    path: 'av',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av',
                },
            ],

            campaignSource: [
                {
                    context: 'query',
                    path: 'cs',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cs',
                },
                {
                    context: 'body',
                    path: 'cs',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cs',
                },
            ],

            campaignMedium: {
                context: 'query',
                path: 'cm',
                reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cm',
            },

            campaignName: [
                {
                    context: 'query',
                    path: 'cn',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cn',
                },
                {
                    context: 'query',
                    path: 'ci',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ci',
                },
                {
                    context: 'query',
                    path: '$[?(@property.match(/^promo\\d+id$/))]',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: '$[?(@property.match(/^promo\\d+nm$/))]',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: '$[?(@property.match(/^promo\\d+id$/))]',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: '$[?(@property.match(/^promo\\d+nm$/))]',
                    reasoning: 'obvious property name',
                },
            ],

            campaignCreative: [
                {
                    context: 'query',
                    path: '$[?(@property.match(/^promo\\d+cr$/))]',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: '$[?(@property.match(/^promo\\d+cr$/))]',
                    reasoning: 'obvious property name',
                },
            ],

            campaignCreativePosition: [
                {
                    context: 'query',
                    path: '$[?(@property.match(/^promo\\d+ps$/))]',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: '$[?(@property.match(/^promo\\d+ps$/))]',
                    reasoning: 'obvious property name',
                },
            ],

            campaignTerm: {
                context: 'query',
                path: 'ck',
                reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ck',
            },

            isFirstLaunch: {
                context: 'body',
                path: '_fv',
                reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet-beta/?p=_fv',
            },

            referer: [
                {
                    context: 'header',
                    path: 'referer',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'Referer',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'dr',
                    reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/',
                },
                {
                    context: 'body',
                    path: 'dr',
                    reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/',
                },
            ],

            userAgent: [
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua-full-version-list',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'ua',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ua',
                },
                {
                    context: 'body',
                    path: 'ua',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ua',
                },
                {
                    context: 'query',
                    path: 'uafvl',
                    reasoning: 'https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/',
                },
            ],

            screenColorDepth: [
                {
                    context: 'query',
                    path: 'sd',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sd',
                },
                {
                    context: 'body',
                    path: 'sd',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sd',
                },
            ],

            userAction: [
                {
                    context: 'query',
                    path: 'pa',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pa',
                },
                {
                    context: 'body',
                    path: 'pa',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pa',
                },
                {
                    context: 'query',
                    path: 'ea',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea',
                },
                {
                    context: 'body',
                    path: 'ea',
                    reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea',
                },
            ],

            userActionSource: [
                {
                    context: 'query',
                    path: 'pal',
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pal',
                },
                {
                    context: 'body',
                    path: 'pal',
                    reasoning:
                        'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pal',
                },
            ],

            advertisingId: [
                {
                    context: 'query',
                    path: 'idfa',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'idfa',
                    reasoning: 'obvious property name',
                },
            ],

            interactedElement: {
                context: 'query',
                path: 'linkid',
                reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#linkid',
            },

            revenue: {
                context: 'query',
                path: 'tr',
                reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tr',
            },

            trackerSdkVersion: [
                {
                    context: 'query',
                    path: '_v',
                    reasoning:
                        'https://cheatography.com/dmpg-tom/cheat-sheets/google-universal-analytics-url-collect-parameters/',
                },
                {
                    context: 'body',
                    path: '_v',
                    reasoning:
                        'https://cheatography.com/dmpg-tom/cheat-sheets/google-universal-analytics-url-collect-parameters/',
                },
            ],

            otherIdentifiers: {
                context: 'query',
                path: '_gsid',
                // https://docs.gamesight.io/reference/web-sdk-set suggests it's a session ID but I'm not sure whether
                // we can trust this as a source and I haven't found any others.
                reasoning: 'obvious observed values',
            },

            errorInformation: {
                context: 'query',
                path: 'exd',
                reasoning: 'https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#exd',
            },

            isConversion: {
                context: 'query',
                path: '_c',
                reasoning:
                    'https://www.simoahava.com/analytics/transformations-server-side-google-tag-manager/#use-case-1-flag-custom-events-as-conversions-for-ga4',
            },

            userActiveTime: {
                context: 'query',
                path: '_et',
                reasoning:
                    'https://www.optimizesmart.com/what-is-measurement-protocol-in-google-analytics-4-ga4/#42-24-engagement-time',
            },
        },
    },

    {
        slug: 'google-publisher-tag',
        // See: https://developers.google.com/publisher-tag/guides/get-started
        name: 'Google Publisher Tag (GPT)',
        description: 'google-publisher-tag',
        tracker,

        endpointUrls: [
            'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
            'https://www.googletagservices.com/tag/js/gpt.js',
            // cf.: https://developers.google.com/publisher-tag/common_implementation_mistakes#common-mistakes
            /https:\/\/securepubads\.g\.doubleclick\.net\/pagead\/managed\/js\/gpt\/.+\/pubads_impl\.js/,
            /https:\/\/securepubads\.g\.doubleclick\.net\/pagead\/managed\/js\/gpt\/.+\/pubads_impl_page_level_ads\.js/,
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            propertyId: {
                context: 'query',
                path: 'network-code',
                reasoning: 'https://support.google.com/admanager/answer/7674889',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            referer: [
                {
                    context: 'header',
                    path: 'referer',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'Referer',
                    reasoning: 'obvious property name',
                },
            ],

            otherIdentifiers: {
                context: 'cookie',
                path: 'IDE',
                reasoning: 'google/IDE.md',
            },
        },
    },

    {
        slug: 'doubleclick-cookie-matching-pixel',
        name: 'DoubleClick Pixel for Cookie Matching',
        description: 'doubleclick-cookie-matching-pixel',
        tracker,

        endpointUrls: ['https://cm.g.doubleclick.net/pixel'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            propertyId: {
                context: 'query',
                path: 'google_nid',
                reasoning: 'https://developers.google.com/authorized-buyers/rtb/cookie-guide#match-tag-url-parameters',
            },

            userId: [
                {
                    context: 'query',
                    path: 'google_hm',
                    notIf: 'MA==',
                    reasoning:
                        'https://developers.google.com/authorized-buyers/rtb/cookie-guide#storing-a-match-in-a-google-hosted-match-table',
                },
                {
                    context: 'query',
                    path: 'google_gid',
                    reasoning:
                        'https://developers.google.com/authorized-buyers/rtb/cookie-guide#redirect-url-parameters',
                },
                {
                    context: 'query',
                    path: 'CriteoUserId',
                    reasoning: 'obvious property name',
                },
            ],

            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                notIf: /\$/,
                reasoning: 'https://developers.google.com/authorized-buyers/rtb/cookie-guide#match-tag-url-parameters',
            },

            segment: {
                context: 'query',
                path: 'google_ula',
                notIf: /{/,
                reasoning: 'https://developers.google.com/authorized-buyers/rtb/cookie-guide#add-to-single-user-list',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            referer: [
                {
                    context: 'header',
                    path: 'referer',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'Referer',
                    reasoning: 'obvious property name',
                },
            ],

            otherIdentifiers: {
                context: 'cookie',
                path: 'IDE',
                reasoning: 'google/IDE.md',
            },
        },
    },
];
