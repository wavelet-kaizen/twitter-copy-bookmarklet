# CLAUDE.md
必ず日本語で回答してください。

## Codex 連携ガイド

### 目的
Codex から **Claude Code** が呼び出された際に、
Claude Code は Codex との対話コンテキストを保ちながら、複数ターンに渡り協働する。

---

### Codex の使い方
- ターミナルで以下を実行すると Codex と対話できる。
```bash
codex <<EOF
<質問・依頼内容>
EOF

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript version of a JavaScript bookmarklet that extracts Twitter/X post content and copies it to the clipboard with various formatting options. The project has been refactored from a single-file JavaScript bookmarklet into a modular TypeScript application with proper testing, build pipeline, and development tooling.

## Development Commands

### Core Development Commands
```bash
# Install dependencies
npm ci

# Development builds
npm run dev                  # Development build with watching
npm run build:dev            # Single development build

# Production builds
npm run build                 # Standard production build
npm run build:all-levels     # Build all NG avoidance levels (0-3)
npm run build:level0         # Build specific NG level (also level1, level2, level3)

# Testing
npm test                     # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix            # Fix auto-fixable ESLint issues
npm run type-check          # TypeScript type checking

# Cleanup
npm run clean               # Remove dist and coverage directories
```

### Single Test Execution
```bash
# Run specific test file
npm test -- src/path/to/test.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="token extraction"
```

## Architecture Overview

This TypeScript application follows a modular architecture with clear separation of concerns:

```
src/
├── main.ts                    # Entry point - TwitterCopyBookmarklet class
├── types/index.ts            # TypeScript interfaces and types
├── config/settings.ts        # NG avoidance settings and configuration
├── auth/tokenExtractor.ts    # Authentication token extraction
├── api/twitterApi.ts         # Twitter GraphQL API communication
├── parsers/tweetParser.ts    # Tweet data parsing and extraction
├── processors/
│   ├── textProcessor.ts      # Text formatting and processing
│   └── urlProcessor.ts       # URL processing and NG avoidance
└── ui/loadingManager.ts      # Loading animation UI management
```

### Core Components

**TwitterCopyBookmarklet (main.ts)**
- Entry point class that orchestrates all components
- Handles initialization with NG avoidance level (0-3)
- Manages the complete tweet extraction and clipboard copying workflow

**Authentication System (auth/)**
- Extracts Bearer tokens from Twitter's JavaScript bundles
- Handles CSRF tokens (`ct0`) and guest tokens (`gt`) from cookies
- Supports both authenticated and guest sessions

**Twitter API Integration (api/)**
- Communicates with Twitter's internal GraphQL `TweetDetail` endpoint
- Dynamically extracts query IDs and features from Twitter's bundles
- Handles API response parsing and error management

**Data Processing Pipeline**
1. **TweetParser**: Extracts structured data from GraphQL responses
2. **TextProcessor**: Handles Unicode normalization, emoji conversion, and text formatting
3. **UrlProcessor**: Applies NG avoidance transformations to URLs and media links

### NG Avoidance System

The system supports 4 levels of content filtering for forum compatibility:
- **Level 0**: No filtering (default)
- **Level 1**: URL redirects via Google, word replacements
- **Level 2**: Level 1 + h抜き (remove http from URLs)
- **Level 3**: Level 1 + cdn.ampproject.org image proxying

### Build System

Uses Webpack with environment-based configuration:
- TypeScript compilation via ts-loader
- Separate builds for each NG avoidance level
- Minification for production builds
- Output to `min/` directory for production, `dist/` for development

### Testing Strategy

Comprehensive test suite using Jest with JSDOM:
- **Unit Tests**: Individual component testing with mocking
- **Integration Tests**: Full workflow testing with mock Twitter responses
- **Coverage Target**: 70%+ statement coverage
- **Test Categories**: Authentication, parsing, text processing, URL processing

## Key Implementation Details

### Token Extraction Strategy
- Dynamically parses Twitter's bundled JavaScript to extract Bearer tokens
- Falls back gracefully between different extraction methods
- Handles both new and legacy Twitter bundle structures

### GraphQL API Integration
- Uses Twitter's internal `TweetDetail` query with dynamically extracted query IDs
- Handles complex nested response structures for tweets, retweets, quotes, and spaces
- Supports long-form tweets via `note_tweet` data structures

### Text Processing Pipeline
- Unicode normalization for mathematical symbols and special characters
- Selective emoji-to-text conversion for better forum compatibility
- Kaomoji (Japanese emoticon) detection and handling
- Surrogate pair cleanup for Twitter-specific formatting

## Development Notes

### Common Maintenance Tasks
- Update Bearer token extraction when Twitter changes bundle structure
- Adjust GraphQL query parameters for API changes
- Update domain handling for x.com redirects
- Maintain compatibility with different tweet types (polls, spaces, cards)

### Testing Approach
Manual testing workflow:
1. Create bookmarklet from built code
2. Test on various Twitter/X post types (text, media, polls, spaces, quotes)
3. Verify different NG avoidance levels
4. Check mobile vs desktop compatibility

### Bookmarklet Deployment
The built files in `min/` directory are ready-to-use bookmarklets:
- `twitter_copy.0.min.js` through `twitter_copy.3.min.js` for different NG avoidance levels
- Copy the entire file content and paste as bookmark URL with `javascript:` prefix

### Type Safety
Project uses strict TypeScript configuration with:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noUnusedLocals: true`
- Complete type coverage for Twitter API responses