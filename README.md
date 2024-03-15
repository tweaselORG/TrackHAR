# TrackHAR

> Library for detecting tracking data transmissions from traffic in HAR format.

For research into mobile privacy and complaints against tracking, it is important to know what data is being transmitted in a request to a tracking server. But these requests are in a huge variety of different formats and often heavily nested and/or obfuscated, which hinders straightforward automatic analysis. TrackHAR aims to address this problem. It takes recorded traffic in a [HAR files](http://www.softwareishard.com/blog/har-12-spec/) as the input and returns a parsed list of the transmitted data (and, optionally, additional metadata like the tracking company and location in the data) for each request it can handle.

To achieve this, TrackHAR uses two complementary approaches: adapter-based parsing and indicator matching.

* **Adapter-based parsing**: Our main approach is to use adapters written for specific tracking endpoints. In our [research](https://benjamin-altpeter.de/doc/thesis-consent-dialogs.pdf), we have found that generic approaches (like indicator matching in the raw transmitted plain text or [base64-encoded](https://github.com/baltpeter/base64-search) request content) are not sufficient due to the frankly ridiculous nesting and obfuscation we observed. In addition, approaches that search for static honey data values can never capture dynamic data types such as free disk space and current RAM usage, or low-entropy values like the operating system version (e.g. `11`).  
    However, we have also noticed that there is a comparatively small number of tracking endpoints which make up a large portion of all app traffic. This makes our adapter-based approach feasible to detect most of the transmitted tracking data.

* **Indicator matching**: But it will never be possible to write an adapter for every request. Thus, we use indicator matching as a fallback for requests not covered by any adapter. Indicator matching relies on the user providing known honey data values (such as the advertising ID or geolocation) that are then searched for in the requests. TrackHAR supports indicator matching for plain text, base64-encoded and URL-encoded values in the request headers, path, or body. It also tries to match case-insensitively where possible.

Note that TrackHAR is designed to err on the side of matching too little instead of overmatching. Both the adapters and indicator matching can miss transmitted tracking data. However conversely, you can be sure that any data that TrackHAR detects is actually transmitted. This is beneficial for research but also legal enforcement against tracking.

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

If you want to enable indicator matching for requests not handled by any adapter, you need to provide an object with indicator values for certain properties:

```ts
import { readFile } from 'fs/promises';
import { process as processHar } from 'trackhar';

(async () => {
    const har = await readFile(process.argv[2], 'utf-8');

    const indicators = {
        localIp: [ '10.0.0.2', 'fd31:4159::a2a1' ],
        idfa: '6a1c1487-a0af-4223-b142-a0f4621d0311'
    };

    const data = await processHar(JSON.parse(har), { indicatorValues: indicators });
    for (const request of data) console.log(request, '\n');
})();
```

With this, we can see that our device's advertising ID was transmitted in the first request, after all:

```ts
[
    {
        adapter: 'indicators',
        property: 'idfa',
        context: 'body',
        path: '$[12]',
        reasoning: 'indicator matching (base64)',
        value: 'NmExYzE0ODctYTBhZi00MjIzLWIxNDItYTBmNDYyMWQwMzEx'
    }
]

// [second request as before…]
```

In this case, it was not transmitted as plain text but base64-encoded. TrackHAR was still able to detect it. The `path` indicates the index into the body where the IDFA was found.

Finally, TrackHAR bundles translations for human-readable descriptions of our standardized property names, as well as introductory descriptions for trackers and adapters. You can use those like this:

```ts
import translationsEn from 'trackhar/i18n/en.json';

console.log(translationsEn.properties.diskTotal);
// => "Total disk space"

console.log(translationsEn['tracker-descriptions'].adjust);
// => "Adjust offers the following services: […]"
```

## Contributing adapters

As stated, TrackHAR uses so-called adapters to detect tracking traffic. They are JavaScript objects defining a decoding algorithm for the request and the paths to the transmitted data in the decoded request. For each endpoint of a tracker, a separate adapter needs to be defined. To determine which adapter fits a request, the URL is matched against the `endpointUrls` of the adapter, which can either just use string matching or a regular expression. If one of the endpoints matches, the adapter is chosen to analyze the request. Where the same endpoint expects different data formats, multiple adapters with identical `endpointUrls` might be required. In that case, the `match` function of an adapter will be used to determine which adapter to apply to a request. The first adapter to return `true` in its matching method is chosen. Only one adapter can match a request at a time.

### Gathering data

If you want to contribute an adapter, first gather some actual traffic that contains requests to the endpoint you want to write an adapter for (you can use [tweaselORG/cyanoacrylate](https://github.com/tweaselORG/cyanoacrylate) for that). For an adapter to make it to the database, the tracker needs to contact the endpoint from two separate apps, prefereably from different developers. From your collected requests, first try to manually decode it, e.g. using [CyberChef](https://gchq.github.io/CyberChef/), and note the steps it took you to decode the request. Then, look at the decoded request and try to determine the types of data transmitted.  

One way of doing that is by the property name. Some property names are obviously connected to one data type, e.g. a property named `screen_width` likely contains the screen width of the device. In other cases, the values are very obvious, e.g. `iOS` likely refers to the name of the operating system. In many cases, however, it is not that clear cut. You might recognize a property from specific honey data you planted, such as the longitude and latitude of a fake location which show up in the request data or the IDFA of the device that you know beforehand. In these cases, you need to publicly document your research showing how you reached the conclusion that a specific type of data is present in the request and refer to that research in the adapter via a permalink (we are currently working on a proper place for this, see [tweaselORG/meta#3](https://github.com/tweaselORG/meta/issues/3)).

### Metadata

Adapters are grouped within one file for each tracking company in the `src/adapters` directory. The file name must be the `slug` of the `Tracker` the the adapters in that file belong to. Each file must export an array of adapters as `adapters`. In the tracker file, first define the meta information of the tracker, such as:  

```ts
const tracker: Tracker = {
    slug: '<tracker slug>',
    name: '<legal name of the tracking company>',
    description: '<translation key>',
    datenanfragenSlug: '<slug of the tracking company at datarequests.org>',
    exodusId: 0, // ID of the tracker in the Exodus database
};
```

You can find the `datenanfragenSlug` of the tracking company in [the datarequests.org database](https://www.datarequests.org/company/), by searching for the company and copying the slug from the URL: `https://www.datarequests.org/company/<datenanfragenSlug>/`. For the `exodusId`, search the tracker in [their database](https://reports.exodus-privacy.eu.org/en/trackers/) and again copy the ID from the URL: `https://reports.exodus-privacy.eu.org/en/trackers/<exodusId>/`.

After that, you can start by defining the adapter. You can use variables to reuse parts of adapters you need more than once. Start by giving your adapter a `slug`, which needs to be unique within one tracking company. You will also need to define a human-readable name for the adapter in the `name` property, which should be as close as possible to the official name for the endpoint, where there is one. To distinguish different adapters for the same endpoint that parse different formats, append a short description in parentheses (e.g. `Facebook Graph App Events API (JSON)` and `Facebook Graph App Events API (query string)`). Add the tracker information you defined earlier in the `tracker` property.

### Tracker and adapter descriptions

Both the `Tracker` and `Adapter` can also have a `description` property to give context on the tracking company/endpoint. The description is not provided directly. Instead, provide a translation key and add the description under `tracker-descriptions` in `i18n/*.json`.

Sometimes, it makes sense to only a either a `Tracker` or an `Adapter` description (e.g. if all adapters just parse slightly different formats of the same endpoint, or conversly, if all adapters are for different tracking products that just happen to be run by the same company), other times, it makes sense to have both (e.g. if all adapters describe the same tracking service, but different endpoints serve different purpose). Between the description for the tracker and adapter, the following information should be conveyed:

* A list of services offered by the tracker, focusing only on those relevant to users' personal data. For example, we don't care if the tracker advertises with offering a fancy dashboard with a modern design. However, if they claim to be able to be able to do attribution of advertising clicks or linking of devices IDs, that is very relevant.
* If available, any additional justification of why the data the collected data is personal data.
* If applicable, details about third-party trackers/advertisers that the data is shared/synced with.
* If available, quotes from the documentation that explain that the developer needs to obtain the user's consent for the tracker.

Where necessary, the description service can go into more detail to properly explain the tracker's claims. Try not to unnecessarily repeat the company's marketing language. The descriptions should make heavy use of references (see below) to support all of our claims. Where it makes sense, you can include direct quotes instead of editorializing.

You can use the following limited markup:

- Unnumbered lists using dashes, e.g.:

  ```
  - Item 1
    - Item 1.1
    - Item 1.2
  - Item 2
  ```
- References/citations to URLs in square brackets, e.g. `SampleTracker claims to be able to infer a user’s legal identity based on the screen resolution.[https://sampletracker.tld/features/ai-identity-inference]`.

### Adapter matching

In the `Tracker`'s `endpointUrls`, TrackHAR expects an array of strings or regular expressions of all URLs the adapter defines decoding steps and data paths for. Often, you'd want to use a regex to match URLs which might contain some data in the URL as well. TrackHAR always matches against the full URL, including protocol and query. If the requests to two endpoints are similar but slightly different, write two different adapters for them. You should again pull out parts of the adapter into variables to avoid duplicating the code.

If there are different requests which require specific handling to the same endpoint, you also need to split your adapter to match only a single type of request. To do that, match the adapter to the same endpoint and define a `match` method in both adapters. It receives a `Request` object containing the raw data of the request and should return `true` if the adapter applies to the request. Typically you’d match against characteristic characters in the body or the `Content-Type` header to determine if you an adapter can parse the request, see e.g. this `match` method of a Facebook adapter:

```js
match: (request) => request.content?.startsWith('{"'),
```

### Decoding Steps

If your adapter matches, next it tries to decode the data in the request. Therefore, you must define the algorithm to use in order to decode all relevant data in the `decodingSteps` property of your adapter. Because we automatically generate documentation for the adapters, we defined our own schema describing the decoding algorithm: The `decodingSteps` are an array of `DecodingStep` objects, which contain a function and what parts of the request they should work on. The `function` is set as the string name of a predefined decoding function, such as `parseJson` (look at the [API docs](/docs/README.md) for the full set). Each function takes an `input` argument, which expects a path in the global decoding state. This state is basically an object in which you can write temporary data to any property. It is initialized with the data from each context of the request, so the `body` property contains the raw request body, the `query` property contains the raw query string and so on. You can overwrite those values and, if the values are objects, use a JSONPath, like `body.identifiers.idfa`, to access or overwrite its properties. If you want to run a function on each element of an array, you can also use the `mapInput` property of a `DecodingStep` instead of the `input` property. In that case the function will be mapped over the non-empty entries of the array at the input path, like so: `mapInput.filter((i) => i !== undefined && i !== null).map(function)`. Each `DecodingStep` also expects an `output` property, which specifies the variable in the decoding state in which to return the result of the function to. This can simply be a generic variable name, a or a property access with the `.` operator (notably, here we don’t support all the other features of JSON path), if you want to save the value into a property on an object in the state, and, notably, a path on the special `res` object. The `res` object has one property for each context (`body`, `query`, etc.) and this is the object in which TrackHAR expects the final decoded request, which is then passed on to the next processing step. These are the basics of how to construct the decoding algorithm. Let’s take a look at an example from the Facebook graph adapter:

```js
decodingSteps: [
    { function: 'parseJson', input: 'body', output: 'b' },
    { function: 'parseJson', input: 'b.batch', output: 'batch' },
    { function: 'getProperty', mapInput: 'batch', options: { path: 'relative_url' }, output: 'relativeUrls' },
    { function: 'parseQueryString', mapInput: 'relativeUrls', output: 'res.body.batch' },
    { function: 'getProperty', input: 'b', options: { path: 'batch_app_id' }, output: 'res.body.batch_app_id' },
],
```

As you can see, some functions additonally take in `options`, like the `getProperty` function which needs the path to the property it should read. Functions are run in the order in which they appear in the array. Results are only written to the `output` if they are non-empty. In this case, the adapter first parses the body as a JSON and writes that to the temporary variable `b`. Then, it parses the `batch` property of the previously parsed JSON as a JSON again and writes that to a temporary variable as well. The content of that `batch` variable is an array of similar objects, so the adapter uses `mapInput` to get the property `relative_url` from all its properties and writes them into the temporary array `relativeUrls`. These strings are then parsed as query strings and the resulting array of objects is then written to the special `res` object in the `batch` property of the `body` context. We try to preserve the original property names in the `res` object as best as possible to make it easier to make it more comprehensible, such as in the last step, where the `batch_app_id` on the parsed body is read into the `batch_app_id` property of the result object.

If a function you need doesn’t exist, you’ll need to define a new one in the `decode-functions.ts` and add it to the definition of the `DecodingStep` type in the `index.ts`. Try to keep the function general and simple and not adapter-specific. If you need some adapter specific logic, rather try and abstract it away in many functions and keep the logic in the `decodingSteps`. Your function should also have an easily comprehensible name in camelCase, which describes everything it does. You’ll also need to add a human-readable description to the [tracker-wiki translations](https://github.com/tweaselORG/tracker-wiki/tree/main/i18n).

### Data paths

To extract the data from the decoded request, the adapter specifies the path in which to find the data in the decoded request. This path is obviously a concept that TrackHAR imposes upon the request, because they are rarely in a consistent format. But nevertheless, the goal is to try and keep the path as close to the original data format as possible. The `containedDataPaths` property contains an object, in which each property name is one of different types of data which might be found in the request, with a `DataPath` spec of where to find that data as a value. These should be the result of the research mentioned above, meaning manual analysis of lots of requests or maybe reverse engineering of the formats (e.g. a protobuf schema). A `DataPath` consists of:

- The `context` where the data was found, e.g. the `body`.
- `path`, the JSONPath to access the property in the `res.<context>` object of the decoding context. This can contain [complex JSONPath notation supported by `jsonpath-plus`](https://jsonpath-plus.github.io/JSONPath/docs/ts/#syntax-through-examples).
- The `reasoning` for why the path is assumed to contain this data type. This should either link to further reserach or documentation that makes that point clear, or reference to how either the property name or the value is really obviously connected to the data type.

Properties in `containedDataPaths` may also contain an array of several `DataPath`s, because one data type might be found in several places in a request, e.g. the `language` might be part of the `query` but also a property in the `body`. If a property in a request contains more than one data type, it should be mentioned in all of these data types. For example, a property `body.platform` might contain a value like `Android 13.2`, which contains the `osName` as well as the `osVersion`. In this case, you’ll need to add the path `body.platform` to both of these properties in the `containedDataPaths`.

In case you come across a data type that is not defined in the types yet, give it an obvious, camelCased name and add that together with a human-readable description to the translations files in the `i18n` folder under `properties`.

### Debugging adapters

While developing an adapter, you can use our debug script to test your adapter against hundreds of thousands of real requests in our [open request database](https://data.tweasel.org/). To do so, run:

```sh
yarn debug-adapter <tracker slug>/<adapter slug>
# e.g.: yarn debug-adapter facebook/graph
```

This will run your adapter against all matching requests in the database and print the results to the console. In addition, it will output a deepmerged version of the intermediate decoding result to the file `./merged-decoded-requests.tmp.json`.

You can optionally pass `--merge-result` to see the results for all requests merged into a single object and with duplicate values for each data type removed.

## License

This code and the adapters are licensed under a Creative Commons CC0 1.0 Universal license, see the [`LICENSE`](LICENSE) file for details.

Issues and pull requests are welcome! Please be aware that by contributing, you agree for your work to be licensed under a CC0 license.
