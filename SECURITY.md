# Security policy

## Scope

CrackCheck is intended to analyze a password locally in a static browser app. The main analysis should not send the password to a CrackCheck backend. The optional Have I Been Pwned (HIBP) feature is a separate, user-initiated network request and must be clearly described before use.

Please report vulnerabilities in the application, build or release process, dependencies, or privacy behavior. Do not include real passwords, hashes derived from real passwords, or other secrets in a report, issue, screenshot, or reproduction.

## Reporting

There is no verified private security contact configured for this repository yet. Until one is published, do not post sensitive exploit details publicly. Open a minimal issue asking maintainers to establish a private reporting channel, without including exploit steps or user data. For non-sensitive bugs, use the normal issue tracker.

When a private contact is added, this section should be updated with its verified address or reporting mechanism.

## User guidance

- Do not test a password that you cannot afford to disclose.
- Local analysis is intended to stay in the browser, but browser extensions, compromised devices, developer tools, and modified builds are outside the app's control.
- HIBP checking contacts a third-party service. The range protocol sends a five-character SHA-1 prefix, which can reveal some information; it is not equivalent to a fully offline check.
- CrackCheck estimates guessability. It does not certify that a password is safe or predict a guaranteed cracking time.

## Supported versions

There are no versioned releases yet. The site at https://hleserg.github.io/crackcheck/ is deployed continuously from the default branch, and security fixes are made there. Support for older builds is not promised until a release policy is established.
