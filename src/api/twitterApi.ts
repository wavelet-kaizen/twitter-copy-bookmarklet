import { TwitterTokens, TwitterApiResponse, AudioSpaceApiResponse } from '../types';

const AUTHENTICATED_TWEET_DETAIL_QUERY_ID = '-Ls3CrSQNo2fRKH6i6Na1A';
const GUEST_TWEET_DETAIL_QUERY_ID = 'wqi5M7wZ7tW-X9S2t-Mqcg';

export class TwitterApiClient {
  private tokens: TwitterTokens;
  private domain: string;

  constructor(tokens: TwitterTokens, domain: string = window.location.hostname) {
    this.tokens = tokens;
    this.domain = domain;
  }

  /**
   * 郢昴・縺・ｹ晢ｽｼ郢晞メ・ｩ・ｳ驍擾ｽｰ隲繝ｻ・ｰ・ｱ郢ｧ雋槫徐陟輔・   */
  async fetchTweetDetail(tweetId: string): Promise<TwitterApiResponse> {
    if (this.isAuthenticated()) {
      try {
        return await this.fetchAuthenticatedTweetDetail(tweetId);
      } catch (error) {
        console.warn('Authenticated TweetDetail request failed; attempting guest fallback.', error);
        if (!this.canUseGuestMode()) {
          throw error;
        }
      }
    }

    return this.fetchGuestTweetDetail(tweetId);
  }

  private isAuthenticated(): boolean {
    return Boolean(this.tokens.csrfToken);
  }

  private canUseGuestMode(): boolean {
    return Boolean(this.tokens.bearerToken);
  }

  private async fetchAuthenticatedTweetDetail(tweetId: string): Promise<TwitterApiResponse> {
    const variables = {
      focalTweetId: tweetId,
      cursor: '',
      referrer: 'tweet',
      with_rux_injections: false,
      includePromotedContent: true,
      withCommunity: true,
      withQuickPromoteEligibilityTweetFields: true,
      withBirdwatchNotes: true,
      withVoice: true,
      withV2Timeline: true
    };

    const features = {
      rweb_lists_timeline_redesign_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: false,
      tweet_awards_web_tipping_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_media_download_video_enabled: false,
      responsive_web_enhance_cards_enabled: false
    };

    const fieldToggles = {
      withAuxiliaryUserLabels: false,
      withArticleRichContentState: false,
    };

    const url = `https://${this.domain}/i/api/graphql/${AUTHENTICATED_TWEET_DETAIL_QUERY_ID}/TweetDetail` +
      `?variables=${encodeURIComponent(JSON.stringify(variables))}` +
      `&features=${encodeURIComponent(JSON.stringify(features))}` +
      `&fieldToggles=${encodeURIComponent(JSON.stringify(fieldToggles))}`;

    const response = await this.makeRequest(url);
    return response.json();
  }

  private async fetchGuestTweetDetail(tweetId: string): Promise<TwitterApiResponse> {
    const guestToken = await this.ensureGuestToken();
    if (!guestToken) {
      throw new Error('Guest token acquisition failed');
    }

    const variables = {
      tweetId,
      withCommunity: false,
      includePromotedContent: false,
      withVoice: false
    };

    const features = {
      creator_subscriptions_tweet_preview_api_enabled: true,
      premium_content_api_read_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      responsive_web_grok_analyze_button_fetch_trends_enabled: false,
      responsive_web_grok_analyze_post_followups_enabled: false,
      responsive_web_jetfuel_frame: true,
      responsive_web_grok_share_attachment_enabled: true,
      articles_preview_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      responsive_web_grok_show_grok_translated_post: false,
      responsive_web_grok_analysis_button_from_backend: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      payments_enabled: false,
      profile_label_improvements_pcf_label_in_post_enabled: true,
      rweb_tipjar_consumption_enabled: true,
      verified_phone_label_enabled: false,
      responsive_web_grok_image_annotation_enabled: true,
      responsive_web_grok_imagine_annotation_enabled: true,
      responsive_web_grok_community_note_auto_translation_is_enabled: false,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_enhance_cards_enabled: false
    };

    const fieldToggles = {
      withArticleRichContentState: true,
      withArticlePlainText: false,
      withGrokAnalyze: false,
      withDisallowedReplyControls: false
    };

    const baseUrl = this.getGuestGraphqlBaseUrl();
    const url = `${baseUrl}/${GUEST_TWEET_DETAIL_QUERY_ID}/TweetResultByRestId` +
      `?variables=${encodeURIComponent(JSON.stringify(variables))}` +
      `&features=${encodeURIComponent(JSON.stringify(features))}` +
      `&fieldToggles=${encodeURIComponent(JSON.stringify(fieldToggles))}`;

    const response = await this.makeRequest(url, {}, true, { forceGuest: true });
    return response.json();
  }

