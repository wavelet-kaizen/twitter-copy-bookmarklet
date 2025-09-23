import { NGSettings, ProcessorOptions } from '../types';

export class UrlProcessor {
  private settings: NGSettings;

  constructor(options: ProcessorOptions) {
    this.settings = options.ngSettings;
  }

  /**
   * リンクURLのNG回避処理
   */
  processLinkUrl(url: string): string {
    let processedUrl = url;

    // クエリパラメータの除去
    processedUrl = this.removeNGQueryParams(processedUrl);

    if (this.settings.level === 0) {
      return processedUrl;
    }

    // URL内の文字列置換
    processedUrl = this.replaceUrlString(processedUrl);

    // YouTubeURLはそのまま通す
    if (this.isYouTubeUrl(processedUrl)) {
      return processedUrl;
    }

    // NGURLの処理
    processedUrl = this.processNGUrls(processedUrl);

    // レベル2以上の場合はリダイレクト処理
    if (this.settings.level >= 2) {
      return this.makeRedirectUrl(processedUrl);
    }

    return processedUrl;
  }

  /**
   * 画像URLのNG回避処理
   */
  processImageUrl(url: string): string {
    if (this.settings.level === 0) {
      return url;
    }

    const processedUrl = this.replaceUrlString(url);

    if (this.settings.level < 2) {
      return processedUrl;
    }

    if (this.settings.level === 2) {
      // h抜き処理
      return processedUrl.replace(/http/g, 'ttp');
    }

    if (this.settings.level === 3) {
      // AMP Projectプロキシ経由
      return this.makeAmpProjectUrl(processedUrl);
    }

    return processedUrl;
  }

  /**
   * カード画像URLの特別な変換処理（元のJS版のロジックを再現）
   */
  processCardImageUrl(url: string): string {
    // NGレベルに関係なく常に変換（元のJS版と同じ）
    const cardMatch = url.match(/card_img\/(\d+)\/([^?]*).*format=(\w+)/);
    
    if (cardMatch) {
      const [, id, hash, format] = cardMatch;
      return `https://ohayua.cyou/card_img/${id}/${hash}.${format}`;
    }

    // マッチしない場合は元のURLを返す
    return url;
  }

  /**
   * 動画URLのNG回避処理
   */
  processVideoUrl(url: string): string {
    let processedUrl = url;

    if (this.settings.level > 0) {
      processedUrl = this.replaceUrlString(processedUrl);
    }

    // mp4ファイルでレベル2以上の場合はh抜き
    if (processedUrl.match(/.*\.mp4/) && this.settings.level >= 2) {
      processedUrl = processedUrl.replace(/http/g, 'ttp');
    }

    // チャンネルやプレイリストはそのまま
    if (processedUrl.match(/(\/channel\/)|(\/playlist)/)) {
      return processedUrl;
    }

    // YouTube URLの短縮化
    processedUrl = this.shortenYouTubeUrl(processedUrl);

    return processedUrl;
  }

  /**
   * TwitterのツイートURLを生成
   */
  createTweetUrl(screenName: string, tweetId: string): string {
    let url = `https://x.com/${screenName}/status/${tweetId}`;
    
    // URL内文字列の置換
    url = this.replaceUrlString(url);
    
    if (this.settings.level >= 1) {
      url = this.makeRedirectUrl(url);
    }
    
    return url;
  }

  private removeNGQueryParams(urlString: string): string {
    try {
      const url = new URL(urlString);
      const params = url.searchParams;
      
      Array.from(params.keys()).forEach(key => {
        if (this.settings.ngQueryParams.some(pattern => pattern.test(key))) {
          params.delete(key);
        }
      });
      
      return url.toString();
    } catch {
      return urlString;
    }
  }

  private replaceUrlString(url: string): string {
    // replaceURLStringが設定に含まれていないため、固定パターンで処理
    const patterns = [/K5/g, /tokoyami/g];
    
    return patterns.reduce((result, pattern) => {
      const match = result.match(pattern);
      if (match) {
        return result.replace(pattern, this.fixedEncodeURIComponent(match[0], true));
      }
      return result;
    }, url);
  }

  private processNGUrls(url: string): string {
    let result = url;
    
    this.settings.ngUrls.forEach(pattern => {
      const matches = result.match(pattern);
      if (matches) {
        matches.forEach(match => {
          result = result.replace(match, this.makeRedirectUrl(match));
        });
      }
    });
    
    return result;
  }

  private makeRedirectUrl(url: string, useProxy = false): string {
    if (!useProxy) {
      const encoded = this.fixedEncodeURIComponent(url);
      let processedEncoded = encoded;
      
      for (const domain of this.settings.ngDomains) {
        if (typeof domain === 'string') {
          const pattern = new RegExp(domain, 'g');
          const match = processedEncoded.match(pattern);
          if (match) {
            const replacement = this.fixedEncodeURIComponent(match[0], true);
            processedEncoded = this.makeRedirectUrl(processedEncoded.replace(pattern, replacement));
          }
        } else {
          // domain is RegExp
          const match = processedEncoded.match(domain);
          if (match) {
            const replacement = this.fixedEncodeURIComponent(match[0], true);
            processedEncoded = this.makeRedirectUrl(processedEncoded.replace(domain, replacement));
          }
        }
      }
      
      return `https://www.google.co.jp/url?q=${processedEncoded}`;
    } else {
      try {
        const urlObj = new URL(url);
        const ssl = urlObj.protocol === 'https:' ? '1' : '0';
        const domain = urlObj.host.replace(/\./g, '_');
        const path = encodeURIComponent(urlObj.pathname).replace(/^\//, '');
        return `https://ohayua.cyou/?ssl=${ssl}&d=${domain}&p=${path}`;
      } catch {
        return url;
      }
    }
  }

  private makeAmpProjectUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? 's/' : '';
      const hostname = urlObj.hostname.replace(/\./g, '-');
      return `https://${hostname}.cdn.ampproject.org/i/${protocol}${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }

  private shortenYouTubeUrl(text: string): string {
    let result = text;
    
    // タイムスタンプ付きYouTube URL
    result = result.replace(
      /https?:\/\/(?:.*?youtu\.be|.*?youtube\.com)(?:\/(?:watch|live|shorts))?\/?(?:watch\?v=)?([A-Za-z0-9_%-]+)(?:[?&#][^t][=\w.-]*)*(?:[?&#]t=)([\dhms]+)(?:[?&#][\w=.-]*)*/g,
      (_, videoId, timestamp) => {
        return `https://ohayua.cyou/?yt=${videoId}&t=${timestamp} https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      }
    );

    // 通常のYouTube URL
    result = result.replace(
      /https?:\/\/(?:.*?youtu\.be|.*?youtube\.com)(?:\/(?:watch|live|shorts))?\/?(?:watch\?v=)?([A-Za-z0-9_%-]+)(?:[?&#][\w=.-]*)*/g,
      (_, videoId) => {
        return `http://y2u.be/${videoId} https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      }
    );

    return result;
  }

  private isYouTubeUrl(url: string): boolean {
    return /https?:\/\/(?:.*?youtu\.be\/|.*?youtube\.com\/)/.test(url);
  }

  private fixedEncodeURIComponent(str: string, strong = false): string {
    const pattern = strong ? /[a-zA-Z!'()*._-]/g : /[!'()*._-]/g;
    return encodeURIComponent(str).replace(pattern, (char) => {
      return '%' + char.charCodeAt(0).toString(16).toUpperCase();
    });
  }
}
