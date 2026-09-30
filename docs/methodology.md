# Methodology

CrackCheck uses the `zxcvbn-ts` password estimator. It tries to explain a password as a sequence of recognizable patterns and estimates how many guesses a modeled attacker would need under its dictionaries and transformations.

## What the result means

- **Score (0–4):** a broad category from the estimator, shown with explanatory text. It is not a probability that an account will be compromised.
- **Estimated guesses:** an output of the estimator's guessing model for its selected sequence of patterns. It is useful for comparing recognizable constructions; it is not a measured cracking benchmark.
- **Patterns:** segments recognized as dictionary entries, keyboard paths, dates, repetitions, sequences, years, or word sequences, when those matchers identify them.

The model can miss patterns, and dictionary quality affects its estimates. An unrecognized segment is not proof of randomness or safety. A result is not a security certification.

## Why CrackCheck does not promise a time

Converting guesses into elapsed time requires assumptions about the target verifier, password hashing or key derivation function, hardware, parallelism, attacker knowledge, and guessing strategy. CrackCheck does not establish those conditions. Treat guesses as the primary estimate; any time scenario would need to state its attacker model explicitly.

## Wi‑Fi scenario

The Wi‑Fi / WPA2-Personal view gives context: with suitable authentication material, password guesses can be checked offline. The app still estimates a human-chosen passphrase with `zxcvbn-ts`; it does not simulate WPA2 key derivation, benchmark hardware, capture authentication material, or attack a network. Its output is not a WPA2 cracking-time prediction.

## Russian language behavior

The app imports translations and dictionary data from the official `@zxcvbn-ts/language-ru@4.1.0` package. Its major dictionaries are in Latin transliteration, so direct matching does not identify raw Cyrillic words such as `пароль` or `привет`. For a password containing Cyrillic text, CrackCheck analyzes a transliterated candidate only when every Cyrillic run has at least four letters and exactly matches an entry in the ranked `commonWords-ru` list. It uses the candidate only when zxcvbn-ts estimates fewer guesses than the direct result. This heuristic can miss valid patterns and does not preserve exact character-to-character segment mapping in the UI.

The JCUKEN adjacency graph at `src/russianGraph.json` was generated from upstream `zxcvbn-ts/zxcvbn` commit `5782aa3`. It is integrated in CrackCheck, not shipped by the published `language-ru` npm package. The upstream Russian name lists come from FakerJS Russian locale files, but are not population-ranked and the source revision is not pinned; see [data sources](data-sources.md).

## HIBP is separate

The estimator does not require network access. The optional HIBP check is a separate user action that uses the Pwned Passwords k-anonymity range endpoint. A positive result means HIBP reports that hash suffix; no result does not prove the password is safe or absent from every breach.

The FakerJS Russian first-name and surname lists have no verified frequency order. CrackCheck uses them to label a dictionary match as a name or surname; they do not contribute ranks to the estimator. The optional Wikipedia-derived lists are excluded pending a source and license audit.
