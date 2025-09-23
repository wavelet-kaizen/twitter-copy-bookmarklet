export interface TwitterTokens {
  bearerToken: string;
  csrfToken?: string;
  guestToken?: string;
  twitterId?: string;
}

export interface TweetData {
  id: string;
  text: string;
  createdAt: Date;
  author: UserData;
  media?: MediaItem[];
  poll?: PollData;
  audioSpace?: AudioSpaceData;
  quotedTweet?: TweetData;
  replyTo?: string[];
  conversationPolicy?: 'community' | 'by_invitation';
  videoUrls?: string[]; // 元のJS版のvideourl配列に対応
  additionalMedia?: {
    url: string;
    title: string;
  };
}

export interface UserData {
  id: string;
  name: string;
  screenName: string;
}

export interface MediaItem {
  type: 'photo' | 'video' | 'animated_gif';
  url: string;
  altText?: string;
  thumbnailUrl?: string;
}

export interface PollData {
  choices: PollChoice[];
  endTime?: Date;
  isEnded: boolean;
  lastUpdated?: Date;
}

export interface PollChoice {
  text: string;
  votes: number;
}

export interface AudioSpaceData {
  id: string;
  title?: string;
  state: 'Ended' | 'TimedOut' | 'Running' | 'NotStarted';
  startedAt?: Date;
  scheduledStart?: Date;
  updatedAt?: Date;
  isRecording: boolean;
  admins: SpaceParticipant[];
  speakers: SpaceParticipant[];
}

export interface SpaceParticipant {
  displayName: string;
  twitterScreenName: string;
}

export interface NGSettings {
  level: 0 | 1 | 2 | 3;
  removeEmoji: boolean;
  trimBlankLine: number;
  ngUrls: RegExp[];
  ngWords: NGWordRule[];
  ngQueryParams: RegExp[];
  ngDomains: (string | RegExp)[];
  replaceEmoji: EmojiReplacement[];
  unicodeOffset: [RegExp, number][];
}

export interface NGWordRule {
  before: RegExp;
  after: string;
}

export interface EmojiReplacement {
  before: RegExp;
  after: string;
}

export interface TwitterApiResponse {
  data: {
    threaded_conversation_with_injections_v2?: {
      instructions?: Array<Record<string, unknown>>;
    };
    tweetResult?: {
      result?: Record<string, unknown>;
    };
    tweetResultByRestId?: {
      result?: Record<string, unknown>;
    };
  };
}

export interface AudioSpaceApiResponse {
  data: {
    audioSpace: {
      metadata: {
        title?: string;
        state: string;
        started_at?: string;
        scheduled_start?: string;
        updated_at?: string;
        is_space_available_for_replay: boolean;
      };
      participants: {
        admins: Array<Record<string, unknown>>;
        speakers: Array<Record<string, unknown>>;
      };
    };
  };
}

export interface ProcessorOptions {
  ngSettings: NGSettings;
  isMobile: boolean;
  domain: string;
}
