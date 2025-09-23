import { TweetData, ProcessorOptions, PollData, PollChoice, AudioSpaceData, SpaceParticipant, MediaItem } from './types';
import { createSettings } from './config/settings';
import { TokenExtractor } from './auth/tokenExtractor';
import { TwitterApiClient } from './api/twitterApi';
import { TweetParser } from './parsers/tweetParser';
import { TextProcessor } from './processors/textProcessor';
import { UrlProcessor } from './processors/urlProcessor';
import { LoadingManager } from './ui/loadingManager';

export class TwitterCopyBookmarklet {
  private version = process.env.APP_VERSION ?? 'development';
  private apiClient: TwitterApiClient;
  private textProcessor: TextProcessor;
  private urlProcessor: UrlProcessor;
  private options: ProcessorOptions;

  constructor(avoidNgLevel: 0 | 1 | 2 | 3 = 0) {
    const settings = createSettings(avoidNgLevel);
    const domain = window.location.hostname;
    const isMobile = /^mobile/.test(domain);
    
    this.options = {
      ngSettings: settings,
      isMobile,
      domain
    };

    // 認証トークンの取得
    const cookieTokens = TokenExtractor.extractTokensFromCookies();
    const bearerToken = TokenExtractor.extractBearerToken();
    
    if (!bearerToken) {
      throw new Error('Bearer token not found');
    }

    this.apiClient = new TwitterApiClient(
      {
        bearerToken,
        ...cookieTokens
      },
      domain
    );

    this.textProcessor = new TextProcessor(this.options);
    this.urlProcessor = new UrlProcessor(this.options);
  }

  /**
   * ツイートをコピーする
   */
  async copyTweet(): Promise<string> {
    const tweetId = TokenExtractor.extractTweetId();
    if (!tweetId) {
      throw new Error('Tweet ID not found in URL');
    }

    try {
      console.log(`version: ${this.version}`);
      
      // ツイートデータの取得
      const apiResponse = await this.apiClient.fetchTweetDetail(tweetId);
      const tweetData = TweetParser.parseTweet(apiResponse, tweetId, false, this.options.ngSettings);

      // AudioSpaceの処理（引用ツイート内も含めて展開）
      await this.processAudioSpaces(tweetData);

      // ツイート文字列の生成
      const formattedTweet = this.formatTweet(tweetData);
      console.log(formattedTweet);
      
      // クリップボードにコピー
      await navigator.clipboard.writeText(formattedTweet);
      
      LoadingManager.stopLoading();
      
      return formattedTweet;
      
    } catch (error) {
      LoadingManager.stopLoading();
      console.error('Failed to copy tweet:', error);
      throw error;
    }
  }

  private async processAudioSpaces(rootTweet: TweetData): Promise<void> {
    if (!this.containsAudioSpace(rootTweet)) {
      return;
    }

    const queryId = TokenExtractor.extractAudioSpaceQueryId();
    if (!queryId) {
      return;
    }

    const cache = new Map<string, AudioSpaceData>();

    const populate = async (tweet?: TweetData): Promise<void> => {
      if (!tweet) {
        return;
      }

      const spaceId = tweet.audioSpace?.id;
      if (spaceId) {
        let audioSpace = cache.get(spaceId);
        if (!audioSpace) {
          try {
            const response = await this.apiClient.fetchAudioSpace(spaceId, queryId);
            audioSpace = TweetParser.parseAudioSpace(response);
            audioSpace.id = spaceId;
            cache.set(spaceId, audioSpace);
          } catch (error) {
            console.warn(`Failed to fetch AudioSpace data for ${spaceId}:`, error);
          }
        }

        if (audioSpace) {
          tweet.audioSpace = { ...audioSpace };
        }
      }

      if (tweet.quotedTweet) {
        await populate(tweet.quotedTweet);
      }
    };

    await populate(rootTweet);
  }

