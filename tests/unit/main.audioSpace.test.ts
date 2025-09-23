import { TwitterCopyBookmarklet } from '@/main';

const createBookmarklet = () => {
  const instance: any = Object.create(TwitterCopyBookmarklet.prototype);

  instance.textProcessor = {
    processText: (input: string) => input,
    trimBlankLines: (input: string) => input,
  };

  instance.urlProcessor = {
    processVideoUrl: (input: string) => input,
    processImageUrl: (input: string) => input,
    createTweetUrl: (screenName: string, tweetId: string) => `https://x.com/${screenName}/status/${tweetId}`,
  };

  instance.formatTime = (date: Date) => {
    const pad = (value: number) => value.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  instance.formatDate = () => '2024/01/01 00:00:00';

  return instance;
};

describe('TwitterCopyBookmarklet formatAudioSpace', () => {
  it('終了済みスペースでは配信終了と録画状態のみを表示する', () => {
    const bookmarklet = createBookmarklet() as any;
    const space = {
      id: '1fakeSpace',
      title: 'Taking a bath and eating (at the same time)',
      state: 'Ended',
      isRecording: false,
      admins: [],
      speakers: [],
    };

    const result = bookmarklet.formatAudioSpace(space);

    expect(result).toBe('[配信終了][録画なし] Taking a bath and eating (at the same time)\nhttps://x.com/i/spaces/1fakeSpace\n');
    expect(result).not.toContain('ホスト：');
  });

  it('進行中スペースでは開始時刻と録画状態を表示する', () => {
    const bookmarklet = createBookmarklet() as any;
    bookmarklet.formatTime = () => '23:55';

    const space = {
      id: '1runningSpace',
      title: '#発売日まであと分だ！',
      state: 'Running',
      isRecording: true,
      startedAt: new Date('2024-01-01T14:55:00Z'),
      admins: [
        { displayName: 'Alice', twitterScreenName: 'alice' },
      ],
      speakers: [
        { displayName: 'Bob', twitterScreenName: 'bob' },
      ],
    };

    const result = bookmarklet.formatAudioSpace(space);

    expect(result).toContain('[23:55開始][録画あり] #発売日まであと分だ！');
    expect(result).toContain('ホスト：Alice @alice');
    expect(result).toContain('スピーカー：Bob @bob');
    expect(result).toContain('https://x.com/i/spaces/1runningSpace');
  });

  it('ホスト情報が取得できない場合はヘッダを表示しない', () => {
    const bookmarklet = createBookmarklet() as any;

    const space = {
      id: '1unknownSpace',
      title: 'ホスト不明スペース',
      state: 'Running',
      isRecording: false,
      admins: [],
      speakers: [],
    };

    const result = bookmarklet.formatAudioSpace(space);

    expect(result).toBe('[録画なし] ホスト不明スペース\nhttps://x.com/i/spaces/1unknownSpace\n');
    expect(result).not.toContain('ホスト：');
  });

  it('AudioSpaceを含むツイートでも本文の空行と&lt;Twitter Space&gt;表記を保持する', () => {
    const bookmarklet = createBookmarklet() as any;

    const formatted = bookmarklet.formatTweet({
      id: '1234567890',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      text: '&lt;Twitter Space&gt;\n\n一段落目',
      author: {
        id: 'user123',
        name: 'テストユーザー',
        screenName: 'tester',
      },
      audioSpace: {
        id: '1fakeSpace',
        state: 'Running',
        isRecording: false,
        admins: [],
        speakers: [],
      },
    } as any);

    expect(formatted).toContain('&lt;Twitter Space&gt;\n\n一段落目');
  });
});
