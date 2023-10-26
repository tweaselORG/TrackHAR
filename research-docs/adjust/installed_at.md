The `installed_at` property holds the date and time of when the app was installed. This can be verified by looking at the source code of Adjust's SDKs.

In the [Adjust SDK for Android](https://github.com/adjust/android_sdk), the property `installed_at` is set to the value of `deviceInfo.appInstallTime` ([source](https://github.com/adjust/android_sdk/blob/fa125356d93f6797ff7a36a0eb4b8d01b573bc1a/Adjust/sdk-core/src/main/java/com/adjust/sdk/PackageBuilder.java#L336)):

```java
PackageBuilder.addString(parameters, "installed_at", deviceInfo.appInstallTime);
```

The `deviceInfo` object is an instance of the `DeviceInfo` class ([source](https://github.com/adjust/android_sdk/blob/fa125356d93f6797ff7a36a0eb4b8d01b573bc1a/Adjust/sdk-core/src/main/java/com/adjust/sdk/PackageBuilder.java#L22)):

```java
private DeviceInfo deviceInfo;
```

In the constructor of the `DeviceInfo` class, `appInstallTime` is set to the return value of the `getAppInstallTime()` function ([source](https://github.com/adjust/android_sdk/blob/fa125356d93f6797ff7a36a0eb4b8d01b573bc1a/Adjust/sdk-core/src/main/java/com/adjust/sdk/DeviceInfo.java#L113)):

```java
appInstallTime = getAppInstallTime(context);
```

The `getAppInstallTime()` function returns a formatted string of the `firstInstallTime` property of Android's `PackageInfo` class ([source](https://github.com/adjust/android_sdk/blob/fa125356d93f6797ff7a36a0eb4b8d01b573bc1a/Adjust/sdk-core/src/main/java/com/adjust/sdk/DeviceInfo.java#L394-L405)):

```java
private String getAppInstallTime(Context context) {
    try {
        PackageManager packageManager = context.getPackageManager();
        PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), PackageManager.GET_PERMISSIONS);

        String appInstallTime = Util.dateFormatter.format(new Date(packageInfo.firstInstallTime));

        return appInstallTime;
    } catch (Exception ex) {
        return null;
    }
}
```

And, according to the [Android Developers documentation for `PackageInfo`](https://developer.android.com/reference/android/content/pm/PackageInfo), `firstInstallTime` is:

> The time at which the app was first installed.

---

In the [Adjust SDK for iOS](https://github.com/adjust/ios_sdk), the `installed_at` property is set to the value of `self.packageParams.installedAt` ([source](https://github.com/adjust/ios_sdk/blob/f129fbc84962c6bc2442c366cbdf0070ec76de2e/Adjust/ADJPackageBuilder.m#L887)):

```objc
[ADJPackageBuilder parameters:parameters setString:self.packageParams.installedAt forKey:@"installed_at"];
```

`self.packageParams` is an instance of the `ADJPackageParams` class ([source](https://github.com/adjust/ios_sdk/blob/f129fbc84962c6bc2442c366cbdf0070ec76de2e/Adjust/ADJPackageBuilder.m#L27)):

```objc
@property (nonatomic, weak) ADJPackageParams *packageParams;
```

In the constructor of the `ADJPackageParams` class, the `installedAt` property is set to the return value of a function call to `[ADJUtil installedAt]` ([source](https://github.com/adjust/ios_sdk/blob/f129fbc84962c6bc2442c366cbdf0070ec76de2e/Adjust/ADJPackageParams.m#L35)):

```objc
self.installedAt = [ADJUtil installedAt];
```

Finally, `[ADJUtil installedAt]` returns a formatted string of the date and time when the app was installed by looking at the creation date of the app's files ([source](https://github.com/adjust/ios_sdk/blob/f129fbc84962c6bc2442c366cbdf0070ec76de2e/Adjust/ADJUtil.m#L1316-L1369)):

```objc
+ (NSString *)installedAt {
    // […]
    @try {
        NSArray *paths = NSSearchPathForDirectoriesInDomains(folderToCheck, NSUserDomainMask, YES);
        if (paths.count > 0) {
            pathToCheck = [paths objectAtIndex:0];
        } else {
            pathToCheck = [[NSBundle mainBundle] bundlePath];
        }

        __autoreleasing NSError *error;
        __autoreleasing NSError **errorPointer = &error;
        Class class = NSClassFromString([NSString adjJoin:@"N", @"S", @"file", @"manager", nil]);
        if (class != nil) {
            NSString *keyDm = [NSString adjJoin:@"default", @"manager", nil];
            SEL selDm = NSSelectorFromString(keyDm);
            if ([class respondsToSelector:selDm]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                id man = [class performSelector:selDm];
#pragma clang diagnostic pop
                NSString *keyChk = [NSString stringWithFormat:@"%@%@",
                        [NSString adjJoin:@"attributes", @"of", @"item", @"at", @"path", @":", nil],
                        [NSString adjJoin:@"error", @":", nil]];
                SEL selChk = NSSelectorFromString(keyChk);
                if ([man respondsToSelector:selChk]) {
                    NSInvocation *inv = [NSInvocation invocationWithMethodSignature:[man methodSignatureForSelector:selChk]];
                    [inv setSelector:selChk];
                    [inv setTarget:man];
                    [inv setArgument:&pathToCheck atIndex:2];
                    [inv setArgument:&errorPointer atIndex:3];
                    [inv invoke];
                    NSMutableDictionary * __unsafe_unretained tmpResult;
                    [inv getReturnValue:&tmpResult];
                    NSMutableDictionary *result = tmpResult;
                    CFStringRef *indexRef = dlsym(RTLD_SELF, [[NSString adjJoin:@"N", @"S", @"file", @"creation", @"date", nil] UTF8String]);
                    NSString *ref = (__bridge_transfer id) *indexRef;
                    installTime = result[ref];
                }
            }
        }
    } @catch (NSException *exception) {
        [logger error:@"Error while trying to check install date. Exception: %@", exception];
        return nil;
    }

    return [ADJUtil formatDate:installTime];
}
```
