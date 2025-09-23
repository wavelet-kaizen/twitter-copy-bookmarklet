import { TweetParser } from '../../../src/parsers/tweetParser';
import { TwitterApiResponse } from '../../../src/types';

describe('TweetParser guest response', () => {
  it('parses responses that only provide tweetResult', () => {
    const guestResult: Record<string, unknown> = {
      legacy: {
        id_str: '9876543210',
        full_text: 'guest tweet with url https://t.co/guest',
        created_at: 'Wed Oct 11 10:10:10 +0000 2023',
        entities: {
          urls: [
            {
              url: 'https://t.co/guest',
              expanded_url: 'https://example.com/guest'
            }
          ]
        }
      },
      core: {
        user_results: {
          result: {
            legacy: {
              id_str: 'guest-user',
              name: 'Guest User',
              screen_name: 'guestuser'
            }
          }
        }
      }
    };

    const guestResponse: TwitterApiResponse = {
      data: {
        tweetResult: {
          result: guestResult
        }
      }
    };

    const result = TweetParser.parseTweet(guestResponse, '9876543210');

    expect(result.id).toBe('9876543210');
    expect(result.text).toBe('guest tweet with url https://example.com/guest');
    expect(result.author.name).toBe('Guest User');
    expect(result.author.screenName).toBe('guestuser');
  });
});
