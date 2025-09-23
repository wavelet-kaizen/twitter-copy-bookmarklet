// Jest環境設定

// navigator.clipboardのモック
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
});

// fetchのモック  
global.fetch = jest.fn();

// DOMParserのモック
global.DOMParser = jest.fn().mockImplementation(() => ({
  parseFromString: jest.fn().mockReturnValue({
    getElementsByTagName: jest.fn().mockReturnValue([]),
  }),
}));

// windowオブジェクトのモック
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'twitter.com',
    pathname: '/user/status/1234567890',
  },
  writable: true,
});

// process.envのモック（ブックマークレット自動実行を防ぐ）
Object.defineProperty(process, 'env', {
  value: {
    ...process.env,
    NODE_ENV: 'test',
    TWITTER_COPY_AUTO_RUN: 'disabled',
  },
  writable: true,
});

// documentのモック拡張
Object.defineProperty(document, 'cookie', {
  value: 'ct0=test-csrf-token; gt=test-guest-token;',
  writable: true,
});

// webpackChunk のモック
Object.defineProperty(window, 'webpackChunk_twitter_responsive_web', {
  value: [
    [
      ['main.abc123'],
      {
        'test-module': {
          toString: () => 'Bearer AAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDDDD'
        }
      }
    ]
  ],
  writable: true,
});

// console.logのスパイ
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
