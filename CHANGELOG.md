# Changelog

Not released yet. This file will record user-visible changes beginning with the first release.

## Unreleased

- Initialize project documentation and repository metadata.
- Explain separators and reversed or l33t dictionary matches instead of labeling them unrecognized.
- Note in Wi‑Fi mode when a password is outside the WPA2-Personal passphrase format (8–63 printable ASCII characters).
- Fix text contrast in dark mode and localize accessible labels.
- Recognize ranked Russian words typed with the English layout and Russian adjectives ending in -ый.
- Open without a network after the first visit: a service worker caches the site's own static files.
- Explain with a short everyday story why one password on every site is dangerous, and suggest sign-in codes for email.
- Show two checks a visitor can do without trusting the site: enter a similar password instead of the real one, or use airplane mode and close the tab.
- Fix the password panel being cut off on the right on phones.
- Show a new version of the site on the next load instead of serving the cached page first.
- Open in Wi‑Fi mode, and show the site crack time both without and with brute-force protection.
- Explain in the FAQ why a leak of hashed passwords still matters and what hash databases are.
- Add a short plan for people who reuse a few passwords everywhere: built-in password manager, email first, then accounts with money, reset the rest on next sign-in.
- Answer common doubts in plain words: what if the manager is hacked or hands passwords to the authorities, a lost phone or forgotten main password, a paper notebook, "who would want me", sign-in codes, a phone in someone else's hands.
- Open in Russian by default, whatever the browser language; English is one click away.
- Show the password with an eye icon; remove the Clear button.
- Explain the result in plain words: how long guessing takes when a site limits attempts and when its password database leaks (in Wi‑Fi mode, a captured handshake on one GPU), why no honest probability exists, what each part of the password means and its frequency rank, and advice that depends on the score.
- Add a group on handing access to contractors safely (no passwords in email or group chats, shared vault, personal accounts, revoke afterwards).
- Retitle the main page and the breach check around "already cracked?", and warn in bold that a clean result covers public databases only.
- Generator shows crack times for the generated password itself; the checkboxes only change how it is generated.
- Explain the optional breach check in plain words: what the service is, what happens on click and what leaves the device.
- Add a collapsed chapter on attacks on companies and sole traders to the main page, including why the IT contractor who built the site can be the weakest point and why a one-off check by a separate security specialist is worth paying for.
- FAQ: in Yandex Browser, passwords are end-to-end encrypted only after you create a master password.
- FAQ: step-by-step instructions for turning on password encryption in Yandex Browser (master password with a reset key) and Google Password Manager (on-device encryption).
- Add a random password generator: length slider (8–40), digits and symbols checkboxes, copy button. It uses the browser's `crypto.getRandomValues` with rejection sampling, keeps nothing, and compares the guessing time of four character sets at the chosen length.
- Show crack times over a century in compact years (for example, "4 млрд лет") and cap them at "over a trillion years".
- Show four crack-time rows in order of danger (leaked database, no protection, basic, proper) and cite a 2018 study of login rate limiting.
- Move the three essential rules above the explanation and add a FAQ on saving the Wi‑Fi password in a password manager.
