import { createSettings } from '@/config/settings';

describe('createSettings', () => {
  afterEach(() => {
    delete window.TWITTER_COPY_USER_CONFIG;
  });

  it('実行時のユーザー設定を反映する', () => {
    window.TWITTER_COPY_USER_CONFIG = {
      avoidNgLevel: 3,
      removeEmoji: true,
      trimBlankLine: 2,
    };

    const settings = createSettings(0);

    expect(settings.level).toBe(3);
    expect(settings.removeEmoji).toBe(true);
    expect(settings.trimBlankLine).toBe(2);
  });

  it('ユーザー設定が無い場合は引数のNGレベルと既定値を使う', () => {
    const settings = createSettings(1);

    expect(settings.level).toBe(1);
    expect(settings.removeEmoji).toBe(false);
    expect(settings.trimBlankLine).toBe(128);
  });
});
