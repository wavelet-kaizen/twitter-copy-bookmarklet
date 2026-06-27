import { bootstrapTampermonkey } from '@/entry/tampermonkey';
import { LoadingManager } from '@/ui/loadingManager';

describe('bootstrapTampermonkey', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('status URL以外では実行せずローディングも開始しない', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'x.com',
        pathname: '/home',
      },
      writable: true,
    });
    const loadingSpy = jest.spyOn(LoadingManager, 'startLoading');

    await expect(bootstrapTampermonkey(0)).rejects.toThrow('Tweet ID not found in URL');

    expect(loadingSpy).not.toHaveBeenCalled();
  });

  it('コンストラクタが同期例外を投げてもローディングを停止する', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'x.com',
        pathname: '/tester/status/1234567890',
      },
      writable: true,
    });
    window.webpackChunk_twitter_responsive_web = [];
    const loadingStartSpy = jest.spyOn(LoadingManager, 'startLoading').mockImplementation();
    const loadingStopSpy = jest.spyOn(LoadingManager, 'stopLoading').mockImplementation();

    await expect(bootstrapTampermonkey(0)).rejects.toThrow('Bearer token not found');

    expect(loadingStartSpy).toHaveBeenCalled();
    expect(loadingStopSpy).toHaveBeenCalled();
  });
});