  private async ensureGuestToken(): Promise<string | undefined> {
    if (this.tokens.guestToken) {
      return this.tokens.guestToken;
    }

    const guestToken = await this.activateGuestSession();
    this.tokens.guestToken = guestToken;
    return guestToken;
  }

  private async activateGuestSession(): Promise<string> {
    const activationUrl = this.getGuestActivationUrl();
    const response = await this.makeRequest(activationUrl, {
      method: 'POST',
      body: '{}'
    }, false);

    const json = await response.json() as { guest_token?: string };
    if (!json.guest_token) {
      throw new Error('Guest token missing in activation response');
    }
    return json.guest_token;
  }

  private getGuestGraphqlBaseUrl(): string {
    return 'https://api.x.com/graphql';
  }

  private getGuestActivationUrl(): string {
    return 'https://api.x.com/1.1/guest/activate.json';
  }

  private getBaseDomain(): string {
    const segments = this.domain.split('.');
    if (segments.length <= 2) {
      return this.domain;
    }
    return segments.slice(-2).join('.');
  }

  /**
   * AudioSpace隲繝ｻ・ｰ・ｱ郢ｧ雋槫徐陟輔・   */
  async fetchAudioSpace(audioSpaceId: string, queryId: string): Promise<AudioSpaceApiResponse> {
    const guestToken = this.isAuthenticated() ? undefined : await this.ensureGuestToken();
    if (!this.isAuthenticated() && !guestToken) {
      console.warn('Guest token not available for AudioSpace request');
    }

    const variables = {
      id: audioSpaceId,
      isMetatagsQuery: false,
      withReplays: true,
      withListeners: true
    };

    const features = {
      spaces_2022_h2_spaces_communities: true,
      spaces_2022_h2_clipping: true,
      creator_subscriptions_tweet_preview_api_enabled: true,
      payments_enabled: false,
      rweb_xchat_enabled: true,
      profile_label_improvements_pcf_label_in_post_enabled: true,
      rweb_tipjar_consumption_enabled: true,
      verified_phone_label_enabled: false,
      premium_content_api_read_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      responsive_web_grok_analyze_button_fetch_trends_enabled: false,
      responsive_web_grok_analyze_post_followups_enabled: true,
      responsive_web_jetfuel_frame: true,
      responsive_web_grok_share_attachment_enabled: true,
      articles_preview_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      responsive_web_grok_show_grok_translated_post: false,
      responsive_web_grok_analysis_button_from_backend: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_grok_image_annotation_enabled: true,
      responsive_web_grok_imagine_annotation_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_grok_community_note_auto_translation_is_enabled: false,
      responsive_web_enhance_cards_enabled: false
    };

    const baseUrl = this.isAuthenticated()
      ? 'https://x.com/i/api/graphql'
      : this.getGuestGraphqlBaseUrl();

    const url = `${baseUrl}/${queryId}/AudioSpaceById` +
      `?variables=${encodeURIComponent(JSON.stringify(variables))}` +
      `&features=${encodeURIComponent(JSON.stringify(features))}`;

    const response = await this.makeRequest(url);
    return response.json();
  }

