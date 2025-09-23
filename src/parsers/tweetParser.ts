import { TweetData, UserData, MediaItem, PollData, PollChoice, AudioSpaceData, SpaceParticipant, TwitterApiResponse, AudioSpaceApiResponse, NGSettings } from '../types';
import { UrlProcessor } from '../processors/urlProcessor';
import { TextProcessor } from '../processors/textProcessor';
import { DEFAULT_SETTINGS } from '../config/settings';

type UnknownRecord = Record<string, unknown>;

type InstructionEntry = {
  entryId: string;
  content?: Record<string, unknown>;
};

type TweetResult = {
  legacy: TweetLegacy;
  core: TweetCore;
  card?: { legacy?: TwitterCardLegacy };
  note_tweet?: { note_tweet_results?: { result?: NoteTweetResult } };
};

type TweetCore = {
  user_results: {
    result: TweetUserResult;
  };
};

type TweetLegacy = {
  id_str: string;
  full_text?: string;
  text?: string;
  created_at: string;
  extended_entities?: { media?: TwitterMediaEntity[] };
  entities?: {
    urls?: TwitterUrlEntity[];
    user_mentions?: TwitterUserMention[];
  };
  quoted_status_permalink?: unknown;
  conversation_control?: { policy?: string };
  in_reply_to_screen_name?: string | null;
};

type TweetUserResult = {
  rest_id?: string;
  legacy?: UserLegacy;
  core?: UserCore;
};

type UserLegacy = {
  id_str?: string;
  name?: string;
  screen_name?: string;
};

type UserCore = {
  name?: string;
  screen_name?: string;
};

type AdditionalMediaInfo = {
  title?: string;
  description?: string;
  call_to_actions?: {
    watch_now?: {
      url?: string;
    };
    visit_site?: {
      url?: string;
    };
    [key: string]: unknown;
  };
};

type TwitterMediaEntity = {
  type?: 'photo' | 'video' | 'animated_gif';
  url?: string;
  media_url_https?: string;
  ext_alt_text?: string;
  expanded_url?: string;
  video_info?: {
    variants: MediaVariant[];
  };
  additional_media_info?: AdditionalMediaInfo;
};

type MediaVariant = {
  content_type?: string;
  url: string;
  bitrate?: number;
};

type TwitterUrlEntity = {
  url: string;
  expanded_url?: string;
};

type TwitterUserMention = {
  screen_name: string;
};

type NoteTweetResult = {
  text?: string;
  entity_set?: {
    urls?: TwitterUrlEntity[];
  };
};

type TwitterCardLegacy = {
  name?: string;
  binding_values?: CardBindingValue[];
};

type CardBindingValue = {
  key: string;
  value?: {
    string_value?: string;
    boolean_value?: boolean;
    image_value?: {
      url?: string;
    };
  };
};

type UnifiedCardMediaEntity = {
  type?: 'photo' | 'video';
  media_url_https?: string;
  ext_alt_text?: string;
  video_info?: {
    variants?: MediaVariant[];
  };
};

type UnifiedCardDestinationObject = {
  type?: string;
  data?: {
    url_data?: {
      url?: string;
    };
  };
};

