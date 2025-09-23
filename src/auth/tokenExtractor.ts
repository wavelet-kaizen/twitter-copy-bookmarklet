import { TwitterTokens } from '../types';

type WebpackModuleMap = Record<string, unknown>;
type WebpackChunkEntry = [string[], WebpackModuleMap];

declare global {
  interface Window {
    webpackChunk_twitter_responsive_web?: unknown[];
  }
}

export class TokenExtractor {
  /**
   * CookieからTwitterの認証トークンを取得
   */
  static extractTokensFromCookies(): Partial<TwitterTokens> {
    const tokens: Partial<TwitterTokens> = {};
    
    const csrfToken = this.getTokenFromCookie('ct0');
    const guestToken = this.getTokenFromCookie('gt');
    const twitterId = this.getTokenFromCookie('twid');
    
    if (csrfToken) tokens.csrfToken = csrfToken;
    if (guestToken) tokens.guestToken = guestToken;
    if (twitterId) tokens.twitterId = twitterId;
    
    return tokens;
  }

  /**
   * TwitterのJavaScriptバンドルからBearerトークンを抽出
   */
  static extractBearerToken(): string {
    try {
      return this.getModuleParameter(
        'main',
        'Bearer A',
        /[" ](Bearer AAAAAA[^"]+)"/
      );
    } catch (error) {
      console.error('Bearer token extraction failed:', error);
      return '';
    }
  }

  /**
   * 絵文字の正規表現パターンを抽出
   */
  static extractEmojiRegexp(): RegExp {
    try {
      const modulePattern = /\/(\(\?:\\ud83d[^/]+)\/g/;
      const pattern = this.getModuleParameter(
        'vendor',
        'ud83d',
        modulePattern
      );
      return new RegExp(pattern || '', 'g');
    } catch (error) {
      console.error('Emoji regexp extraction failed:', error);
      return /(?:)/g;
    }
  }

  /**
   * 現在のツイートIDをURLから抽出
   */
  static extractTweetId(url: Location = location): string | null {
    // X(Twitter) では `/username/status/` の他に `/i/web/status/` のように複数階層を挟むケースがある
    // ため、パスのどこに現れても `status/<数字>` を検出できるようにしておく。
    const match = url.pathname.match(/status\/(\d+)/);
    return match?.[1] || null;
  }

  /**
   * スクリプトURLの取得
   */
  static getScriptURL(scriptPattern: string): string {
    const regex = new RegExp(`${scriptPattern}\\.[\\w-]*\\.js`);
    const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script'));
    const targetScript = scripts.find(script => regex.test(script.src));
    return targetScript?.src || '';
  }

  private static getTokenFromCookie(name: string): string | undefined {
    const match = document.cookie.match(new RegExp(`${name}=([^;]*);?`));
    return match?.[1];
  }

  private static getModuleParameter(
    moduleName: string,
    key: string | RegExp,
    parameter: RegExp
  ): string {
    try {
      const rawChunks = window.webpackChunk_twitter_responsive_web as unknown[] | undefined;
      const candidateModules: WebpackChunkEntry[] = (rawChunks ?? []).filter((chunk): chunk is WebpackChunkEntry => {
        if (!Array.isArray(chunk) || chunk.length < 2) {
          return false;
        }

        const [rawIds, moduleMap] = chunk as [unknown, unknown];
        if (!Array.isArray(rawIds) || typeof moduleMap !== 'object' || moduleMap === null) {
          return false;
        }

        const moduleIds = rawIds.filter((id): id is string => typeof id === 'string');
        return moduleIds.some(id => id.startsWith(moduleName));
      });

      for (const [, moduleMap] of candidateModules) {
        const entries = Object.entries(moduleMap);
        const targetEntry = entries.find(([, exportValue]) => {
          const content = String(exportValue ?? '');
          return key instanceof RegExp ? key.test(content) : content.includes(key as string);
        });

        if (targetEntry) {
          const [, exportValue] = targetEntry;
          const matchedData = String(exportValue ?? '').match(parameter);
          if (matchedData?.[1]) {
            return matchedData[1];
          }
        }
      }
      
      return '';
    } catch (error) {
      console.error('Module parameter extraction failed:', error);
      return '';
    }
  }

  /**
   * AudioSpace用のQueryIdを抽出
   */
  static extractAudioSpaceQueryId(): string {
    return this.getModuleParameter(
      'modules.audio',
      /AudioSpaceById/,
      /queryId:"([^"]+)"/
    );
  }
}
