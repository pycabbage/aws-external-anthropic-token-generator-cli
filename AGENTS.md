# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> This file is the canonical source: `CLAUDE.md` is a git-tracked symlink to `AGENTS.md` (also read by other agent tools). Edit `AGENTS.md` — never replace the symlink — so both stay in sync.

## What this is

A single-purpose CLI that prints a short-lived bearer **token for AWS-external Anthropic access** to stdout. All token logic lives in the `@aws/token-generator-for-aws-external-anthropic` package; `src/index.ts` is a ~30-line shim that:

1. parses one flag, `--profile`/`-p` (an AWS profile name),
2. calls `getTokenProvider({ profile })()` and writes the token to `Bun.stdout`,
3. on any error writes the message to `Bun.stderr` and exits `1`.

It is meant to be consumed programmatically — another process captures its stdout as the token — so **stdout must contain only the token**. Never print logs or banners to stdout; diagnostics go to stderr.

## Runtime

Bun-only, pinned to `bun@1.3.14` via `packageManager`. Use `bun`/`bunx`, not `node`/`npm`/`npx`. Prefer Bun built-ins (`Bun.argv`, `Bun.stdout`/`Bun.stderr`, `Bun.file`, `Bun.build`, `Bun.$`) over `node:` equivalents. Bun auto-loads `.env` — don't add `dotenv`.

`@aws/token-generator-for-aws-external-anthropic` is a **devDependency, not a dependency** — intentional: the app ships as a compiled standalone binary that bundles the package in, so there is no runtime npm dependency to declare.

## Commands

```bash
bun install                          # install deps
bun run src/index.ts                 # run locally (default AWS profile)
bun run src/index.ts -p myprofile    # run with a named AWS profile (--profile)

bun lint                             # biome check — lint + format + import-organize (CI gate)
bunx biome check --write             # apply lint/format fixes

bun run scripts/build.ts             # compile a standalone binary for the current platform
bun run scripts/build.ts -o ./bin -t bun-linux-x64   # custom output (-o) / target (-t)
```

No test script or test files exist yet. Tests use Bun's built-in runner: add `*.test.ts`, run `bun test`; a single file with `bun test path/to/file.test.ts`, a single case with `bun test -t "<name pattern>"`.

## Build & release pipeline

- `scripts/build.ts` wraps `Bun.build({ compile })` and branches on `process.env.CI`:
  - **Local:** builds one binary for the current `bun-<platform>-<arch>`, honoring `-o`/`-t` (defaults: `build/aws-external-anthropic-token-generator-cli`, current platform).
  - **CI:** ignores the flags and cross-compiles the full matrix — `{darwin,linux,windows} × {x64,arm64,aarch64}` — into `build/`, printing a JSON result summary.
- `.github/workflows/build.yml`: on push to `main` and `v*` tags → `bun install` → `bun lint` → build → upload the `build/` artifact. A second job runs **only on `v*` tags**, downloads the artifact, and publishes a GitHub Release with every binary attached. **Tagging `vX.Y.Z` is what cuts a release.**

## Conventions

- Biome (config in `biome.json`) enforces: 2-space indent, double quotes, semicolons **as-needed** (omit unless required), ES5 trailing commas, auto-organized imports. `useNodejsImportProtocol` is off, so unprefixed imports like `from "util"` are intentional — keep them.
- `tsconfig.json` is strict, including `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `verbatimModuleSyntax` (use `import type` for type-only imports).
- A Husky `pre-commit` hook runs `lint-staged` (`bun lint` on staged `.ts/.tsx/.js/.jsx/.json`). Keep commits lint-clean rather than bypassing it.