  private formatTweet(tweetData: TweetData): string {
    const emojiRegExp = TokenExtractor.extractEmojiRegexp();
    
    // ヘッダー行の作成
    let result = '';
    const processedUserName = this.textProcessor.processText(tweetData.author.name, emojiRegExp);
    result += `${processedUserName} @${tweetData.author.screenName} (${this.formatDate(tweetData.createdAt)}) `;

    // 会話ポリシーの表示
    if (tweetData.conversationPolicy) {
      switch (tweetData.conversationPolicy) {
      case 'community':
        result += '[返信:フォロー/@のみ]';
        break;
      case 'by_invitation':
        result += '[返信:@のみ]';
        break;
      }
    }
    result += '\n';

    // リプライ先の表示
    if (tweetData.replyTo) {
      const visibleReplies = tweetData.replyTo.filter(
        reply => !tweetData.text.toUpperCase().includes(reply.toUpperCase())
      );
      if (visibleReplies.length > 0) {
        result += visibleReplies.join(' ') + ' ';
      }
    }

    // メイン本文
    if (tweetData.text) {
      const processedText = this.textProcessor.processText(tweetData.text, emojiRegExp);
      let processedUrls = this.urlProcessor.processVideoUrl(processedText);

      if (tweetData.audioSpace?.id) {
        processedUrls = this.removeAudioSpaceReferences(processedUrls, tweetData.audioSpace.id);
      }

      result += processedUrls + '\n';
    }

    // 投票情報の表示
    if (tweetData.poll) {
      result += this.formatPoll(tweetData.poll);
    }

    // AudioSpace情報の表示
    if (tweetData.audioSpace) {
      result += this.formatAudioSpace(tweetData.audioSpace);
    }

    // additionalMedia情報の表示（元のJS版のロジック）
    if (tweetData.additionalMedia && result.indexOf(this.urlProcessor.processVideoUrl(tweetData.additionalMedia.url)) < 0) {
      if (tweetData.additionalMedia.title) {
        result += tweetData.additionalMedia.title + '\n';
      }
      result += this.urlProcessor.processVideoUrl(tweetData.additionalMedia.url) + '\n';
    }

    // メディア情報の表示（imgs相当）
    if (tweetData.media) {
      result += this.formatMedia(tweetData.media);
    }

    // 動画URL情報の表示（元のJS版のvideourl相当）
    if (tweetData.videoUrls) {
      tweetData.videoUrls.forEach(videoUrl => {
        const processedVideoUrl = this.urlProcessor.processVideoUrl(videoUrl);
        if (tweetData.text.indexOf(videoUrl) < 0 && result.indexOf(processedVideoUrl) < 0) {
          result += processedVideoUrl + '\n';
        }
      });
    }

    // ツイートURL
    result += this.urlProcessor.createTweetUrl(tweetData.author.screenName, tweetData.id);

    // 引用ツイート
    if (tweetData.quotedTweet) {
      result += '\n\n[引用元] ' + this.formatTweet(tweetData.quotedTweet);
    }

    // 空行の整理
    return this.textProcessor.trimBlankLines(result);
  }

