import { TwitterCopyBookmarklet, NgLevel } from '../core/twitterCopy';
import { LoadingManager } from '../ui/loadingManager';

declare const GM_setClipboard: ((text: string, type?: string) => void) | undefined;
declare const GM_registerMenuCommand: ((name: string, callback: () => void | Promise<void>) => void) | undefined;
declare const unsafeWindow: Window | undefined;

declare global {
  interface Window {
    TwitterCopyTampermonkey?: {
      run: () => Promise<string>;
    };
  }
}

export async function bootstrapTampermonkey(ngLevel: NgLevel = getBuildNgLevel()): Promise<string> {
  const pageWindow = getPageWindow();
  if (!isStatusLocation(pageWindow.location)) {
    throw new Error('Tweet ID not found in URL');
  }

  LoadingManager.startLoading();

  try {
    const bookmarklet = new TwitterCopyBookmarklet(ngLevel, {
      pageWindow,
      writeClipboard,
    });
    return await bookmarklet.copyTweet();
  } catch (error) {
    LoadingManager.stopLoading();
    throw error;
  }
}

function getPageWindow(): Window {
  return typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
}

function isStatusLocation(locationRef: Location): boolean {
  return /status\/\d+/.test(locationRef.pathname);
}

function writeClipboard(text: string): Promise<void> {
  if (typeof GM_setClipboard === 'function') {
    GM_setClipboard(text, 'text');
    return Promise.resolve();
  }

  return navigator.clipboard.writeText(text);
}

function getBuildNgLevel(): NgLevel {
  const rawLevel = process.env.NG_LEVEL ? parseInt(process.env.NG_LEVEL, 10) : 0;
  return [0, 1, 2, 3].includes(rawLevel) ? rawLevel as NgLevel : 0;
}

function shouldRegisterTampermonkey(): boolean {
  const nodeEnv = typeof process !== 'undefined' && process.env ? process.env.NODE_ENV : undefined;
  if (nodeEnv === 'test') {
    return process.env.TWITTER_COPY_AUTO_RUN === 'enabled';
  }
  return true;
}

function registerTampermonkeyCommand(): void {
  const run = (): Promise<string> => bootstrapTampermonkey();
  window.TwitterCopyTampermonkey = { run };

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('このポストをコピー', () => {
      void run().catch(console.error);
    });
  }
}

if (typeof window !== 'undefined' && shouldRegisterTampermonkey()) {
  registerTampermonkeyCommand();
}
