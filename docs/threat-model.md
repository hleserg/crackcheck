# Threat model

This document records the intended privacy and safety boundaries for CrackCheck. It is not a penetration test or an audit of a hosted build.

## Assets

- The password the user types.
- The user's awareness of whether a network request is made.
- The integrity of the static application and its dependencies.

## Intended protection

During ordinary analysis, the password should remain in the browser's transient UI state and estimator call. Local analysis should not send requests, use persistent browser storage, or put the password in a URL, logs, analytics, or error reporting. HIBP is a distinct opt-in request; only a locally calculated SHA-1 prefix should be sent.

## Threats considered

- A product implementation accidentally transmits the password while typing or analyzing it.
- A password is persisted by app code in localStorage, IndexedDB, cookies, or a service-worker cache.
- The optional breach check is mistaken for local-only analysis or sends the full password/hash.
- A misleading estimate causes a user to believe a password is guaranteed safe or has a precise cracking time.
- Dictionary updates introduce data with unclear provenance or incompatible redistribution terms.
- Untrusted text is inserted into the page as HTML rather than rendered as text.

## Known limitations

GitHub Pages does not let the project set HTTP response headers, and a `<meta>` Content-Security-Policy cannot carry `frame-ancestors`. Another site can therefore embed CrackCheck in a frame. The framing page cannot read the password field across origins, but it could overlay misleading UI. The site has no accounts or state-changing actions, so the remaining risk is deception rather than data access. Moving to a host that sets `Content-Security-Policy: frame-ancestors 'none'` would close it.

A service worker keeps the built files for offline opening. If a modified build were ever deployed, returning visitors would keep it until the next deploy replaced it, and a visitor who stays offline keeps the last copy they loaded. The worker handles only same-origin GET requests, and its cache name hashes the built files, so each deploy replaces the old cache on the next visit.

## Out of scope

CrackCheck cannot protect against malware, a compromised device or browser, hostile extensions, a modified source/build, clipboard managers, shoulder surfing, or someone with access to developer tools. A static host and network providers can see ordinary web request metadata. HIBP receives the five-character hash prefix and network metadata when the user requests a check.

The Wi‑Fi mode is educational. It does not capture traffic, obtain WPA2 authentication material, deauthenticate clients, launch cracking tools, automate attacks, or interact with networks.

## Security checks to maintain

Changes to the password flow should be reviewed for network calls, storage, URL/history effects, and DOM rendering. Automated checks should cover that local analysis makes no requests, passwords do not enter persistent storage or URLs, and user text is rendered safely. HIBP tests should verify the opt-in boundary and that only the five-character prefix is sent.

See [`SECURITY.md`](../SECURITY.md) for reporting guidance and [privacy model](privacy.md) for the user-facing data flow.
