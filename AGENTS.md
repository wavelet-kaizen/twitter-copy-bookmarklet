# Repository Guidelines
必ず日本語で回答してください。

## Claude Code 連携ガイド

### 目的

ユーザーが 「Claude Codeと相談しながら進めて」 （または類似表現）と指示した場合、
Codex は Claude Code を随時呼び出しながら、複数ターンにわたる協業を行う。

### トリガー
• 正規表現: /Claude.*相談しながら/
• 一度トリガーした後は、ユーザーが明示的に終了を指示するまで 協業モード を維持する。

### 協業ワークフロー (ループ可)

1 PROMPT 準備 最新のユーザー要件(ユーザから提示された解析用データ、参照ファイルパス等はかならず渡すこと) + これまでの議論要約を $PROMPT に格納
2 Claude Code 呼び出し  bash\nclaude <<EOF\n$PROMPT\nEOF\n必要に応じ --max_tokens 等を追加
3 出力貼り付け  Claude Code ➜ セクションに全文、長い場合は要約＋原文リンク
4 Codex コメント  Codex ➜ セクションで Claude Code の提案を分析・統合し、次アクションを提示
5 継続判定  ユーザー入力 or プラン継続で 1〜4 を繰り返す。「Codexコラボ終了」「ひとまずOK」等で通常モード復帰

形式テンプレート

**Claude Code ➜**
<Claude Code からの応答>
**Codex ➜**
<統合コメント & 次アクション>

## Project Structure & Module Organization
- `src/` holds all TypeScript sources. Key submodules: `api/`, `auth/`, `config/`, `parsers/`, `processors/`, `types/`, and `ui/`. Entry point: `src/main.ts`.
- `tests/` contains Jest suites split into `unit/`, `integration/`, plus shared setup in `tests/setup.ts`.
- Build outputs land in `dist/` for dev and `min/` for production bookmarklets (`twitter_copy.<level>.min.js`). Do not edit the generated bundles directly.
- Legacy reference: `twitter_copy.js` (read-only).

## Build, Test, and Development Commands
- `npm run dev` — Webpack watch build, writes to `dist/`.
- `npm run build` — Production bundle to `min/`.
- `npm run build:level0|1|2|3` or `npm run build:all-levels` — Generates bookmarklets per NG level (uses `NG_LEVEL` env var).
- `npm test` / `npm run test:coverage` — Execute Jest suites, optional coverage in `coverage/`.
- `npm run lint` / `npm run lint:fix` — ESLint check or auto-fix.
- `npm run type-check` — TypeScript type validation.

## Coding Style & Naming Conventions
- Language: TypeScript (Node ≥18). Use 2 spaces, single quotes, semicolons, and `const`/`let` (no `var`).
- Prefer path alias `@/` for imports from `src/` (`import Parser from '@/parsers/tweetParser';`).
- Keep files camelCase; classes PascalCase; functions/variables camelCase.
- Apply ESLint (see `eslint.config.js`) and respect `@typescript-eslint` rules before committing.
- Write and review code so that `npm run lint` passes without errors or warnings; resolve findings instead of suppressing them.

## Testing Guidelines
- Test runner: Jest via `ts-jest` with `jsdom`.
- Place specs under `tests/` or co-located with `.test.ts` / `.spec.ts` suffixes.
- Aim to cover parsers/processors; generate coverage with `npm run test:coverage`.
- Update `tests/setup.ts` if global mocks or environment tweaks are required.

## Commit & Pull Request Guidelines
- Commit messages are short Japanese summaries (e.g., `不具合修正: x.comリダイレクト対応`). Group related changes.
- Before opening a PR: ensure `npm run lint`, `npm run type-check`, and `npm test` succeed. Include what/why, affected NG levels, and manual verification notes (UI changes should cite checked tweet URLs or scenarios).

## Security & Configuration Tips
- Never commit secrets. Bookmarklet tokens derive at runtime.
- Use NG level scripts (`npm run build:level*`) instead of hard-coding level flags.
- `npm run clean` removes `dist/` and `coverage/`; run before rebuilding if outputs look stale.
- Generated assets (`dist/`, `min/`) stay untracked; rely on build scripts for updates.