export class TweetParser {
  /**
   * TwitterのAPI応答からツイートデータを解析
   */
  static parseTweet(apiResponse: TwitterApiResponse, tweetId: string, isQuotedTweet = false, ngSettings?: NGSettings): TweetData {
    const instructions = apiResponse.data.threaded_conversation_with_injections_v2?.instructions;

    const tweetEntry = this.getTweetEntry(instructions, tweetId) ??
      this.createTweetEntryFromResult(apiResponse, tweetId);

    if (!tweetEntry) {
      throw new Error(`Tweet entry not found for ID: ${tweetId}`);
    }

    const tweetResult = this.extractTweetResult(tweetEntry, isQuotedTweet);
    const tweet = tweetResult.legacy;
    const userResult = tweetResult.core.user_results.result;
    const card = tweetResult.card?.legacy;
    const longText = tweetResult.note_tweet?.note_tweet_results?.result?.text;

    const parsedTweet: TweetData = {
      id: tweet.id_str,
      text: this.extractTweetText(tweet, longText),
      createdAt: new Date(tweet.created_at),
      author: this.parseUser(userResult),
      conversationPolicy: this.parseConversationPolicy(tweet.conversation_control)
    };

    // メディアの解析
    if (tweet.extended_entities?.media) {
      const { media, videoUrls, additionalMedia } = this.parseExtendedMedia(tweet.extended_entities.media);
      parsedTweet.media = media;
      parsedTweet.videoUrls = videoUrls;
      parsedTweet.additionalMedia = additionalMedia;
      
      // 元のJS版と同様にメディアURLを本文から除去
      tweet.extended_entities.media.forEach(mediaItem => {
        if (typeof mediaItem.url === 'string') {
          parsedTweet.text = parsedTweet.text.replace(mediaItem.url, '');
        }
      });
    }

    // 投票の解析
    if (card && this.isPollCard(card)) {
      parsedTweet.poll = this.parsePoll(card);
    }

    // AudioSpaceの解析
    if (card && this.isAudioSpaceCard(card)) {
      parsedTweet.audioSpace = this.parseAudioSpaceFromCard(card) as AudioSpaceData;
    }

    // unified_cardの処理（動画カルーセル等）
    if (card && this.isUnifiedCard(card)) {
      const { media, videoUrls, additionalMedia } = this.parseUnifiedCard(card);
      if (media.length > 0) {
        parsedTweet.media = (parsedTweet.media || []).concat(media);
      }
      if (videoUrls.length > 0) {
        parsedTweet.videoUrls = (parsedTweet.videoUrls || []).concat(videoUrls);
      }
      if (additionalMedia) {
        parsedTweet.additionalMedia = additionalMedia;
      }
    }

    // カードタイトルの処理（元のJS版のロジックを再現）
    if (card && !this.isPollCard(card) && !this.isAudioSpaceCard(card) && !this.isUnifiedCard(card)) {
      this.processCardTitle(parsedTweet, card);
      
      // カード画像の処理
      const cardImageUrl = this.extractCardImageUrl(card);
      if (cardImageUrl) {
        // 元のJS版と同様にカード画像専用の処理を適用（NGレベル関係なし）
        const urlProcessor = new UrlProcessor({
          ngSettings: DEFAULT_SETTINGS,
          isMobile: false,
          domain: 'x.com',
        });
        const processedUrl = urlProcessor.processCardImageUrl(cardImageUrl);
        
        if (!parsedTweet.media) {
          parsedTweet.media = [];
        }
        parsedTweet.media.push({
          type: 'photo',
          url: processedUrl
        });
      }
    }

    // リプライ先の解析
    if (tweet.in_reply_to_screen_name || tweet.entities?.user_mentions) {
      parsedTweet.replyTo = this.parseReplyTargets(tweet);
    }

    // 引用ツイートの解析
    if (tweet.quoted_status_permalink && !isQuotedTweet) {
      try {
        parsedTweet.quotedTweet = this.parseTweet(apiResponse, tweetId, true, ngSettings);
      } catch (error) {
        console.warn('Failed to parse quoted tweet:', error);
      }
    }

    // URLエンティティの処理
    this.processUrlEntities(parsedTweet, tweet, tweetResult.note_tweet?.note_tweet_results?.result, ngSettings);

    return parsedTweet;
  }

  /**
   * AudioSpaceデータの解析
   */
  static parseAudioSpace(apiResponse: AudioSpaceApiResponse): AudioSpaceData {
    const space = apiResponse.data.audioSpace;
    const adminRecords = this.toRecordArray(space.participants?.admins);
    const speakerRecords = this.toRecordArray(space.participants?.speakers);

    return {
      id: '', // IDは外部から設定される
      title: space.metadata.title,
      state: space.metadata.state as AudioSpaceData['state'],
      startedAt: space.metadata.started_at ? new Date(space.metadata.started_at) : undefined,
      scheduledStart: space.metadata.scheduled_start ? new Date(space.metadata.scheduled_start) : undefined,
      updatedAt: space.metadata.updated_at ? new Date(space.metadata.updated_at) : undefined,
      isRecording: space.metadata.is_space_available_for_replay,
      admins: this.mapParticipants(adminRecords),
      speakers: this.mapParticipants(speakerRecords),
    };
  }

