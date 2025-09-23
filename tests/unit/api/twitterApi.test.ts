import { TwitterApiClient } from '@/api/twitterApi';

describe('TwitterApiClient.fetchAudioSpace', () => {
  it('モバイルドメインでも x.com ホストを二重にしない', async () => {
    const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
    fetchMock.mockReset();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: {} }),
    } as unknown as Response);

    const client = new TwitterApiClient({
      bearerToken: 'Bearer token',
      csrfToken: 'csrf-token',
    } as any, 'mobile.twitter.com');

    await client.fetchAudioSpace('1', 'QueryId');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestedUrl = fetchMock.mock.calls[0]![0] as string;
    expect(requestedUrl).toContain('https://x.com');
    expect(requestedUrl).not.toContain('mobile.x.com');
  });
});
