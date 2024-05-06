The `appInstanceIdToken` property and `X-Goog-Firebase-Installations-Auth` header contain a JWT token that is used to identify and authenticate the user.

The token at least contains the [Firebase Installation ID](https://firebase.google.com/docs/projects/manage-installations) (FID), which uniquely identifies an installation of an app on a device.

### Example

[Token](https://data.tweasel.org/data/requests/monkey-april-2024,2629):

```
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjE6MTA2NTQ3MzU5ODYyNDphbmRyb2lkOmQ3ODIwNzU2YzVjODA4ZGIwM2Q1YzUiLCJleHAiOjE3MTUwMDY3MDAsImZpZCI6ImVkeElubzhmVGY2WDR5X0s1WjYxNVAiLCJwcm9qZWN0TnVtYmVyIjoxMDY1NDczNTk4NjI0fQ.AB2LPV8wRAIgKWmNcG6EyL96sJbjdrK4fqE2IYusPUVw-cvxvQPfAOQCIBUOMpAbN88ZsfNHvUurgwOv7w8u1zT-7t4_mx_Wp8kN
```

[Decoded](https://cyberchef.bn.al/#recipe=JWT_Decode()&input=ZXlKaGJHY2lPaUpGVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhjSEJKWkNJNklqRTZNVEEyTlRRM016VTVPRFl5TkRwaGJtUnliMmxrT21RM09ESXdOelUyWXpWak9EQTRaR0l3TTJRMVl6VWlMQ0psZUhBaU9qRTNNVFV3TURZM01EQXNJbVpwWkNJNkltVmtlRWx1YnpobVZHWTJXRFI1WDBzMVdqWXhOVkFpTENKd2NtOXFaV04wVG5WdFltVnlJam94TURZMU5EY3pOVGs0TmpJMGZRLkFCMkxQVjh3UkFJZ0tXbU5jRzZFeUw5NnNKYmpkcks0ZnFFMklZdXNQVVZ3LWN2eHZRUGZBT1FDSUJVT01wQWJOODhac2ZOSHZVdXJnd092N3c4dTF6VC03dDRfbXhfV3A4a04):

```json
{
    "appId": "1:1065473598624:android:d7820756c5c808db03d5c5",
    "exp": 1715006700,
    "fid": "edxIno8fTf6X4y_K5Z615P",
    "projectNumber": 1065473598624
}
```
