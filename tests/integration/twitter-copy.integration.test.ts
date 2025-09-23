import { TwitterCopyBookmarklet, bootstrapBookmarklet } from '../../src/main';
import { LoadingManager } from '../../src/ui/loadingManager';

describe('Twitter Copy Bookmarklet Integration', () => {
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    
    // 基本的なDOM環境のセットアップ
    document.head.innerHTML = '';
    document.body.innerHTML = '<div id="react-root"></div>';
    
    // location mockの設定
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'x.com',
        pathname: '/testuser/status/1234567890'
      },
      writable: true
    });

    // 必要なスクリプト要素を追加
    const mockScript = document.createElement('script');
    mockScript.src = 'https://x.com/main.abc123.js';
    document.head.appendChild(mockScript);

    // webpackモックを設定（Bearerトークン用）
    (global as any).window.webpackChunk_twitter_responsive_web = [
      [
        ['main.abc123'],
        {
          'module-with-bearer': {
            toString: () => 'const token = "Bearer AAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDDDD"; export default token;'
          }
        }
      ]
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete (global as any).window.webpackChunk_twitter_responsive_web;
  });

  describe('基本的なツイートのコピー', () => {
    it('シンプルなツイートを正しくコピーする', async () => {
      const mockApiResponse = {
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
                              full_text: 'これは統合テスト用のツイートです',
                              display_text_range: [0, 16],
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      } as Response);

      const bookmarklet = new TwitterCopyBookmarklet(0);
      const result = await bookmarklet.copyTweet();

      expect(result).toContain('テストユーザー @testuser');
      expect(result).toContain('これは統合テスト用のツイートです');
      expect(result).toContain('x.com/testuser/status/1234567890');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(result);
    });
  });

  describe('NG回避機能のテスト', () => {
    it('NG回避レベル1でリダイレクトURLを生成する', async () => {
      const mockApiResponse = {
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
                              full_text: '拡散希望のメッセージです',
                              display_text_range: [0, 13],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023'
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'NGテストユーザー',
                                    screen_name: 'nguser'
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      } as Response);

      const bookmarklet = new TwitterCopyBookmarklet(1); // NG回避レベル1
      const result = await bookmarklet.copyTweet();

      expect(result).toContain('拡/散/希/望のメッセージです'); // NGワード置換
      expect(result).toContain('google.co.jp/url?q='); // リダイレクト処理
    });

    it('NG回避レベル2で画像URLをh抜きする', async () => {
      const mockApiResponse = {
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
                              display_text_range: [0, 7],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023',
                              extended_entities: {
                                media: [
                                  {
                                    type: 'photo',
                                    media_url_https: 'https://pbs.twimg.com/media/test.jpg',
                                    url: 'https://t.co/abcd1234'
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      } as Response);

      const bookmarklet = new TwitterCopyBookmarklet(2); // NG回避レベル2
      const result = await bookmarklet.copyTweet();

      expect(result).toContain('ttps://pbs.twimg.com/media/test.jpg'); // h抜き処理
    });
  });

  describe('メディア付きツイートのテスト', () => {
    it('動画付きツイートを正しく処理する', async () => {
      const mockApiResponse = {
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
                              full_text: '動画をシェアします',
                              display_text_range: [0, 9],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023',
                              extended_entities: {
                                media: [
                                  {
                                    type: 'video',
                                    media_url_https: 'https://pbs.twimg.com/video_thumb.jpg',
                                    video_info: {
                                      variants: [
                                        {
                                          content_type: 'video/mp4',
                                          bitrate: 832000,
                                          url: 'https://video.twimg.com/ext_tw_video/video.mp4?tag=10'
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      } as Response);

      const bookmarklet = new TwitterCopyBookmarklet(0);
      const result = await bookmarklet.copyTweet();

      expect(result).toContain('動画をシェアします');
      expect(result).toContain('video.twimg.com/ext_tw_video/video.mp4');
    });
  });

  describe('エラーハンドリングのテスト', () => {
    it('APIエラーの場合は適切にエラーを処理する', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const bookmarklet = new TwitterCopyBookmarklet(0);
      
      await expect(bookmarklet.copyTweet()).rejects.toThrow('Network error');
    });

    it('無効なツイートIDの場合はエラーをスロー', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'x.com',
          pathname: '/invalid/path'
        },
        writable: true
      });

      const bookmarklet = new TwitterCopyBookmarklet(0);
      
      await expect(bookmarklet.copyTweet()).rejects.toThrow('Tweet ID not found in URL');
    });

    it('Bearerトークンが見つからない場合はエラーをスロー', async () => {
      // webpackモックをクリアして空の状態に設定
      (global as any).window.webpackChunk_twitter_responsive_web = [];

      expect(() => {
        new TwitterCopyBookmarklet(0);
      }).toThrow('Bearer token not found');
    });
  });

  describe('ローディング管理のテスト', () => {
    it('ローディング表示が正しく制御される', async () => {
      const mockApiResponse = {
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
                              full_text: 'テストツイート',
                              display_text_range: [0, 5],
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

      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => mockApiResponse
          } as Response), 10)
        )
      );

      // ローディング要素が存在しないことを確認
      expect(document.querySelector('.loading-circle-animation')).toBeNull();
      
      // 手動でローディングを開始（ブラウザ環境ではグローバルスコープで自動実行される）
      LoadingManager.startLoading();
      
      const bookmarklet = new TwitterCopyBookmarklet(0);
      const promise = bookmarklet.copyTweet();
      
      // 非同期処理中はローディングが表示される
      await new Promise(resolve => setTimeout(resolve, 5));
      expect(document.querySelector('.loading-circle-animation')).toBeTruthy();
      
      await promise;
      
      // 完了後はローディングが除去される
      expect(document.querySelector('.loading-circle-animation')).toBeNull();
    });
  });

  describe('NG回避レベル0の特殊文字保持', () => {
    it('本文中の山括弧をエスケープせずに保持する', async () => {
      const mockApiResponse = {
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
                              full_text: '本文に &lt;angle brackets&gt; を含むテスト',
                              display_text_range: [0, 23],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023'
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'エンコードテスト',
                                    screen_name: 'encode_test'
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      } as Response);

      const bookmarklet = new TwitterCopyBookmarklet(0);
      const result = await bookmarklet.copyTweet();

      expect(result).toContain('本文に <angle brackets> を含むテスト');
      expect(result).not.toContain('&lt;angle brackets&gt;');
    });
  });

  describe('AudioSpace URL の重複除去', () => {
    it('本文側のスペースURLを出力しない', async () => {
      const spaceId = '1fakeSpace';

      const mockTweetResponse = {
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
                              full_text: '@HololiveP https://t.co/space\n\n#発売日まであと分だ！',
                              display_text_range: [0, 40],
                              created_at: 'Wed Oct 05 19:14:47 +0000 2023',
                              entities: {
                                urls: [
                                  {
                                    url: 'https://t.co/space',
                                    expanded_url: `https://x.com/i/spaces/${spaceId}`,
                                    display_url: `x.com/i/spaces/${spaceId}`,
                                  }
                                ]
                              }
                            },
                            core: {
                              user_results: {
                                result: {
                                  legacy: {
                                    id_str: 'user123',
                                    name: 'My_Hololive',
                                    screen_name: 'HololiveP'
                                  }
                                }
                              }
                            },
                            card: {
                              legacy: {
                                name: 'audiospace',
                                binding_values: [
                                  {
                                    key: 'id',
                                    value: {
                                      string_value: spaceId
                                    }
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

      const mockAudioSpaceResponse = {
        data: {
          audioSpace: {
            metadata: {
              title: '#発売日まであと分だ！',
              state: 'Running',
              started_at: '2025-09-23T14:55:00Z',
              scheduled_start: null,
              updated_at: '2025-09-23T15:20:00Z',
              is_space_available_for_replay: true,
            },
            participants: {
              admins: [
                {
                  display_name: 'Alice',
                  twitter_screen_name: 'alice',
                }
              ],
              speakers: [
                {
                  display_name: 'Bob',
                  twitter_screen_name: 'bob',
                }
              ]
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTweetResponse
      } as Response);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAudioSpaceResponse
      } as Response);

      const bookmarklet = new TwitterCopyBookmarklet(0);
      const result = await bookmarklet.copyTweet();

      expect(result).not.toContain(`https://twitter.com/i/spaces/${spaceId}`);
      expect(result).not.toContain('<Twitter Space>');
      const matches = result.match(new RegExp(`https://x.com/i/spaces/${spaceId}`, 'g')) || [];
      expect(matches.length).toBe(1);
    });
  });
});

describe('ブートストラップ処理', () => {
  it('LoadingManager を起動し copyTweet を呼び出す', async () => {
    const copyTweetSpy = jest
      .spyOn(TwitterCopyBookmarklet.prototype, 'copyTweet')
      .mockResolvedValue('copied text');
    const loadingSpy = jest.spyOn(LoadingManager, 'startLoading');

    const result = await bootstrapBookmarklet(0);

    expect(loadingSpy).toHaveBeenCalled();
    expect(copyTweetSpy).toHaveBeenCalled();
    expect(result).toBe('copied text');

    copyTweetSpy.mockRestore();
    loadingSpy.mockRestore();
  });
});