  /**
   * VMAP陷肴・蛻､郢晁ｼ斐＜郢ｧ・､郢晢ｽｫ隲繝ｻ・ｰ・ｱ郢ｧ雋槫徐陟輔・   */
  async fetchVmapData(vmapUrl: string): Promise<string[]> {
    try {
      const response = await fetch(vmapUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      
      const videoVariants = Array.from(xml.getElementsByTagName('tw:videoVariant'))
        .filter(element => element.getAttribute('content_type') === 'video/mp4');
      
      if (videoVariants.length === 0) {
        return [];
      }
      
      const bitrates = videoVariants
        .map(element => parseInt(element.getAttribute('bit_rate') || '0'))
        .sort((a, b) => a - b);
      
      const lowestBitrate = bitrates[0];
      const targetVariant = videoVariants.find(
        element => parseInt(element.getAttribute('bit_rate') || '0') === lowestBitrate
      );
      
      const videoUrl = targetVariant?.getAttribute('url');
      return videoUrl ? [decodeURIComponent(videoUrl)] : [];
      
    } catch (error) {
      console.error('VMAP data fetch failed:', error);
      return [];
    }
  }

  private async makeRequest(
    url: string,
    options: RequestInit = {},
    allowGuestRetry = true,
    requestContext: { forceGuest?: boolean } = {}
  ): Promise<Response> {
    const requestUrl = new URL(url);
    const extraHeaders = this.normalizeHeaders(options.headers);
    const headers: Record<string, string> = {
      'accept': '*/*',
      'accept-language': this.resolveAcceptLanguage(),
      'content-type': 'application/json',
      'x-twitter-active-user': 'yes',
      'x-twitter-client-language': this.resolveClientLanguage(),
      ...extraHeaders
    };

    const forceGuest = Boolean(requestContext.forceGuest);

    if (this.tokens.bearerToken) {
      headers['authorization'] = this.tokens.bearerToken;
    }

    if (this.tokens.csrfToken) {
      headers['x-csrf-token'] = this.tokens.csrfToken;
    }

    if (forceGuest) {
      if (this.tokens.guestToken) {
        headers['x-guest-token'] = this.tokens.guestToken;
      }
    } else if (this.tokens.twitterId) {
      headers['x-twitter-auth-type'] = 'OAuth2Session';
    } else if (this.tokens.guestToken) {
      headers['x-guest-token'] = this.tokens.guestToken;
    }

    if ((forceGuest || !this.isAuthenticated()) && this.tokens.guestToken && this.isSameSiteRequest(requestUrl)) {
      headers['x-client-transaction-id'] = headers['x-client-transaction-id'] || this.generateClientTransactionId();
      headers['x-xp-forwarded-for'] = headers['x-xp-forwarded-for'] || this.generateForwardedForToken();
    }

    const requestInit: RequestInit = {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include'
    };

    const response = await fetch(url, requestInit);

    if (!response) {
      throw new Error('Network error');
    }

    if (!response.ok) {
      if (allowGuestRetry && !this.isAuthenticated() && await this.refreshGuestToken()) {
        return this.makeRequest(url, { ...options, headers: extraHeaders }, false, requestContext);
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    if (allowGuestRetry && !this.isAuthenticated() && this.isJsonResponse(response)) {
      try {
        const clonedResponse = response.clone();
        const payload = await clonedResponse.json();
        if (this.containsInvalidGuestTokenError(payload) && await this.refreshGuestToken()) {
          return this.makeRequest(url, { ...options, headers: extraHeaders }, false, requestContext);
        }
      } catch (error) {
        console.debug('Guest token validation failed:', error);
      }
    }

    return response;
  }

  private resolveAcceptLanguage(): string {
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
      return navigator.languages
        .map((lang, index) => (index === 0 ? lang : `${lang};q=${Math.max(0, Math.min(1, 1 - index * 0.1)).toFixed(1)}`))
        .join(',');
    }
    return navigator.language || 'en-US';
  }

  private resolveClientLanguage(): string {
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
      return navigator.languages[0];
    }
    return navigator.language || 'en';
  }

  private isSameSiteRequest(url: URL): boolean {
    const baseDomain = this.getBaseDomain();
    return url.hostname === this.domain || url.hostname.endsWith(`.${baseDomain}`);
  }

  private generateClientTransactionId(): string {
    const bytes = this.getRandomBytes(32);
    return this.encodeBase64(bytes);
  }

  private generateForwardedForToken(): string {
    const bytes = this.getRandomBytes(64);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private getRandomBytes(length: number): Uint8Array {
    const globalObject = typeof globalThis !== 'undefined' ? (globalThis as unknown as { crypto?: Crypto }) : {};
    const cryptoApi = globalObject.crypto;
    if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
      const array = new Uint8Array(length);
      cryptoApi.getRandomValues(array);
      return array;
    }

    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }

  private encodeBase64(bytes: Uint8Array): string {
    const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');

    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return window.btoa(binary).replace(/=+$/, '');
    }

    const globalBtoa = typeof globalThis !== 'undefined'
      ? (globalThis as unknown as { btoa?: (data: string) => string }).btoa
      : undefined;

    if (typeof globalBtoa === 'function') {
      return globalBtoa(binary).replace(/=+$/, '');
    }

    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private async refreshGuestToken(): Promise<boolean> {
    if (this.isAuthenticated()) {
      return false;
    }

    try {
      this.tokens.guestToken = undefined;
      const guestToken = await this.activateGuestSession();
      this.tokens.guestToken = guestToken;
      return true;
    } catch (error) {
      console.error('Guest token refresh failed:', error);
      return false;
    }
  }

  private isJsonResponse(response: Response): boolean {
    const contentType = response.headers.get('content-type') || '';
    return contentType.toLowerCase().includes('application/json');
  }

  private containsInvalidGuestTokenError(payload: unknown): boolean {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const errors = (payload as { errors?: Array<Record<string, unknown>> }).errors;
    if (!Array.isArray(errors)) {
      return false;
    }

    return errors.some(error => {
      if (!error || typeof error !== 'object') {
        return false;
      }

      const code = 'code' in error ? Number((error as { code?: unknown }).code) : undefined;
      const message = 'message' in error ? String((error as { message?: unknown }).message || '') : '';

      if (code === 239) {
        return true;
      }

      return message.toLowerCase().includes('bad guest token');
    });
  }

  private normalizeHeaders(headers?: HeadersInit): Record<string, string> {
    if (!headers) {
      return {};
    }

    if (headers instanceof Headers) {
      const entries: Record<string, string> = {};
      headers.forEach((value, key) => {
        entries[key] = value;
      });
      return entries;
    }

    if (Array.isArray(headers)) {
      return headers.reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    }

    return { ...(headers as Record<string, string>) };
  }
}
