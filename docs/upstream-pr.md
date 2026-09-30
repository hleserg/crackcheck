# Draft upstream PR: Russian JCUKEN keyboard graph

Target: `zxcvbn-ts/zxcvbn` `master`  
Source: [`hleserg/zxcvbn:codex/russian-keyboard-graph`](https://github.com/hleserg/zxcvbn/tree/codex/russian-keyboard-graph)  
Status: opened as [upstream PR #345](https://github.com/zxcvbn-ts/zxcvbn/pull/345); CI awaits maintainer approval for fork workflows.

## Title

`feat(language-common): add Russian keyboard graph`

## Body

Adds the standard Russian JCUKEN adjacency graph to `@zxcvbn-ts/language-common` using the existing keyboard graph generator. The layout follows `ru(common)` in `xkeyboard-config` `symbols/ru`; it does not mix in `winkeys`, typewriter, or phonetic variants. This lets the spatial matcher identify common keyboard walks such as `фыва`, `йцукен`, and `ячсм`.

The patch also documents how the existing Russian language package can use the graph. It changes no dictionaries or licensed word data.

Validation:

- Regenerated `packages/languages/common/src/adjacencyGraphs.json` with the upstream `KeyboardAdjacencyGraph` generator.
- Built `@zxcvbn-ts/language-common`.
- Ran the targeted spatial matcher suite: 127 tests passed.
- Ran ESLint on the changed TypeScript files.

Follow-up work on the Russian package's OpenSubtitles attribution NOTICE and unpinned FakerJS source revision is tracked separately; it is outside this keyboard-only patch.
