In the `fb_anon_id` property, Adjust transmits the `anon_id` property from the Facebook SDK, which is a unique ID for the device that Facebook generates and persists on the device.

This can be verified by looking at the source code of the [Adjust SDK for iOS](https://github.com/adjust/ios_sdk).

Here, the `fb_anon_id` property is set to `self.packageParams.fbAnonymousId` ([source](https://github.com/adjust/ios_sdk/blob/f129fbc84962c6bc2442c366cbdf0070ec76de2e/Adjust/ADJPackageBuilder.m#L433)):

```objc
[ADJPackageBuilder parameters:parameters setString:self.packageParams.fbAnonymousId forKey:@"fb_anon_id"];
```

`self.packageParams` is an instance of the `ADJPackageParams` class ([source](https://github.com/adjust/ios_sdk/blob/f129fbc84962c6bc2442c366cbdf0070ec76de2e/Adjust/ADJPackageBuilder.m#L27)):

```objc
@property (nonatomic, weak) ADJPackageParams *packageParams;
```

In the constructor of the `ADJPackageParams` class, the `fbAnonymousId` property is set to the return value of a function call to `[ADJUtil fbAnonymousId]` ([source](https://github.com/adjust/ios_sdk/blob/f129fbc84962c6bc2442c366cbdf0070ec76de2e/Adjust/ADJPackageParams.m#L28)):

```objc
self.fbAnonymousId = [ADJUtil fbAnonymousId];
```

Finally, `[ADJUtil fbAnonymousId]` calls the Facebook SDK's `retrievePersistedAnonymousID` function in the `FBSDKBasicUtility` ([source](https://github.com/adjust/ios_sdk/blob/f129fbc84962c6bc2442c366cbdf0070ec76de2e/Adjust/ADJUtil.m#L1102-L1117)):

```objc
// post FB SDK v6.0.0
// return [FBSDKBasicUtility retrievePersistedAnonymousID];
Class class = nil;
SEL selGetId = NSSelectorFromString(@"retrievePersistedAnonymousID");
class = NSClassFromString(@"FBSDKBasicUtility");
if (class != nil) {
    if ([class respondsToSelector:selGetId]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
        NSString *fbAnonymousId = (NSString *)[class performSelector:selGetId];
        return fbAnonymousId;
#pragma clang diagnostic pop
    }
}
```

The `retrievePersistedAnonymousID` method returns Facebook's `anon_id`. For more details on that, see our [documentation for properties sent to Facebook's tracking endpoints](https://github.com/tweaselORG/TrackHAR/issues/27#issuecomment-1693282982).

---

We have only observed this property on iOS, and found no references to it in the source code of the [Adjust SDK for Android](https://github.com/adjust/android_sdk).
