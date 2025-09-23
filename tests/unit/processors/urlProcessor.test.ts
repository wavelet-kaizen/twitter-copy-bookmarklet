import { UrlProcessor } from '../../../src/processors/urlProcessor';
import { createSettings } from '../../../src/config/settings';

describe('UrlProcessor', () => {
  let processor: UrlProcessor;

  beforeEach(() => {
    const settings = createSettings(1); // NG回避レベル1
    processor = new UrlProcessor({
      ngSettings: settings,
      isMobile: false,
      domain: 'x.com'
    });
  });

  describe('processLinkUrl', () => {
    it('NG回避レベル0の場合はクエリパラメータ除去のみ', () => {
      const level0Settings = createSettings(0);
      const level0Processor = new UrlProcessor({
        ngSettings: level0Settings,
        isMobile: false,
        domain: 'x.com'
      });

      const input = 'https://example.com/page?utm_source=twitter&id=123';
      const result = level0Processor.processLinkUrl(input);

      expect(result).toContain('https://example.com/page');
      expect(result).toContain('id=123');
      expect(result).not.toContain('utm_source');
    });

    it('YouTube URLはそのまま通す', () => {
      const input = 'https://www.youtube.com/watch?v=abc123';
      const result = processor.processLinkUrl(input);

      expect(result).toBe(input);
    });

    it('NGURLリストにあるURLはリダイレクト処理', () => {
      const input = 'https://bit.ly/shortlink';
      const result = processor.processLinkUrl(input);

      expect(result).toContain('google.co.jp/url?q=');
    });

    it('レベル2以上の場合はすべてリダイレクト処理', () => {
      const level2Settings = createSettings(2);
      const level2Processor = new UrlProcessor({
        ngSettings: level2Settings,
        isMobile: false,
        domain: 'x.com'
      });

      const input = 'https://example.com/page';
      const result = level2Processor.processLinkUrl(input);

      expect(result).toContain('google.co.jp/url?q=');
    });
  });

  describe('processImageUrl', () => {
    it('NG回避レベル0の場合は何もしない', () => {
      const level0Settings = createSettings(0);
      const level0Processor = new UrlProcessor({
        ngSettings: level0Settings,
        isMobile: false,
        domain: 'x.com'
      });

      const input = 'https://pbs.twimg.com/media/image.jpg';
      const result = level0Processor.processImageUrl(input);

      expect(result).toBe(input);
    });

    it('レベル2の場合はh抜き処理', () => {
      const level2Settings = createSettings(2);
      const level2Processor = new UrlProcessor({
        ngSettings: level2Settings,
        isMobile: false,
        domain: 'x.com'
      });

      const input = 'https://pbs.twimg.com/media/image.jpg';
      const result = level2Processor.processImageUrl(input);

      expect(result).toBe('ttps://pbs.twimg.com/media/image.jpg');
    });

    it('レベル3の場合はAMPプロキシ経由', () => {
      const level3Settings = createSettings(3);
      const level3Processor = new UrlProcessor({
        ngSettings: level3Settings,
        isMobile: false,
        domain: 'x.com'
      });

      const input = 'https://pbs.twimg.com/media/image.jpg';
      const result = level3Processor.processImageUrl(input);

      expect(result).toContain('pbs-twimg-com.cdn.ampproject.org');
      expect(result).toContain('/i/s/pbs.twimg.com/media/image.jpg');
    });
  });

  describe('processVideoUrl', () => {
    it('mp4ファイルでレベル2以上の場合はh抜き', () => {
      const level2Settings = createSettings(2);
      const level2Processor = new UrlProcessor({
        ngSettings: level2Settings,
        isMobile: false,
        domain: 'x.com'
      });

      const input = 'https://video.twimg.com/video.mp4';
      const result = level2Processor.processVideoUrl(input);

      expect(result).toBe('ttps://video.twimg.com/video.mp4');
    });

    it('YouTubeチャンネル/プレイリストURLはそのまま', () => {
      const channelInput = 'https://www.youtube.com/channel/UCtest';
      const playlistInput = 'https://www.youtube.com/playlist?list=PLtest';

      const channelResult = processor.processVideoUrl(channelInput);
      const playlistResult = processor.processVideoUrl(playlistInput);

      expect(channelResult).toBe(channelInput);
      expect(playlistResult).toBe(playlistInput);
    });

    it('通常のYouTube URLを短縮化', () => {
      const input = 'https://www.youtube.com/watch?v=abc123def&feature=youtu.be';
      const result = processor.processVideoUrl(input);

      expect(result).toContain('y2u.be/abc123def');
      expect(result).toContain('i.ytimg.com/vi/abc123def/hqdefault.jpg');
    });

    it('タイムスタンプ付きYouTube URLを処理', () => {
      const input = 'https://www.youtube.com/watch?v=abc123&t=120s';
      const result = processor.processVideoUrl(input);

      expect(result).toContain('ohayua.cyou/?yt=abc123&t=120s');
      expect(result).toContain('i.ytimg.com/vi/abc123/hqdefault.jpg');
    });
  });

  describe('createTweetUrl', () => {
    it('基本的なツイートURLを生成', () => {
      const result = processor.createTweetUrl('elonmusk', '1234567890');

      // NG回避レベル1なのでリダイレクト処理される
      expect(result).toContain('google.co.jp/url?q=');
    });

    it('NG回避レベル1以上の場合はリダイレクト処理', () => {
      const result = processor.createTweetUrl('twitter', '9876543210');

      expect(result).toContain('google.co.jp/url?q=');
      // URLエンコーディングが処理されているため、期待値を修正
      expect(result).toContain('x%2Ecom%2Ftwitter%2Fstatus%2F9876543210');
    });

    it('NG回避レベル0の場合は直接URL', () => {
      const level0Settings = createSettings(0);
      const level0Processor = new UrlProcessor({
        ngSettings: level0Settings,
        isMobile: false,
        domain: 'x.com'
      });

      const result = level0Processor.createTweetUrl('user', '1111111111');

      expect(result).toBe('https://x.com/user/status/1111111111');
      expect(result).not.toContain('google.co.jp');
    });
  });

  describe('NGクエリパラメータの除去', () => {
    it('utm_パラメータを除去', () => {
      const input = 'https://example.com?utm_source=twitter&utm_medium=social&id=123';
      const result = processor.processLinkUrl(input);

      const urlParam = result.includes('google.co.jp') ? 
        result.split('q=')[1] : null;
      const resultUrl = new URL(urlParam ? decodeURIComponent(urlParam) : result);
      
      expect(resultUrl.searchParams.has('utm_source')).toBe(false);
      expect(resultUrl.searchParams.has('utm_medium')).toBe(false);
      expect(resultUrl.searchParams.get('id')).toBe('123');
    });
  });
});