  private formatDate(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  private formatTime(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private formatPoll(poll: PollData): string {
    const totalVotes = poll.choices.reduce((sum: number, choice: PollChoice) => sum + choice.votes, 0);
    let result = `【投票${poll.isEnded ? '結果' : '中'}:${this.getPollTimeRemaining(poll)}`;
    result += `(${poll.isEnded ? '計' : '現在'}${totalVotes.toLocaleString()}票)】\n`;
    
    poll.choices.forEach((choice: PollChoice, index: number) => {
      const percentage = totalVotes > 0 ? Math.round(choice.votes / totalVotes * 1000) / 10 : 0;
      result += `[${index + 1}] ${choice.text}(${percentage}%)\n`;
    });

    return result;
  }

  private getPollTimeRemaining(poll: PollData): string {
    if (poll.isEnded) return '';

    const now = new Date().getTime();
    if (!poll.endTime) {
      return '';
    }

    const endTime = new Date(poll.endTime).getTime();
    const diffSeconds = Math.trunc((endTime - now) / 1000);

    if (diffSeconds <= 0) return '';

    const secondsInMinute = 60;
    const secondsInHour = secondsInMinute * 60;
    const secondsInDay = secondsInHour * 24;

    const days = Math.trunc(diffSeconds / secondsInDay);
    if (days > 0) return `残り${days}日`;

    const remainingAfterDays = diffSeconds - days * secondsInDay;

    const hours = Math.trunc(remainingAfterDays / secondsInHour);
    if (hours > 0) return `残り${hours}時間`;

    const remainingAfterHours = remainingAfterDays - hours * secondsInHour;

    const minutes = Math.trunc(remainingAfterHours / secondsInMinute);
    if (minutes > 0) return `残り${minutes}分`;

    const seconds = remainingAfterHours - minutes * secondsInMinute;
    if (seconds > 0) return `残り${seconds}秒`;

    return '';
  }

  private formatAudioSpace(space: AudioSpaceData): string {
    const isEnded = ['Ended', 'TimedOut'].includes(space.state);
    const tags: string[] = [];

    if (isEnded) {
      tags.push('配信終了');
    } else {
      const startDate: Date | undefined = space.startedAt || space.scheduledStart;
      if (startDate) {
        tags.push(`${this.formatTime(startDate)}開始`);
      }
    }

    tags.push(space.isRecording ? '録画あり' : '録画なし');

    const lines: string[] = [];
    let header = tags.map(tag => `[${tag}]`).join('');

    if (space.title) {
      const processedTitle = this.textProcessor.processText(space.title);
      header += ` ${processedTitle}`;
    }

    lines.push(header);

    const admins = (space.admins ?? []).map((admin: SpaceParticipant) => {
      const processedName = this.textProcessor.processText(admin.displayName);
      return `${processedName} @${admin.twitterScreenName}`;
    });
    const uniqueAdmins = Array.from(new Set(admins));
    if (uniqueAdmins.length > 0) {
      lines.push(`ホスト：${uniqueAdmins.join(', ')}`);
    }

    const speakers = (space.speakers ?? []).map((speaker: SpaceParticipant) => {
      const processedName = this.textProcessor.processText(speaker.displayName);
      return `${processedName} @${speaker.twitterScreenName}`;
    });
    const uniqueSpeakers = Array.from(new Set(speakers));
    if (uniqueSpeakers.length > 0) {
      lines.push(`スピーカー：${uniqueSpeakers.join(', ')}`);
    }

    if (space.id) {
      lines.push(`https://x.com/i/spaces/${space.id}`);
    }

    return `${lines.join('\n')}\n`;
  }

  private formatMedia(media: MediaItem[]): string {
    return media
      .map(item => {
        const processedUrl = this.urlProcessor.processImageUrl(item.url);
        const altText = item.altText ? item.altText + ' ' : '';
        return altText + processedUrl + '\n';
      })
      .join('');
  }

  private containsAudioSpace(tweetData?: TweetData): boolean {
    if (!tweetData) {
      return false;
    }

    if (tweetData.audioSpace?.id) {
      return true;
    }

    if (tweetData.quotedTweet) {
      return this.containsAudioSpace(tweetData.quotedTweet);
    }

    return false;
  }

  private removeAudioSpaceReferences(text: string, spaceId: string): string {
    const patterns = [
      new RegExp(String.raw`\s*https?://(?:mobile\.)?twitter\.com/i/spaces/${spaceId}[^\n\s]*`, 'gi'),
      new RegExp(String.raw`\s*https?://x\.com/i/spaces/${spaceId}[^\n\s]*`, 'gi')
    ];

    // AudioSpaceのリンクのみを除去し、元の空行は保持する
    const processedLines = text.split('\n').reduce<string[]>((lines, currentLine) => {
      let processedLine = currentLine;
      let removedContent = false;

      patterns.forEach(pattern => {
        const replacedLine = processedLine.replace(pattern, '');
        if (replacedLine !== processedLine) {
          removedContent = true;
          processedLine = replacedLine;
        }
      });

      processedLine = processedLine.replace(/[ \t]+$/g, '');

      if (removedContent && processedLine.trim() === '') {
        return lines;
      }

      lines.push(processedLine);
      return lines;
    }, []);
    return processedLines.join('\n').trimEnd();
  }
}

export function bootstrapBookmarklet(ngLevel: 0 | 1 | 2 | 3): Promise<string> {
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

// ブックマークレット用の即座実行関数（旧版と同じスタイル）
if (typeof window !== 'undefined' && shouldAutoRunBookmarklet()) {
  const ngLevel = (process.env.NG_LEVEL ? parseInt(process.env.NG_LEVEL as string) : 0) as 0 | 1 | 2 | 3;
  bootstrapBookmarklet(ngLevel);
}
