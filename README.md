# TrackHAR

> Library for detecting tracking data transmissions from traffic in HAR format.

For research into mobile privacy and complaints against tracking, it is important to know what data is being transmitted in a request to a tracking server. But these requests are in a huge variety of different formats and often heavily nested and/or obfuscated, which hinders straightforward automatic analysis. TrackHAR aims to address this problem. It takes recorded traffic in a [HAR files](http://www.softwareishard.com/blog/har-12-spec/) as the input and returns a parsed list of the transmitted data (and, optionally, additional metadata like the tracking company and location in the data) for each request it can handle.

To achieve this, TrackHAR uses adapters written for specific tracking endpoints. In our [research](https://benjamin-altpeter.de/doc/thesis-consent-dialogs.pdf), we have found that generic approaches (like indicator matching in the raw transmitted plain text or [base64-encoded](https://github.com/baltpeter/base64-search) request content) are not sufficient due to the frankly ridiculous nesting and obfuscation we observed. In addition, approaches that search for static honey data values can never capture dynamic data types such as free disk space and current RAM usage, or low-entropy values like the operating system version (e.g. `11`).  
However, we have also noticed that there is a comparatively small number of tracking endpoints which make up a large portion of all app traffic. This makes our adapter-based approach feasible to detect most of the transmitted tracking data. But it will never be possible to write an adapter every request. As such, we plan to implement [support for indicator matching](https://github.com/tweaselORG/TrackHAR/issues/6) as a fallback for requests not covered by any adapter in the future.

An important additional goal of TrackHAR is to produce outputs that make it possible to automatically generate human-readable documentation that allows people to comprehend why we detected each data transmission. This is especially important to submit complaints against illegal tracking to the data protection authorities. The generation of these reports is not handled by TrackHAR itself, but this requirement influences the design of our adapters and return values. As a result, the adapters are not regular functions that know how to handle a request, but implement a specific custom decoding "language" that can more easily be parsed and reasoned about automatically.

## Installation

You can install TrackHAR using yarn or npm:

```sh
yarn add trackhar
# or `npm i trackhar`
```

## API reference

A full API reference can be found in the [`docs` folder](/docs/README.md).

## Example usage

Use the `process()` function to parse traffic from a HAR file and extract the transmitted data:

```ts
import { readFile } from 'fs/promises';
import { process as processHar } from 'trackhar';

(async () => {
    const har = await readFile(process.argv[2], 'utf-8');

    const data = await processHar(JSON.parse(har));
    for (const request of data) console.log(request, '\n');
})();
```

The output will look something like this for a HAR file containing two requests:

```ts
undefined

[
    {
        adapter: 'yandex/appmetrica',
        property: 'otherIdentifiers',
        context: 'query',
        path: 'deviceid',
        reasoning: 'obvious property name',
        value: 'cc89d0f3866e62c804a5a6f81f4aad3b'
    },
    {
        adapter: 'yandex/appmetrica',
        property: 'otherIdentifiers',
        context: 'query',
        path: 'android_id',
        reasoning: 'obvious property name',
        value: '355d2c7e339c6855'
    },
    {
        adapter: 'yandex/appmetrica',
        property: 'osName',
        context: 'query',
        path: 'app_platform',
        reasoning: 'obvious property name',
        value: 'android'
    },
    {
        adapter: 'yandex/appmetrica',
        property: 'osVersion',
        context: 'query',
        path: 'os_version',
        reasoning: 'obvious property name',
        value: '13'
    },
]
```

The first request could not be handled by any adapter, as such it is returned as `undefined`. The second request was handled by the `yandex/appmetrica` adapter, which detected transmissions of two IDs, as well as the operating system name and version.

If you are only interested in the transmitted data and don't need the additional metadata, you can use the `valuesOnly` option:

```ts
import { readFile } from 'fs/promises';
import { process as processHar } from 'trackhar';

(async () => {
    const har = await readFile(process.argv[2], 'utf-8');

    const data = await processHar(JSON.parse(har), { valuesOnly: true });
    for (const request of data) console.log(request, '\n');
})();
```

For our HAR files, this will produce the following output:

```ts
undefined

{
    otherIdentifiers: [ 'cc89d0f3866e62c804a5a6f81f4aad3b', '355d2c7e339c6855' ],
    osName: [ 'android' ],
    osVersion: [ '13' ]
}
```

## License

This code is licensed under the MIT license, see the [`LICENSE`](LICENSE) file for details.

Issues and pull requests are welcome! Please be aware that by contributing, you agree for your work to be licensed under an MIT license.
