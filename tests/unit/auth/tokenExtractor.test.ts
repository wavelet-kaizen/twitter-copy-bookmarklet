import { TokenExtractor } from '@/auth/tokenExtractor';

describe('TokenExtractor', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'cookie', {
      value: 'ct0=test-csrf; gt=test-guest; twid=test-twitter-id',
      writable: true,
    });

    const mockScript = document.createElement('script');
    mockScript.src = 'https://twitter.com/main.abc123.js';
    document.head.appendChild(mockScript);

    delete (window as any).webpackChunk_twitter_responsive_web;
  });

  afterEach(() => {
    document.head.innerHTML = '';
    delete (window as any).webpackChunk_twitter_responsive_web;
  });

  describe('extractTokensFromCookies', () => {
    it('Cookieから正しくトークンを抽出する', () => {
      const tokens = TokenExtractor.extractTokensFromCookies();

      expect(tokens.csrfToken).toBe('test-csrf');
      expect(tokens.guestToken).toBe('test-guest');
      expect(tokens.twitterId).toBe('test-twitter-id');
    });

    it('存在しないCookieの場合はundefinedを返す', () => {
      Object.defineProperty(document, 'cookie', {
        value: '',
        writable: true,
      });

      const tokens = TokenExtractor.extractTokensFromCookies();

      expect(tokens.csrfToken).toBeUndefined();
      expect(tokens.guestToken).toBeUndefined();
      expect(tokens.twitterId).toBeUndefined();
    });
  });

  describe('extractBearerToken', () => {
    it('webpackモジュールからBearerトークンを抽出する', () => {
      (window as any).webpackChunk_twitter_responsive_web = [
        [
          ['main.abc123'],
          {
            'module-with-bearer': {
              toString: () => 'const token = "Bearer AAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDDDD"; export default token;'
            }
          }
        ]
      ];

      const token = TokenExtractor.extractBearerToken();

      expect(token).toBe('Bearer AAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDDDD');
    });

    it('Bearerトークンが見つからない場合は空文字を返す', () => {
      (window as any).webpackChunk_twitter_responsive_web = [
        [
          ['other.module'],
          {
            'no-bearer-module': {
              toString: () => 'const someVar = "no bearer token here";'
            }
          }
        ]
      ];

      const token = TokenExtractor.extractBearerToken();

      expect(token).toBe('');
    });
  });

  describe('extractTweetId', () => {
    it('URLからツイートIDを正しく抽出する', () => {
      const mockLocation = {
        pathname: '/elonmusk/status/1234567890123456789',
      } as Location;

      const tweetId = TokenExtractor.extractTweetId(mockLocation);

      expect(tweetId).toBe('1234567890123456789');
    });

    it('ツイートURLでない場合はnullを返す', () => {
      const mockLocation = {
        pathname: '/elonmusk/followers',
      } as Location;

      const tweetId = TokenExtractor.extractTweetId(mockLocation);

      expect(tweetId).toBeNull();
    });

    it('現在のlocationからツイートIDを取得する', () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/twitter/status/9876543210',
        },
        writable: true,
      });

      const tweetId = TokenExtractor.extractTweetId();

      expect(tweetId).toBe('9876543210');
    });
  });

  describe('getScriptURL', () => {
    it('指定されたパターンのスクリプトURLを取得する', () => {
      const url = TokenExtractor.getScriptURL('/main');

      expect(url).toBe('https://twitter.com/main.abc123.js');
    });

    it('該当するスクリプトが見つからない場合は空文字を返す', () => {
      const url = TokenExtractor.getScriptURL('/nonexistent');

      expect(url).toBe('');
    });
  });

  describe('extractEmojiRegexp', () => {
    it('絵文字の正規表現を抽出する', () => {
      (window as any).webpackChunk_twitter_responsive_web = [
        [
          ['vendor.def456'],
          {
            'emoji-module': {
              toString: () => 'some code with ud83d and pattern /(?:\\ud83d[\\udc00-\\udfff])/g more content'
            }
          }
        ]
      ];

      const regexp = TokenExtractor.extractEmojiRegexp();

      expect(regexp).toBeInstanceOf(RegExp);
      expect(regexp.global).toBe(true);
    });
  });

  describe('extractAudioSpaceQueryId', () => {
    beforeEach(() => {
      (window as any).webpackChunk_twitter_responsive_web = [];
    });

    it('modules.audio チャンクから queryId を取得する', () => {
      const queryId = 'rC2zlE1t7SHbVG8obPZliQ';
      (window as any).webpackChunk_twitter_responsive_web.push([
        ['modules.audio.something'],
        {
          abc123: `some code queryId:"${queryId}",operationName:"AudioSpaceById";`
        }
      ]);

      expect(TokenExtractor.extractAudioSpaceQueryId()).toBe(queryId);
    });

    it('modules.audio が無い場合でも AudioSpaceById を含むチャンクから取得する', () => {
      const queryId = 'fallbackAudioSpaceId';
      (window as any).webpackChunk_twitter_responsive_web.push([
        ['vendors~timeline~init'],
        {
          def456: `some code queryId:"${queryId}",operationName:"AudioSpaceById"`
        }
      ]);

      expect(TokenExtractor.extractAudioSpaceQueryId()).toBe(queryId);
    });
  });
});
