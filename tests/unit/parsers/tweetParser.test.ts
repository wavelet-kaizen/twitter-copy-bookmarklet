import { TweetParser } from '../../../src/parsers/tweetParser';
import { TwitterApiResponse, AudioSpaceApiResponse } from '../../../src/types';

describe('TweetParser', () => {
  const mockApiResponse: TwitterApiResponse = {
    data: {
      threaded_conversation_with_injections_v2: {
        instructions: [
          {
            type: 'TimelineAddEntries',
            entries: [
              {
                entryId: 'tweet-1234567890',
                content: {
                  itemContent: {
                    tweet_results: {
                      result: {
                        legacy: {
                          id_str: '1234567890',
                          full_text: 'これはテストツイートです https://t.co/example',
                          display_text_range: [0, 40],
                          created_at: 'Wed Oct 05 19:14:47 +0000 2023',
                          entities: {
                            urls: [{
                              url: 'https://t.co/example',
                              expanded_url: 'https://example.com/article'
                            }]
                          },
                          in_reply_to_screen_name: 'replieduser'
                        },
                        core: {
                          user_results: {
                            result: {
                              legacy: {
                                id_str: 'user123',
                                name: 'テストユーザー',
                                screen_name: 'testuser'
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  };

  describe('parseTweet', () => {
    it('基本的なツイートデータを正しく解析する', () => {
      const result = TweetParser.parseTweet(mockApiResponse, '1234567890');

      expect(result.id).toBe('1234567890');
      expect(result.text).toBe('これはテストツイートです https://example.com/article');
      expect(result.author.name).toBe('テストユーザー');
      expect(result.author.screenName).toBe('testuser');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.replyTo).toContain('@replieduser');
    });

    it('長文ツイートのテキストを正しく抽出する', () => {
      const longTextResponse = {
        ...mockApiResponse,
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: [
              {
                type: 'TimelineAddEntries',
                entries: [
                  {
                    entryId: 'tweet-1234567890',
                    content: {
                      itemContent: {
                        tweet_results: {
                          result: {
                            legacy: {
                              id_str: '1234567890',
                              full_text: 'これは短縮テキスト...',
                              display_text_range: [0, 10],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023'
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'テストユーザー',
                                    screen_name: 'testuser'
                                  }
                                }
                              }
                            },
                            note_tweet: {
                              note_tweet_results: {
                                result: {
                                  text: 'これは長文ツイートの完全なテキストです。140文字を超える内容が含まれています。'
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      const result = TweetParser.parseTweet(longTextResponse, '1234567890');

      expect(result.text).toBe('これは長文ツイートの完全なテキストです。140文字を超える内容が含まれています。');
    });

    it('メディア情報を正しく解析する', () => {
      const mediaResponse = {
        ...mockApiResponse,
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: [
              {
                type: 'TimelineAddEntries',
                entries: [
                  {
                    entryId: 'tweet-1234567890',
                    content: {
                      itemContent: {
                        tweet_results: {
                          result: {
                            legacy: {
                              id_str: '1234567890',
                              full_text: '画像付きツイート',
                              display_text_range: [0, 8],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023',
                              extended_entities: {
                                media: [
                                  {
                                    type: 'photo',
                                    media_url_https: 'https://pbs.twimg.com/image.jpg',
                                    ext_alt_text: '画像の説明'
                                  },
                                  {
                                    type: 'video',
                                    media_url_https: 'https://pbs.twimg.com/video_thumb.jpg',
                                    video_info: {
                                      variants: [
                                        {
                                          content_type: 'video/mp4',
                                          bitrate: 320000,
                                          url: 'https://video.twimg.com/low.mp4?tag=123'
                                        },
                                        {
                                          content_type: 'video/mp4',
                                          bitrate: 832000,
                                          url: 'https://video.twimg.com/high.mp4?tag=123'
                                        }
                                      ]
                                    }
                                  }
                                ]
                              }
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'テストユーザー',
                                    screen_name: 'testuser'
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      const result = TweetParser.parseTweet(mediaResponse, '1234567890');

      expect(result.media).toHaveLength(1);
      expect(result.media?.[0]?.type).toBe('photo');
      expect(result.media?.[0]?.url).toBe('https://pbs.twimg.com/image.jpg');
      expect(result.media?.[0]?.altText).toBe('画像の説明');
      
      // 動画はvideoUrls配列に含まれる（最高品質）
      expect(result.videoUrls).toHaveLength(1);
      expect(result.videoUrls?.[0]).toContain('https://video.twimg.com/high.mp4');
    });

    it('投票情報を正しく解析する', () => {
      const pollResponse = {
        ...mockApiResponse,
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: [
              {
                type: 'TimelineAddEntries',
                entries: [
                  {
                    entryId: 'tweet-1234567890',
                    content: {
                      itemContent: {
                        tweet_results: {
                          result: {
                            legacy: {
                              id_str: '1234567890',
                              full_text: '投票してください',
                              display_text_range: [0, 7],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023'
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'テストユーザー',
                                    screen_name: 'testuser'
                                  }
                                }
                              }
                            },
                            card: {
                              legacy: {
                                name: 'poll2choice_text_only',
                                binding_values: [
                                  {
                                    key: 'choice1_label',
                                    value: { string_value: '選択肢A' },
                                  },
                                  {
                                    key: 'choice1_count',
                                    value: { string_value: '150' },
                                  },
                                  {
                                    key: 'choice2_label',
                                    value: { string_value: '選択肢B' },
                                  },
                                  {
                                    key: 'choice2_count',
                                    value: { string_value: '100' },
                                  },
                                  {
                                    key: 'end_datetime_utc',
                                    value: { string_value: '2023-10-06T19:14:47.000Z' },
                                  },
                                  {
                                    key: 'counts_are_final',
                                    value: { boolean_value: false },
                                  }
                                ]
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      const result = TweetParser.parseTweet(pollResponse, '1234567890');

      expect(result.poll).toBeDefined();
      expect(result.poll?.choices).toHaveLength(2);
      expect(result.poll?.choices[0]?.text).toBe('選択肢A');
      expect(result.poll?.choices[0]?.votes).toBe(150);
      expect(result.poll?.choices[1]?.text).toBe('選択肢B');
      expect(result.poll?.choices[1]?.votes).toBe(100);
      expect(result.poll?.isEnded).toBe(false);
    });
  });

  describe('parseAudioSpace', () => {
    const mockAudioSpaceResponse: AudioSpaceApiResponse = {
      data: {
        audioSpace: {
          metadata: {
            title: 'テストスペース',
            state: 'Running',
            started_at: '2023-10-05T19:14:47.000Z',
            is_space_available_for_replay: true
          },
          participants: {
            admins: [
              {
                display_name: 'スペースホスト',
                twitter_screen_name: 'spacehost'
              }
            ],
            speakers: [
              {
                display_name: 'スピーカー1',
                twitter_screen_name: 'speaker1'
              }
            ]
          }
        }
      }
    };

    it('AudioSpaceデータを正しく解析する', () => {
      const result = TweetParser.parseAudioSpace(mockAudioSpaceResponse);

      expect(result.title).toBe('テストスペース');
      expect(result.state).toBe('Running');
      expect(result.startedAt).toBeInstanceOf(Date);
      expect(result.isRecording).toBe(true);
      expect(result.admins).toHaveLength(1);
      expect(result.admins[0]?.displayName).toBe('スペースホスト');
      expect(result.admins[0]?.twitterScreenName).toBe('spacehost');
      expect(result.speakers).toHaveLength(1);
    });
  });

  describe('URL parameter handling', () => {
    it('UTMパラメータを含むURLを正しく処理する', () => {
      const urlWithUtmResponse = {
        ...mockApiResponse,
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: [
              {
                type: 'TimelineAddEntries',
                entries: [
                  {
                    entryId: 'tweet-1234567890',
                    content: {
                      itemContent: {
                        tweet_results: {
                          result: {
                            legacy: {
                              id_str: '1234567890',
                              full_text: 'Check this link https://t.co/test',
                              display_text_range: [0, 35],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023',
                              entities: {
                                urls: [{
                                  url: 'https://t.co/test',
                                  expanded_url: 'https://mugen-infy.fanbox.cc/posts/8664507?utm_campaign=manage_post_page&utm_medium=share&utm_source=twitter'
                                }]
                              }
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'テストユーザー',
                                    screen_name: 'testuser'
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      const result = TweetParser.parseTweet(urlWithUtmResponse, '1234567890');

      // UTMパラメータが除去されることを確認
      expect(result.text).toBe('Check this link https://mugen-infy.fanbox.cc/posts/8664507');
    });

    it('複数のNGパラメータを含むURLを正しく処理する', () => {
      const multiParamResponse = {
        ...mockApiResponse,
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: [
              {
                type: 'TimelineAddEntries',
                entries: [
                  {
                    entryId: 'tweet-1234567890',
                    content: {
                      itemContent: {
                        tweet_results: {
                          result: {
                            legacy: {
                              id_str: '1234567890',
                              full_text: 'Multiple params https://t.co/multi',
                              display_text_range: [0, 37],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023',
                              entities: {
                                urls: [{
                                  url: 'https://t.co/multi',
                                  expanded_url: 'https://example.com/article?utm_campaign=test&utm_medium=social&utm_source=twitter&ref=test&fbclid=abc123&gclid=xyz789'
                                }]
                              }
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'テストユーザー',
                                    screen_name: 'testuser'
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      const result = TweetParser.parseTweet(multiParamResponse, '1234567890');

      // UTMパラメータのみが除去される（ref, fbclid, gclidは元々NGパラメータではない）
      expect(result.text).toBe('Multiple params https://example.com/article?ref=test&fbclid=abc123&gclid=xyz789');
    });

    it('長文ツイートのURLパラメータも正しく処理する', () => {
      const longTweetUrlResponse = {
        ...mockApiResponse,
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: [
              {
                type: 'TimelineAddEntries',
                entries: [
                  {
                    entryId: 'tweet-1234567890',
                    content: {
                      itemContent: {
                        tweet_results: {
                          result: {
                            legacy: {
                              id_str: '1234567890',
                              full_text: 'Short text https://t.co/long',
                              display_text_range: [0, 30],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023'
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'テストユーザー',
                                    screen_name: 'testuser'
                                  }
                                }
                              }
                            },
                            note_tweet: {
                              note_tweet_results: {
                                result: {
                                  text: 'This is a long tweet with URL https://t.co/long that should be processed.',
                                  entity_set: {
                                    urls: [{
                                      url: 'https://t.co/long',
                                      expanded_url: 'https://blog.example.com/post/123?utm_campaign=share&utm_medium=twitter&utm_source=social'
                                    }]
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      const result = TweetParser.parseTweet(longTweetUrlResponse, '1234567890');

      // 長文ツイートでもUTMパラメータが除去されることを確認
      expect(result.text).toBe('This is a long tweet with URL https://blog.example.com/post/123 that should be processed.');
    });

    it('NGレベル0の場合はリダイレクト処理を行わない', () => {
      const ngLevel1Response = {
        ...mockApiResponse,
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: [
              {
                type: 'TimelineAddEntries',
                entries: [
                  {
                    entryId: 'tweet-1234567890',
                    content: {
                      itemContent: {
                        tweet_results: {
                          result: {
                            legacy: {
                              id_str: '1234567890',
                              full_text: 'Normal domain https://t.co/ng',
                              display_text_range: [0, 31],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023',
                              entities: {
                                urls: [{
                                  url: 'https://t.co/ng',
                                  expanded_url: 'https://seiga.nicovideo.jp/seiga/12345'
                                }]
                              }
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'テストユーザー',
                                    screen_name: 'testuser'
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      const result = TweetParser.parseTweet(ngLevel1Response, '1234567890');

      // NGレベル0（デフォルト）なのでリダイレクト処理は行われない
      expect(result.text).toBe('Normal domain https://seiga.nicovideo.jp/seiga/12345');
    });

    it('パラメータなしのURLは変更されない', () => {
      const cleanUrlResponse = {
        ...mockApiResponse,
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: [
              {
                type: 'TimelineAddEntries',
                entries: [
                  {
                    entryId: 'tweet-1234567890',
                    content: {
                      itemContent: {
                        tweet_results: {
                          result: {
                            legacy: {
                              id_str: '1234567890',
                              full_text: 'Clean URL https://t.co/clean',
                              display_text_range: [0, 30],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023',
                              entities: {
                                urls: [{
                                  url: 'https://t.co/clean',
                                  expanded_url: 'https://example.com/clean-article'
                                }]
                              }
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'テストユーザー',
                                    screen_name: 'testuser'
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      const result = TweetParser.parseTweet(cleanUrlResponse, '1234567890');

      // パラメータなしのURLはそのまま
      expect(result.text).toBe('Clean URL https://example.com/clean-article');
    });
  });

  describe('実際のAPIレスポンステスト', () => {
    it('実際のツイートAPIレスポンスを正しく解析する', () => {
      // 提供されたAPIレスポンスの構造をテスト
      const realApiResponse = {
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: [
              {
                type: 'TimelineAddEntries',
                entries: [
                  {
                    entryId: 'tweet-1694998058734379067',
                    content: {
                      itemContent: {
                        tweet_results: {
                          result: {
                            legacy: {
                              id_str: '1694998058734379067',
                              full_text: 'ゴ〇ジェットって本当に効果あるんですか！？\n#ぼごらじお\n\nYouTube(shorts)\nhttps://t.co/GEwrICQ2Sn\n\n切り抜き元動画\nhttps://t.co/sxnlrRQpPI https://t.co/awhnpm9CVL',
                              display_text_range: [0, 102],
                              created_at: 'Fri Aug 25 09:00:03 +0000 2023',
                              entities: {
                                urls: [
                                  {
                                    url: 'https://t.co/GEwrICQ2Sn',
                                    expanded_url: 'https://youtube.com/shorts/t-sVnV5fxwQ?feature=share'
                                  },
                                  {
                                    url: 'https://t.co/sxnlrRQpPI',
                                    expanded_url: 'https://youtu.be/9Q--KAEbiu8'
                                  }
                                ]
                              },
                              extended_entities: {
                                media: [
                                  {
                                    type: 'video',
                                    media_url_https: 'https://pbs.twimg.com/ext_tw_video_thumb/1693374237556580353/pu/img/9zJiU-HUPrddLX1B.jpg',
                                    video_info: {
                                      variants: [
                                        {
                                          content_type: 'video/mp4',
                                          bitrate: 632000,
                                          url: 'https://video.twimg.com/ext_tw_video/1693374237556580353/pu/vid/320x568/KOru9ZnQ84MQRGCh.mp4?tag=12'
                                        },
                                        {
                                          content_type: 'video/mp4',
                                          bitrate: 2176000,
                                          url: 'https://video.twimg.com/ext_tw_video/1693374237556580353/pu/vid/720x1280/K47Yr3KxetllqEia.mp4?tag=12'
                                        }
                                      ]
                                    }
                                  }
                                ]
                              }
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: '987644347150614534',
                                    name: 'あくまのゴート',
                                    screen_name: 'akumano_goat'
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      const result = TweetParser.parseTweet(realApiResponse, '1694998058734379067');

      expect(result.id).toBe('1694998058734379067');
      expect(result.text).toContain('ゴ〇ジェットって本当に効果あるんですか！？');
      expect(result.text).toContain('#ぼごらじお');
      expect(result.text).toContain('YouTube(shorts)');
      expect(result.text).toContain('切り抜き元動画');
      expect(result.author.name).toBe('あくまのゴート');
      expect(result.author.screenName).toBe('akumano_goat');
      expect(result.media).toHaveLength(0); // 動画はmediaに含まれない
      
      // 動画はvideoUrls配列に含まれる（最高品質）
      expect(result.videoUrls).toHaveLength(1);
      expect(result.videoUrls?.[0]).toContain('720x1280');
    });
  });

  describe('エラーハンドリング', () => {
    it('ツイートが見つからない場合はエラーをスロー', () => {
      const emptyResponse: TwitterApiResponse = {
        data: {
          threaded_conversation_with_injections_v2: {
            instructions: []
          }
        }
      };

      expect(() => {
        TweetParser.parseTweet(emptyResponse, 'nonexistent');
      }).toThrow('Tweet entry not found for ID: nonexistent');
    });
  });
});
