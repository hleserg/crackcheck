# Privacy model

CrackCheck is a local-first static application. Its core flow evaluates a password in the browser with `zxcvbn-ts`; it does not need a CrackCheck server. The password must not be placed in a URL, analytics, logs, telemetry, or persistent browser storage.

This document describes intended behavior. Verify the implementation and deployed build before relying on it: source code and a static architecture alone do not prove that a particular deployment is safe.

## Local analysis

- The password is held only as long as needed for the visible analysis state.
- It must not be written to `localStorage`, IndexedDB, cookies, or service-worker caches.
- The local-only flow must not issue network requests as a side effect of typing or evaluating the password.
- Application assets may be served by a static host. No backend is required for password analysis.

## Optional HIBP check

If enabled, HIBP checking is a separate action that requires an explicit user choice. The Pwned Passwords range protocol is intended to work as follows:

1. Compute the SHA-1 digest in the browser.
2. Send only the first five hexadecimal characters of the digest to the range endpoint.
3. Compare the returned suffixes locally; do not send the complete digest or original password.

The service sees the prefix request and network metadata such as the request's IP address. A five-character prefix is a privacy measure, not anonymity. Users must be told that the feature contacts a third party and must be able to use local analysis without it.

## Limits

Browser extensions, malware, a compromised operating system, modified builds, and browser developer tools are outside CrackCheck's control. A static site host can serve application files and receive ordinary web request metadata even though the password analysis itself is local.
