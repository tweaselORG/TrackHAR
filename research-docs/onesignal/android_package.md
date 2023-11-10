On Android, the `android_package` property is the app ID. This can be verified by looking at the source code of the [OneSignal Android Push Notification Plugin](https://github.com/OneSignal/OneSignal-Android-SDK) ([archived](https://web.archive.org/web/20231110171825/https://github.com/OneSignal/OneSignal-Android-SDK)).

Here, the `android_package` property is set to the value of the variable `packageName` ([source](https://github.com/OneSignal/OneSignal-Android-SDK/blob/2cbb251031a26ef61984b9cb7d728ef9c5277e92/OneSignalSDK/onesignal/src/main/java/com/onesignal/OneSignal.java#L1517), [archived](https://archive.ph/J4vLX)):

```java
deviceInfo.put("android_package", packageName);
```

This variable is set to the return value of the `getPackageName()` function on the `appContext` static property ([source](https://github.com/OneSignal/OneSignal-Android-SDK/blob/2cbb251031a26ef61984b9cb7d728ef9c5277e92/OneSignalSDK/onesignal/src/main/java/com/onesignal/OneSignal.java#L1504), [archived](https://archive.ph/J4vLX)):

```java
String packageName = appContext.getPackageName();
```

The static property `appContext` is an instance of the `android.content.Context` class (source [1](https://github.com/OneSignal/OneSignal-Android-SDK/blob/2cbb251031a26ef61984b9cb7d728ef9c5277e92/OneSignalSDK/onesignal/src/main/java/com/onesignal/OneSignal.java#L34) ([archived](https://archive.ph/J4vLX)) and [2](https://github.com/OneSignal/OneSignal-Android-SDK/blob/2cbb251031a26ef61984b9cb7d728ef9c5277e92/OneSignalSDK/onesignal/src/main/java/com/onesignal/OneSignal.java#L382) ([archived](https://archive.ph/J4vLX))):

```java
import android.content.Context;

// […]

static Context appContext;
```

The `getPackageName()` function of that class returns the app ID ([source](https://developer.android.com/reference/android/content/Context#getPackageName()), [archived](https://web.archive.org/web/20231110173320/https://developer.android.com/reference/android/content/Context#getPackageName())).
