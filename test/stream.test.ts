import { getStreams } from '../src';
import { expect, test } from 'bun:test';

test('getStreams function', async () => {
  expect(await getStreams('@WINKisHere')).toBeArray();
});

test('getStream channel validation', async () => {
  await expect(getStreams('WINKisHere')).rejects.toThrow(
    "Invalid channel Id. Channel name must start with '@' i.e @mistahfeet"
  );
});
