# TrackHAR

> Library for detecting tracking data transmissions from traffic in HAR format.

For research into mobile privacy and complaints against tracking, it is important to know what data is being transmitted in a request to a tracking server. But these requests are in a huge variety of different formats and often heavily nested and/or obfuscated, which hinders straightforward automatic analysis. TrackHAR aims to address this problem. It takes recorded traffic in a [HAR files](http://www.softwareishard.com/blog/har-12-spec/) as the input and returns a parsed list of the transmitted data (and, optionally, additional metadata like the tracking company and location in the data) for each request it can handle.

To achieve this, TrackHAR uses adapters written for specific tracking endpoints. In our [research](https://benjamin-altpeter.de/doc/thesis-consent-dialogs.pdf), we have found that generic approaches (like indicator matching in the raw transmitted plain text or [base64-encoded](https://github.com/baltpeter/base64-search) request content) are not sufficient due to the frankly ridiculous nesting and obfuscation we observed. In addition, approaches that search for static honey data values can never capture dynamic data types such as free disk space and current RAM usage, or low-entropy values like the operating system version (e.g. `11`).  
However, we have also noticed that there is a comparatively small number of tracking endpoints which make up a large portion of all app traffic. This makes our adapter-based approach feasible to detect most of the transmitted tracking data. But it will never be possible to write an adapter for every request. As such, we plan to implement [support for indicator matching](https://github.com/tweaselORG/TrackHAR/issues/6) as a fallback for requests not covered by any adapter in the future.

An important additional goal of TrackHAR is to produce outputs that make it possible to automatically generate human-readable documentation that allows people to comprehend why we detected each data transmission. This is especially important to submit complaints against illegal tracking to the data protection authorities. The generation of these reports is not handled by TrackHAR itself, but this requirement influences the design of our adapters and return values. As a result, the adapters are not regular functions that know how to handle a request, but implement a specific custom decoding "language" that can more easily be parsed and reasoned about automatically. This documentation is generated in [tweaselORG/tracker-wiki](https://github.com/tweaselORG/tracker-wiki) and hosted at [trackers.tweasel.org](https://trackers.tweasel.org).

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

For our HAR file, this will produce the following output:

```ts
undefined

{
    otherIdentifiers: [ 'cc89d0f3866e62c804a5a6f81f4aad3b', '355d2c7e339c6855' ],
    osName: [ 'android' ],
    osVersion: [ '13' ]
}
```

## Contributing adapters

As stated, TrackHAR uses so-called adapters to detect tracking traffic. They are javascript objects defining a decoding algorithm for the request and the paths to the transmitted data in the decoded request. For each endpoint of a tracker, a separate adapter needs to be defined. To determine which adapter fits a request, the URL is matched to the `endpointUrls` of the adapter, which can either just use string matching or a proper regular expression. If one of the endpoints matches, the adapter is chosen to analyze the request. Where the same endpoint expects different data formats, multiple adapters with identical `endpointUrls` might be required. In that case, the `match` function of an adapter will be used to determine which adapter to apply to a request. The first adapter to return `true` in its matching method is chosen. Only one adapter can match a request at a time.

### Gathering data

If you want to contribute an adapter, first, gather some actual traffic that contains requests to the endpoint you want to write an adapter for (you can use [tweaselORG/cyanoacrylate](https://github.com/tweaselORG/cyanoacrylate) for that). For an adapter to make it to the database, the tracker needs to contact the endpoint from two separate apps, prefereably from different developers. From your collected requests, first try to manually decode it, e.g. using [CyberChef](https://gchq.github.io/CyberChef/), and note the steps it took you to decode the request. Then, look at the decoded request and try to determine the types of data transmitted.  

One way of doing that is by the property name. Some property names are obviously connected to one data type, e.g. a property named `screen_width` likely contains the screen width of the device. In other cases, the values are very obvious, e.g. `Android` likely refers to the name of the operating system. In many cases, however, it is not that clear cut. You might recognize a property from specific honey data you planted, such as the longitude and latitude of a fake location which show up in the request data or the IDFA of the device that you know beforehand. In these cases, you need to publicly document your research showing how you reached the conclusion that a specific type of data is present in the request and refer to that research in the adapter via a permalink.

### Metadata

Adapters are grouped within one file for each tracking company in the `src/adapters` directory. The file name must be the `slug` of the `Tracker` the the adapters in a file belong to. Each file must export an array of adapters as `adapters`. In the tracker file, first define the meta information of the tracker, such as:  

```js
const tracker: Tracker = {
    slug: '<tracker slug>',
    name: '<legal name of the tracking company>',
    datenanfragenSlug: '<slug of the tracking company at datarequests.org>',
    exodusId: 0, // ID of the tracker in the Exodus database
};
```

You can find the `datenanfragenSlug` of the tracking company in [the datarequests.org database](https://www.datarequests.org/company/), by searching for the company and copying the slug from the URL: `https://www.datarequests.org/company/<datenanfragenSlug>/`. For the `exodusId`, search the tracker in [their database](https://reports.exodus-privacy.eu.org/en/trackers/) and copy the id from the URL again: `https://reports.exodus-privacy.eu.org/en/trackers/<exodusId>/`.

### Adapter matching

After that, you can start by defining the adapter. You can use variables to reuse parts of adapters you need more than once. Start by giving your adapter a `slug`, which needs to be unique within one tracking company. You can also add the tracker information you defined earlier, in the `tracker` property. In the `endpointUrls`, TrackHAR expects an array of strings or regular expressions of all URLs the adapter defines decoding steps and data paths for. Often, you'd want to use a regex to match URLs which might contain some data in the URL as well. TrackHAR always matches against the full URL, including protocol and query. If the requests to two endpoints are similar but slightly different, write two different adapters for them. You should again pull out parts of the adapter into variables to avoid duplicating the code. If there are different request which require specific handling to the same endpoint, you also need to split your adapter to match only a single type of request. To do that, match the adapter to the same endpoint and d### Gathering data
efine a `match` method in both adapters. It expects a `Request` object containing the raw data of the request and should return `true` if the adapter applys to the reqeust. Typically you’d  match against characteristic characters in the body or the `Content-Type` header to determine if you an adapter can parse the request, see e.g. this `match` method of a facebook adapter:

```js
match: (request) => request.content?.startsWith('{"'),
```

### Decoding Steps

If your adapter matches, next it tries to decode the data in the request. Therefore, you must define the algorithm to use in order to decode all relevant data in the `decodingSteps` property of your adapter. Because we automatically generate documentation for the adapters, we defined our own schema describing the decoding algorithm: The `decodingSteps` are an array of `DecodingStep` objects, which contain a function and what parts of the request they should work on. The `function` is set as the string name of a predefined decoding function, such as `parseJson` (look at the [API docs](/docs/README.md) for the full set). Each function takes and `input` argument, which expects a path in the global decoding state. This state is basically an object in which you can write temporary data to any property. It is initialized with the data from each context of the request, so the `body` property contains the raw request body, the `query` property contains the raw query string and so on. You can overwrite those values and, if the values are objects, use a JSON path, like `body.identifiers.idfa`, to access or overwrite its properties. If you want to run a function on each element of an array, you can also use the `mapInput` property of a `DecodingStep` instead of the `input` property. In that case the function will be mapped over the non-empty entries of the array at the input path, like so: `mapInput.filter((i) => i !== undefined && i !== null).map(function)`. Each `DecodingStep` also expects an `output` property, which spcifies the variable in the decoding state in which to return the result of the function to. This can simply be a generic varibale name, a JSON path, if you want to save the value into a property on an object in the state, and, notably, a path on the special `res` object. The `res` object has one property for each context (`body`, `query` etc.) and this is the object in which TrackHAR expects the final decoded request, which is then passed on to the next processing step. These are the basics of how to construct the decoding algorithm. Let’s take a look at an example from the facebook graph adapter:

```js
decodingSteps: [
    { function: 'parseJson', input: 'body', output: 'b' },
    { function: 'parseJson', input: 'b.batch', output: 'batch' },
    { function: 'getProperty', mapInput: 'batch', options: { path: 'relative_url' }, output: 'relativeUrls' },
    { function: 'parseQueryString', mapInput: 'relativeUrls', output: 'res.body.batch' },
    { function: 'getProperty', input: 'b', options: { path: 'batch_app_id' }, output: 'res.body.batch_app_id' },
],
```

As you can see, some functions additonally take in `options`, like the `getProperty` function which needs the path to the property it should read. Functions are run in the order in which they appear in the array. Results are only written to the `output` if they are non-empty. In this case, the adapter first parses the body as a JSON and writes that to the temporary variable `b`. Then, it parses the `batch` property of the previously parsed JSON as a JSON again and writes that to a temporary vaiable as well. The content of that `batch` variable is an arry of similar objects, so the adapter uses `mapInput` to get the property `relative_url` from all its properties and writes them into the temporary array `relativeUrls`. These srings are then parsed as query strings and the resulting array of objects is then written to the special `res` object in the `batch` property of the `body` context. We try to preserve the original property names in the `res` object as best as possible to make it easier to make it more comprehensible, such as in the last step, where the `batch_app_id` on the parsed body is read into the `batch_app_id` property of the result object.

If a function you need doesn’t exist, you’ll need to define a new one in the `decode-functions.ts` and add it to the definition of the `DecodingStep` type in the `index.ts`. Try to keep the function general and simple and not adapter-specific. If you need some adapter specific logic, rather try and abstract it away in many functions and keep the logic in the `decodingSteps`. Your function should also have an easily comprehensible name in camelCase, which describes everything it does. You’ll also need to add a human-readable desciption to the [tracker-wiki translations](https://github.com/tweaselORG/tracker-wiki/tree/main/i18n).

### Data paths

To extract the data from the decoded request, the adapter specifies the path in which to find the data in the decoded request. This path is obviously a concept that TrackHAR imposes upon the request, because they are rarely in a consistent format. But nevertheless, the goal is to try and keep the path as close to the original data format as possible. The `containedDataPaths` property contains an object, in which each property name is one of different types of data which might be found in the request, with a `DataPath` spec of where to find that data as a value. These should be the result of the research mentioned above, meaning manual analysis of lots of requests or maybe reverse engineering of the formats (e.g. a protobuf schema). A `DataPath` consists of:

- The `context` where the data was found, e.g. the `body`.
- `path`, the JSON Path to access the property in the `res.<context>` object of the decoding context. This can contain [complex JSON path notation support by `jsonpath-plus`](https://jsonpath-plus.github.io/JSONPath/docs/ts/#syntax-through-examples).
- The `reasoning` for why the path is assumed to contain this data type. This should either link to further reserach or documentation that makes that point clear, or reference to how either the property name or the value is really obviously connected to the data type.

Properties in `containedDataPaths` may also contain an array of several `DataPath`s, because one data type might be found in several places in a request, e.g. the `language` might be part of the `query` but also a property in the `body`. If a property in a request contains more than one data type, it should be mentioned in all of these data types. For example, a property `body.platform` might contain a value like `Android 13.2`, which contains the `osName` as well as the `osVersion`. In this case, you’ll need to add the path `body.platform` to both of these properties in the `containedDataPaths`.

In case you come across a data type that is not defined in the types yet, add your data type to the `Property` type in the `index.ts`. Give it an obvious, camelCased name and also a human-readable description in the [tracker-wiki translations](https://github.com/tweaselORG/tracker-wiki/tree/main/i18n).

## License

This code and the adapters are licensed under a Creative Commons CC0 1.0 Universal license, see the [`LICENSE`](LICENSE) file for details.

Issues and pull requests are welcome! Please be aware that by contributing, you agree for your work to be licensed under a CC0 license.
