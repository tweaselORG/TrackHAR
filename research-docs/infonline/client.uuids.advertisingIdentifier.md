The `client.uuids.advertisingIdentifier` property is the MD5 hash of the device's Google advertising ID or Apple IDFA, with any `0`s removed.

In our request database, we have observed the following values being transmitted for this property:

* `ead12c883812cadaf46f99793f2d824`
* `ab9930d110c818f66934e6d39e4e7`
* `7bbcc33bb8b6426f75a8fb06a5cbb83b`
* `53cc56dda0de1669b258c9edd23349`

These are the GAIDs and IDFAs of the corresponding test devices, as well as their MD5 hashes:

| Ad ID | MD5 hash of ad ID |
| --- | --- |
| `827d8162-0e1c-48cd-892e-4abd3df95ba8` | `ea0d12c883812cadaf46f99793f2d824` |
| `ea70edc1-ac05-481c-8d2a-66b1be496a7e` | `ab9930d1100c818f669304e60d39e4e7` |
| `fffe8a97-a504-4d14-89ab-c2025fbaf065` | `53cc56dda0de1669b2580c9edd233409` |
| `F04C6D92-D4FA-4CA4-AC62-DE94C8C2DAE7` | `7bbcc33bb8b6426f75a8fb06a5cbb83b` |
