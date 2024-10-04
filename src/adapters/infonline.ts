import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'infonline',
    name: 'INFOnline GmbH',
    description: 'infonline',
    datenanfragenSlug: 'infonline-de',
    exodusId: 197,
};

const ioamJsonDataPaths = ({
    context,
    prefix,
    hasEvents,
}: {
    context: 'body' | 'query';
    prefix: string;
    hasEvents: boolean;
}): Adapter['containedDataPaths'] => ({
    appId: [
        {
            context,
            path: prefix + 'application.package',
            reasoning: 'obvious observed values',
        },
        {
            context,
            path: prefix + 'application.bundleIdentifier',
            reasoning: 'obvious property name',
        },
    ],

    appVersion: [
        {
            context,
            path: prefix + 'application.versionName',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: prefix + 'application.versionCode',
            reasoning: 'obvious property name',
        },
        {
            context,
            path: prefix + 'application.bundleVersion',
            reasoning: 'obvious property name',
        },
    ],

    trackerSdkVersion: {
        context,
        path: prefix + 'library.libVersion',
        reasoning: 'obvious property name',
    },

    hashedAdvertisingId: {
        context,
        path: prefix + 'client.uuids.advertisingIdentifier',
        reasoning: 'infonline/client.uuids.advertisingIdentifier.md',
    },

    model: {
        context,
        path: prefix + 'client.platform',
        reasoning: 'obvious observed values',
    },

    osName: {
        context,
        path: prefix + 'client.osIdentifier',
        reasoning: 'obvious property name',
    },

    osVersion: {
        context,
        path: prefix + 'client.osVersion',
        reasoning: 'obvious property name',
    },

    language: {
        context,
        path: prefix + 'client.language',
        reasoning: 'obvious property name',
    },

    carrier: {
        context,
        path: prefix + 'client.carrier',
        reasoning: 'obvious property name',
    },

    screenWidth: {
        context,
        path: prefix + 'client.screen.resolution',
        reasoning: 'obvious property name',
    },

    screenHeight: {
        context,
        path: prefix + 'client.screen.resolution',
        reasoning: 'obvious property name',
    },

    country: {
        context,
        path: prefix + 'client.country',
        reasoning: 'obvious property name',
    },

    ...(hasEvents && {
        startTime: {
            context,
            path: `$.${prefix}.events[?(@.identifier == 'application' && @.state == 'start')].timestamp`,
            reasoning:
                'https://docs.infonline.de/infonline-measurement/en/integration/lib/iOS/Vorgaben_zum_Aufruf/#events',
        },

        isInForeground: [
            {
                context,
                path: `$.${prefix}.events[?(@.identifier == 'application' && @.state == 'enterForeground')].state`,
                reasoning:
                    'https://docs.infonline.de/infonline-measurement/en/integration/lib/iOS/Vorgaben_zum_Aufruf/#events',
            },
            {
                context,
                path: `$.${prefix}.events[?(@.identifier == 'application' && @.state == 'enterBackground')].state`,
                reasoning:
                    'https://docs.infonline.de/infonline-measurement/en/integration/lib/iOS/Vorgaben_zum_Aufruf/#events',
            },
            {
                context,
                path: `$.${prefix}.events[?(@.identifier == 'application' && @.state == 'becomeActive')].state`,
                reasoning:
                    'https://docs.infonline.de/infonline-measurement/en/integration/lib/iOS/Vorgaben_zum_Aufruf/#events',
            },
            {
                context,
                path: `$.${prefix}.events[?(@.identifier == 'application' && @.state == 'resignActive')].state`,
                reasoning:
                    'https://docs.infonline.de/infonline-measurement/en/integration/lib/iOS/Vorgaben_zum_Aufruf/#events',
            },
        ],

        viewedPage: [
            {
                context,
                path: `$.${prefix}.events[?(@.identifier == 'view' && @.state == 'appeared')].category`,
                reasoning:
                    'https://docs.infonline.de/infonline-measurement/en/integration/lib/iOS/Vorgaben_zum_Aufruf/#events',
            },
            {
                context,
                path: `$.${prefix}.events[?(@.identifier == 'view' && @.state == 'refreshed')].category`,
                reasoning:
                    'https://docs.infonline.de/infonline-measurement/en/integration/lib/iOS/Vorgaben_zum_Aufruf/#events',
            },
        ],
    }),
});

