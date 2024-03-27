import { getVideos } from '../src';
import { expect, test } from 'bun:test';

test('getVideos function', async () => {
  expect(await getVideos('@WINKisHere')).toBeArray();
});

test('getStream channel validation', async () => {
  await expect(getVideos('WINKisHere')).rejects.toThrow(
    "Invalid channel Id. Channel name must start with '@' i.e @mistahfeet"
  );
});
