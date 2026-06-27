import { TwitterCopyBookmarklet, NgLevel } from '../core/twitterCopy';
import { LoadingManager } from '../ui/loadingManager';

export function bootstrapBookmarklet(ngLevel: NgLevel): Promise<string> {
  LoadingManager.startLoading();

  const bookmarklet = new TwitterCopyBookmarklet(ngLevel);
  const copyPromise = bookmarklet.copyTweet();
  copyPromise.catch(console.error);
  return copyPromise;
}

const nodeEnv = typeof process !== 'undefined' && process.env ? process.env.NODE_ENV : undefined;
const autoRunPreference = typeof process !== 'undefined' && process.env ? process.env.TWITTER_COPY_AUTO_RUN : undefined;

function shouldAutoRunBookmarklet(): boolean {
  if (autoRunPreference === 'disabled') return false;
  if (nodeEnv === 'test') {
    return autoRunPreference === 'enabled';
  }
  return true;
}

function getBuildNgLevel(): NgLevel {
  const rawLevel = process.env.NG_LEVEL ? parseInt(process.env.NG_LEVEL, 10) : 0;
  return [0, 1, 2, 3].includes(rawLevel) ? rawLevel as NgLevel : 0;
}

// ブックマークレット用の即座実行関数（旧版と同じスタイル）
if (typeof window !== 'undefined' && shouldAutoRunBookmarklet()) {
  bootstrapBookmarklet(getBuildNgLevel());
}