  private static createTweetEntryFromResult(
    apiResponse: TwitterApiResponse,
    tweetId: string
  ): InstructionEntry | undefined {
    const dataRecord = this.asRecord(apiResponse.data);
    const tweetResultContainer = this.asRecord(dataRecord?.['tweetResult'])
      ?? this.asRecord(dataRecord?.['tweetResultByRestId']);
    const result = this.asRecord(tweetResultContainer?.['result']);
    if (!result) {
      return undefined;
    }

    const content: UnknownRecord = {
      itemContent: {
        tweet_results: {
          result
        }
      }
    };

    return {
      entryId: `tweet-${tweetId}`,
      content,
    };
  }

  private static getTweetEntry(
    instructions: Array<Record<string, unknown>> | undefined,
    tweetId: string
  ): InstructionEntry | undefined {
    if (!Array.isArray(instructions)) {
      return undefined;
    }

    for (const instructionCandidate of instructions) {
      const instructionRecord = instructionCandidate as UnknownRecord;
      const instructionType = instructionRecord['type'];
      if (typeof instructionType !== 'string' || instructionType !== 'TimelineAddEntries') {
        continue;
      }

      const entriesCandidate = Array.isArray(instructionRecord['entries'])
        ? (instructionRecord['entries'] as UnknownRecord[])
        : [];

      const matchedEntry = entriesCandidate.find(entry => {
        const entryIdValue = entry['entryId'];
        return typeof entryIdValue === 'string' && entryIdValue.includes(tweetId);
      });

      if (matchedEntry) {
        const entryIdValue = matchedEntry['entryId'];
        if (typeof entryIdValue !== 'string') {
          continue;
        }
        const contentValue = matchedEntry['content'];
        const content = typeof contentValue === 'object' && contentValue !== null
          ? (contentValue as UnknownRecord)
          : undefined;
        return {
          entryId: entryIdValue,
          content,
        };
      }
    }
    return undefined;
  }

  private static extractTweetResult(tweetEntry: InstructionEntry, isQuotedTweet: boolean): TweetResult {
    const content = tweetEntry.content as UnknownRecord | undefined;
    const itemContent = content?.['itemContent'] as UnknownRecord | undefined;
    const tweetResults = itemContent?.['tweet_results'] as UnknownRecord | undefined;
    const baseResult = tweetResults?.['result'] as UnknownRecord | undefined;

    if (!baseResult) {
      throw new Error('Tweet result payload missing');
    }

    if (isQuotedTweet) {
      const quotedContainer = baseResult['quoted_status_result'] as UnknownRecord | undefined;
      const quotedResult = quotedContainer?.['result'] as UnknownRecord | undefined;
      const actualQuoted = (quotedResult?.['tweet'] as UnknownRecord | undefined) ?? quotedResult;
      if (!actualQuoted) {
        throw new Error('Quoted tweet result missing');
      }
      return this.assertTweetResult(actualQuoted);
    }

    const actualResult = (baseResult['tweet'] as UnknownRecord | undefined) ?? baseResult;
    return this.assertTweetResult(actualResult);
  }

  private static extractTweetText(tweet: TweetLegacy, longText?: string): string {
    if (longText) {
      return longText;
    }

    // APIレスポンスのfull_textをそのまま使用（元のJSコードと同じロジック）
    return tweet.full_text || '';
  }

  private static parseUser(userResult: TweetUserResult): UserData {
    const legacy = userResult.legacy ?? {} as UserLegacy;
    const core = userResult.core ?? {} as UserCore;

    const id = legacy.id_str || userResult.rest_id || '';
    const name = legacy.name || core.name || '';
    const screenName = legacy.screen_name || core.screen_name || '';

    if (!id || !name || !screenName) {
      console.warn('User data missing expected fields.', { id, name, screenName });
    }

    return {
      id,
      name,
      screenName
    };
  }

  private static parseConversationPolicy(conversationControl: TweetLegacy['conversation_control']): TweetData['conversationPolicy'] {
    if (!conversationControl?.policy) {
      return undefined;
    }

    switch (conversationControl.policy) {
    case 'community':
      return 'community';
    case 'by_invitation':
      return 'by_invitation';
    default:
      return undefined;
    }
  }