const ioamTxQueryDataPaths: Adapter['containedDataPaths'] = {
    viewedPage: {
        context: 'query',
        path: 'cp',
        reasoning: 'https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/',
    },

    country: {
        context: 'query',
        path: 'lo',
        reasoning: 'https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/',
    },
    state: {
        context: 'query',
        path: 'lo',
        reasoning: 'https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/',
    },

    referer: [
        {
            context: 'query',
            path: 'r2',
            reasoning: 'https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/',
        },
        {
            context: 'query',
            path: 'rf',
            reasoning: 'https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/',
        },
        {
            context: 'query',
            path: 'ur',
            reasoning: 'https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/',
        },
    ],

    trackerSdkVersion: {
        context: 'query',
        path: 'vr',
        reasoning: 'https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/',
    },

    screenHeight: {
        context: 'query',
        path: 'xy',
        reasoning: 'https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/',
    },
    screenWidth: {
        context: 'query',
        path: 'xy',
        reasoning: 'https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/',
    },

    deviceId: {
        context: 'cookie',
        path: 'i00',
        reasoning: 'infonline/i00.md',
    },
};

export const adapters: Adapter[] = [
    {
        slug: 'ioam',
        name: 'INFOnline Measurement',
        tracker,

        endpointUrls: ['https://config.ioam.de/appcfg.php'],

        decodingSteps: [{ function: 'parseJson', input: 'body', output: 'res.body' }],
        containedDataPaths: ioamJsonDataPaths({ context: 'body', prefix: '', hasEvents: false }),
    },

    {
        slug: 'ioam-tx-query',
        // See: https://www.infonline.de/publisher/
        name: 'INFOnline Measurement pseudonymous (query string)',
        description: 'infonline-pseudonymous',
        tracker,

        endpointUrls: ['https://de.ioam.de/tx.io', 'https://at.iocnt.net/tx.io'],
        match: (r) => r.path.includes('?'),

        decodingSteps: [
            { function: 'getProperty', input: 'cookie', output: 'res.cookie.i00', options: { path: 'i00' } },
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            {
                function: 'parseJson',
                input: 'res.query.mi',
                output: 'res.query.mi',
            },
        ],
        containedDataPaths: mergeContainedDataPaths(
            ioamTxQueryDataPaths,
            // `mi` is the same JSON as in the other adapters, see:
            // https://docs.infonline.de/infonline-measurement/en/services/logfilebereitstellung/
            ioamJsonDataPaths({ context: 'query', prefix: 'mi.', hasEvents: false })
        ),
    },

    {
        slug: 'ioam-tx-body-gzip',
        name: 'INFOnline Measurement pseudonymous (GZIP body)',
        description: 'infonline-pseudonymous',
        tracker,

        endpointUrls: ['https://de.ioam.de/tx.io', 'https://at.iocnt.net/tx.io'],
        // `H4s` is the base64-encoded gzip header.
        match: (r) => r.content?.includes('ae=H4s'),

        decodingSteps: [
            { function: 'parseQueryString', input: 'body', output: 'parsedBody' },
            { function: 'getProperty', input: 'parsedBody', output: 'ae', options: { path: 'ae' } },
            { function: 'decodeBase64', input: 'ae', output: 'decodedAe' },
            { function: 'gunzip', input: 'decodedAe', output: 'unzippedAe' },
            { function: 'parseJson', input: 'unzippedAe', output: 'res.body.ae' },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie.i00', options: { path: 'i00' } },
        ],
        containedDataPaths: {
            ...ioamJsonDataPaths({ context: 'body', prefix: 'ae.', hasEvents: true }),

            deviceId: {
                context: 'cookie',
                path: 'i00',
                reasoning: 'infonline/i00.md',
            },
        },
    },

    {
        slug: 'ioam-tx-body-json',
        name: 'INFOnline Measurement pseudonymous (JSON body)',
        description: 'infonline-pseudonymous',
        tracker,

        endpointUrls: ['https://de.ioam.de/tx.io', 'https://at.iocnt.net/tx.io'],
        // `ewo` and `ey` are base64 representations of the beginnings of JSON objects (curly brace plus whitespace).
        match: (r) => r.content?.includes('ae=ewo') || r.content?.includes('ae=ey'),

        decodingSteps: [
            { function: 'parseQueryString', input: 'body', output: 'parsedBody' },
            { function: 'getProperty', input: 'parsedBody', output: 'ae', options: { path: 'ae' } },
            { function: 'decodeBase64', input: 'ae', output: 'decodedAe' },
            { function: 'parseJson', input: 'decodedAe', output: 'res.body.ae' },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie.i00', options: { path: 'i00' } },
        ],
        containedDataPaths: {
            ...ioamJsonDataPaths({ context: 'body', prefix: 'ae.', hasEvents: true }),

            deviceId: {
                context: 'cookie',
                path: 'i00',
                reasoning: 'infonline/i00.md',
            },
        },
    },
];
