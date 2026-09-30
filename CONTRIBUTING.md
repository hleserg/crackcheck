# Contributing

Thanks for helping improve CrackCheck. The project is in early development; check open issues and the current implementation before starting a larger change.

## Development

The planned application is a static TypeScript/Vite frontend. Once the app manifest is present, use its declared Node.js version and package scripts:

```sh
npm install
npm run dev
```

Before opening a pull request, run the relevant checks exposed by `package.json` (for example, lint, type check, tests, and production build). Do not claim a check passed unless you ran it.

## Pull requests

- Keep changes focused and explain the user or maintenance problem they solve.
- Do not include passwords, leaked credential corpora, generated secret data, or personal data in code, fixtures, screenshots, or logs.
- For privacy-sensitive changes, describe what data is processed and whether any network request occurs.
- For dictionary or language data, document source, provenance, version, transformations, and license. Keep attribution and data notices with the data.
- Do not treat repository code licensing as permission to redistribute bundled datasets.
- Prefer changes useful to the wider `zxcvbn-ts` ecosystem upstream. Avoid creating a permanent private fork.
- Add or update tests for meaningful behavior and security properties.

## Russian language data

Russian UI translations and Russian password dictionaries are separate things. The project does not claim complete Russian dictionary coverage. Candidate name and surname sources with CC BY-SA terms require an explicit distribution decision and must not be silently shipped as MIT data. See [`docs/data-sources.md`](docs/data-sources.md) and the research notes in `RESEARCH.md`.

## Security reports

Do not disclose vulnerabilities publicly or include real passwords in reports. See [`SECURITY.md`](SECURITY.md) for the current reporting status.