  private static parseExtendedMedia(mediaEntities: TwitterMediaEntity[]): {
    media: MediaItem[];
    videoUrls: string[];
    additionalMedia?: { url: string; title: string };
  } {
    const media: MediaItem[] = [];
    const videoUrls: string[] = [];
    let additionalMedia: { url: string; title: string } | undefined;

    mediaEntities.forEach(mediaItem => {
      if (mediaItem.type === 'video' || mediaItem.type === 'animated_gif') {
        // 動画処理（元のJS版のロジックを再現）
        const variants = (mediaItem.video_info?.variants ?? [])
          .filter(variant => variant.content_type === 'video/mp4')
          .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));

        const [primaryVariant] = variants;
        if (primaryVariant) {
          const videoUrl = primaryVariant.url.replace(/\?tag=\w*/, '');
          const thumbnailUrl = typeof mediaItem.media_url_https === 'string'
            ? ` ${mediaItem.media_url_https}`
            : '';

          // videoUrls配列に追加（元のJS版のvideourl配列）
          videoUrls.push(videoUrl + thumbnailUrl);

          // additional_media_info処理
          const callToActions = mediaItem.additional_media_info?.call_to_actions;
          if (callToActions) {
            const watchUrl = callToActions.watch_now?.url;
            const visitUrl = callToActions.visit_site?.url;
            const selectedUrl = typeof watchUrl === 'string'
              ? watchUrl
              : typeof visitUrl === 'string'
                ? visitUrl
                : undefined;

            if (selectedUrl) {
              const baseTitle = mediaItem.additional_media_info?.title ?? '';
              const description = mediaItem.additional_media_info?.description;
              const decoratedTitle = description && baseTitle
                ? `${baseTitle} (${description})`
                : baseTitle || selectedUrl;

              additionalMedia = {
                url: selectedUrl,
                title: decoratedTitle,
              };
            }
          }
        }

        // MediaItem配列には追加しない（videoUrlsのみに含める）
      } else if (mediaItem.type === 'photo' && typeof mediaItem.media_url_https === 'string') {
        // 写真処理
        media.push({
          type: mediaItem.type,
          url: mediaItem.media_url_https,
          altText: mediaItem.ext_alt_text,
        });
      }
    });

    return { media, videoUrls, additionalMedia };
  }

  private static isPollCard(card: TwitterCardLegacy): boolean {
    return typeof card.name === 'string' && /poll\d+choice_text_only/.test(card.name);
  }

  private static parsePoll(card: TwitterCardLegacy): PollData {
    const bindingValues = card.binding_values ?? [];

    const getCardValue = (key: string) => {
      const found = bindingValues.find(binding => binding.key === key);
      return found?.value;
    };

    const cardName = card.name ?? '';
    const choiceMatch = cardName.match(/poll(\d)choice_text_only/);
    const choiceGroup = choiceMatch?.[1];
    const choiceCount = choiceGroup ? parseInt(choiceGroup, 10) : 0;

    const choices: PollChoice[] = [];
    for (let i = 1; i <= choiceCount; i++) {
      const label = getCardValue(`choice${i}_label`)?.string_value;
      const count = getCardValue(`choice${i}_count`)?.string_value;

      if (label && count) {
        choices.push({
          text: label,
          votes: parseInt(count, 10)
        });
      }
    }

    const endTimeString = getCardValue('end_datetime_utc')?.string_value;
    const lastUpdatedString = getCardValue('last_updated_datetime_utc')?.string_value;
    return {
      choices,
      endTime: endTimeString ? new Date(endTimeString) : undefined,
      isEnded: getCardValue('counts_are_final')?.boolean_value ?? false,
      lastUpdated: lastUpdatedString ? new Date(lastUpdatedString) : undefined,
    };
  }

  private static parseReplyTargets(tweet: TweetLegacy): string[] {
    const targets: string[] = [];

    if (tweet.in_reply_to_screen_name) {
      targets.push(`@${tweet.in_reply_to_screen_name}`);
    }

    if (tweet.entities?.user_mentions) {
      tweet.entities.user_mentions.forEach(mention => {
        const target = `@${mention.screen_name}`;
        if (!targets.includes(target)) {
          targets.push(target);
        }
      });
    }

    return targets;
  }

  private static processUrlEntities(tweetData: TweetData, tweet: TweetLegacy, noteTweet?: NoteTweetResult, ngSettings?: NGSettings): void {
    const settings = ngSettings || DEFAULT_SETTINGS;
    const urlProcessor = new UrlProcessor({
      ngSettings: settings,
      isMobile: false,
      domain: 'x.com',
    });

    // ツイート本文のURL置換
    const tweetUrls = tweet.entities?.urls ?? [];
    tweetUrls.forEach(url => {
      if (typeof url.url !== 'string') {
        return;
      }
      const expandedUrl = typeof url.expanded_url === 'string' ? url.expanded_url : url.url;
      const processedUrl = urlProcessor.processLinkUrl(expandedUrl);
      tweetData.text = tweetData.text.replace(url.url, processedUrl);
    });

    // 長文ツイートのURL置換
    const noteUrls = noteTweet?.entity_set?.urls ?? [];
    noteUrls.forEach(url => {
      if (typeof url.url !== 'string') {
        return;
      }
      const expandedUrl = typeof url.expanded_url === 'string' ? url.expanded_url : url.url;
      const processedUrl = urlProcessor.processLinkUrl(expandedUrl);
      tweetData.text = tweetData.text.replace(url.url, processedUrl);
    });
  }


  private static isAudioSpaceCard(card: TwitterCardLegacy): boolean {
    return typeof card.name === 'string' && card.name.indexOf('audiospace') >= 0;
  }

  private static parseAudioSpaceFromCard(card: TwitterCardLegacy): Partial<AudioSpaceData> {
    const getCardData = (key: string) => {
      return card.binding_values?.find((binding: CardBindingValue) => binding.key === key)?.value;
    };

    const idValue = getCardData('id');
    if (idValue && idValue.string_value) {
      return { 
        id: idValue.string_value,
        state: 'NotStarted',
        isRecording: false,
        admins: [],
        speakers: []
      };
    }

    return { 
      id: '',
      state: 'NotStarted',
      isRecording: false,
      admins: [],
      speakers: []
    };
  }

  private static isUnifiedCard(card: TwitterCardLegacy): boolean {
    return (card.binding_values ?? []).some((binding: CardBindingValue) => binding.key === 'unified_card');
  }

  private static parseUnifiedCard(card: TwitterCardLegacy): {
    media: MediaItem[];
    videoUrls: string[];
    additionalMedia?: { url: string; title: string };
  } {
    const media: MediaItem[] = [];
    const videoUrls: string[] = [];
    let additionalMedia: { url: string; title: string } | undefined;

    const bindingValues = card.binding_values ?? [];
    const unifiedCardBinding = bindingValues.find(binding => binding.key === 'unified_card');
    const unifiedCardJson = unifiedCardBinding?.value?.string_value;
    if (!unifiedCardJson) {
      return { media, videoUrls, additionalMedia };
    }

    try {
      const unifiedCardData = JSON.parse(unifiedCardJson) as UnknownRecord;

      const mediaEntitiesRecord = this.asRecord(unifiedCardData['media_entities']);
      if (mediaEntitiesRecord) {
        for (const mediaCandidate of Object.values(mediaEntitiesRecord)) {
          if (!this.isUnifiedCardMediaEntity(mediaCandidate)) {
            continue;
          }

          if (mediaCandidate.type === 'video') {
            const variants = (mediaCandidate.video_info?.variants ?? [])
              .filter(variant => variant.content_type === 'video/mp4')
              .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));

            const [primaryVariant] = variants;
            if (primaryVariant) {
              const videoUrl = primaryVariant.url.replace(/\?tag=\w*/, '');
              const thumbnailUrl = typeof mediaCandidate.media_url_https === 'string'
                ? ' ' + mediaCandidate.media_url_https
                : '';
              videoUrls.push(videoUrl + thumbnailUrl);
            }
          } else if (mediaCandidate.type === 'photo' && typeof mediaCandidate.media_url_https === 'string') {
            media.push({
              type: 'photo',
              url: mediaCandidate.media_url_https,
              altText: mediaCandidate.ext_alt_text,
            });
          }
        }
      }

      const destinationRecord = this.asRecord(unifiedCardData['destination_objects']);
      if (destinationRecord) {
        for (const destinationCandidate of Object.values(destinationRecord)) {
          if (!this.isUnifiedCardDestination(destinationCandidate)) {
            continue;
          }

          const destinationUrl = destinationCandidate.data?.url_data?.url;
          if (typeof destinationUrl === 'string') {
            additionalMedia = {
              url: destinationUrl,
              title: '',
            };
            break;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to parse unified_card:', error);
    }

    return { media, videoUrls, additionalMedia };
  }

  private static processCardTitle(tweetData: TweetData, card: TwitterCardLegacy): void {
    const getCardData = (key: string) => {
      return card.binding_values?.find((binding: CardBindingValue) => binding.key === key)?.value;
    };

    const titleData = getCardData('title');
    const cardUrlData = getCardData('card_url');
    
    if (titleData?.string_value && cardUrlData?.string_value) {
      const textProcessor = new TextProcessor({
        ngSettings: DEFAULT_SETTINGS,
        isMobile: false,
        domain: 'x.com',
      });
      
      // タイトルからエモジを除去
      const title = textProcessor.removeEmoji(titleData.string_value);
      const titleParts = title.split(/( ?- ?)|( ?｜ ?)|( ?\| ?)|( ?: ?)|( ?│ ?)/);
      const firstTitlePart = titleParts[0] ?? '';
      const containsFullTitle = tweetData.text.includes(title);
      const containsPartialTitle = firstTitlePart !== '' && titleParts.length >= 2 && tweetData.text.includes(firstTitlePart);

      // 元のJS版のロジック：タイトルが本文に含まれていない場合のみ追加
      if (!containsFullTitle && !containsPartialTitle) {
        const cardUrl = cardUrlData.string_value;
        tweetData.text = tweetData.text.replace(cardUrl, title + '\n' + cardUrl);
      }
    }
  }

  private static extractCardImageUrl(card: TwitterCardLegacy): string | undefined {
    // カードの画像URLを抽出（元のJS版のロジックに基づく）
    if (card.binding_values) {
      for (const binding of card.binding_values) {
        if (binding.key === 'photo_image_full_size_original' || 
            binding.key === 'thumbnail_image_original' ||
            binding.key === 'player_image_original') {
          if (binding.value?.image_value?.url) {
            return binding.value.image_value.url;
          }
        }
      }
    }
    return undefined;
  }

  private static assertTweetResult(result: UnknownRecord): TweetResult {
    return result as TweetResult;
  }

  private static mapParticipants(records: Array<Record<string, unknown>>): SpaceParticipant[] {
    return records
      .map(record => {
        const castRecord = record as UnknownRecord;
        const displayName = this.tryGetString(castRecord, 'display_name') ?? this.tryGetString(castRecord, 'name') ?? '';
        const screenName = this.tryGetString(castRecord, 'twitter_screen_name') ?? '';

        if (!displayName && !screenName) {
          return undefined;
        }

        return {
          displayName: displayName || screenName,
          twitterScreenName: screenName || displayName || '',
        };
      })
      .filter((participant): participant is SpaceParticipant => participant !== undefined);
  }

  private static tryGetString(source: UnknownRecord, key: string): string | undefined {
    const value = source[key];
    return typeof value === 'string' ? value : undefined;
  }

  private static toRecordArray(value: unknown): Array<Record<string, unknown>> {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null);
  }

  private static asRecord(value: unknown): UnknownRecord | undefined {
    if (value && typeof value === 'object') {
      return value as UnknownRecord;
    }
    return undefined;
  }

  private static isUnifiedCardMediaEntity(value: unknown): value is UnifiedCardMediaEntity {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const record = value as UnknownRecord;
    const type = record['type'];
    return type === 'video' || type === 'photo';
  }

  private static isUnifiedCardDestination(value: unknown): value is UnifiedCardDestinationObject {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const record = value as UnknownRecord;
    if (record['type'] !== 'browser') {
      return false;
    }
    const data = record['data'];
    if (!data || typeof data !== 'object') {
      return false;
    }
    return true;
  }
}
