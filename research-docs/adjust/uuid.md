# Unique tracking IDs

The `android_uuid`, `ios_uuid`, `persistent_ios_uuid`, and `web_uuid` properties are unique IDs for the device that Adjust generates on install and correlates with other device IDs.

According to [Adjust’s documentation for iOS](https://help.adjust.com/en/article/server-to-server-attribution-checklist#generate-universally-unique-identifier-and-persist-it-to-the-device-keychain) ([archived](https://web.archive.org/web/20230825103714/https://help.adjust.com/en/article/server-to-server-attribution-checklist#generate-universally-unique-identifier-and-persist-it-to-the-device-keychain)):

> When users reset their advertising ID, uninstall and reinstall your app, or enable LAT, Adjust will not be able to retrieve their IDFA and/or IDFV. To continuously track users’ in-app sessions, Adjust relies on a permanent, locally generated UUID persisted to the device keychain. […]
> […]
> How does Adjust manage UUIDs?
> Adjust generates a UUID upon install. This is mapped to other device information on our backend.

Further, [Adjust’s documentation for iOS](https://help.adjust.com/en/article/server-to-server-sessions#post-payload) ([archived](https://archive.ph/nKj9f#post-payload)) says:

> Parameter | Description | Example
> -- | -- | --
> persistent_ios_uuid | Same as ios_uuid, but saved in Keychain so that re-installed apps will have same value, iOS only | 3b35fcfb-6115-4cff-830f-e32a248c487d

And according to [Adjust’s documentation for the web](https://help.adjust.com/en/article/web-attribution#how-it-works) ([archived](https://web.archive.org/web/20230825104342/https://help.adjust.com/en/article/web-attribution#how-it-works)):

> To identify unique web users, the Adjust web SDK generates a unique web_uuid when it measures a session. The ID is created per subdomain and per browser. This means that if a user switches from Chrome to Safari, the SDK creates 2 web_uuid entries for the device. The identifier follows the Universally Unique Identifier (UUID) format.
>
> * Example: web_uuid=4d1615ab-ee78-49aa-a10f-d57035322a42
>
> Adjust uses [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to store the web_uuid in the browser, or falls back to localStorage if IndexedDB is not available.

And while the property is not documented for Android, we can verify that the same applies here by looking at the [source code for Adjust SDK for Android](https://github.com/adjust/android_sdk):

Here, the `android_uuid` property is set to `activityStateCopy.uuid` ([source](https://github.com/adjust/android_sdk/blob/fa125356d93f6797ff7a36a0eb4b8d01b573bc1a/Adjust/sdk-core/src/main/java/com/adjust/sdk/PackageBuilder.java#L294-L296)):

```java
// Device identifiers.
deviceInfo.reloadPlayIds(adjustConfig);
PackageBuilder.addString(parameters, "android_uuid", activityStateCopy.uuid);
```

`activityStateCopy` is an instance of the `ActivityStateCopy` class that is passed an instance of the `ActivityState` class ([source](https://github.com/adjust/android_sdk/blob/fa125356d93f6797ff7a36a0eb4b8d01b573bc1a/Adjust/sdk-core/src/main/java/com/adjust/sdk/PackageBuilder.java#L69-L79)):

```java
PackageBuilder(AdjustConfig adjustConfig,
               DeviceInfo deviceInfo,
               ActivityState activityState,
               SessionParameters sessionParameters,
               long createdAt) {
    // […]
    this.activityStateCopy = new ActivityStateCopy(activityState);
    // […]
}
```

An `ActivityStateCopy` object is just a wrapper around the `ActivityState` class, which exposes a few of its properties, including the `uuid` property ([source](https://github.com/adjust/android_sdk/blob/fa125356d93f6797ff7a36a0eb4b8d01b573bc1a/Adjust/sdk-core/src/main/java/com/adjust/sdk/PackageBuilder.java#L44-L67)):

```java
ActivityStateCopy(ActivityState activityState) {
    // […]
    this.uuid = activityState.uuid;
    // […]
}
```

In an `ActivityState` object, the `uuid` property is set to the return value of a call to the `Util.createUuid()` function ([source](https://github.com/adjust/android_sdk/blob/fa125356d93f6797ff7a36a0eb4b8d01b573bc1a/Adjust/sdk-core/src/main/java/com/adjust/sdk/ActivityState.java#L127-L128)):

```java
// create UUID for new devices
uuid = Util.createUuid();
```

And the `Util.createUuid()` function uses the `randomUUID()` of the `java.util.UUID` package ([documentation](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html#randomUUID--)) to generate a version 4 UUID ([source](https://github.com/adjust/android_sdk/blob/fa125356d93f6797ff7a36a0eb4b8d01b573bc1a/Adjust/sdk-core/src/main/java/com/adjust/sdk/Util.java#L79-L81)):

```java
import java.util.UUID;

// […]

protected static String createUuid() {
    return UUID.randomUUID().toString();
}
```
