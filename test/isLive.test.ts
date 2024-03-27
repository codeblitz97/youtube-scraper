import { isLive } from '../src';
import { expect, test } from 'bun:test';

test('isLive function', async () => {
  expect(await isLive('@WINKisHere')).toBeBoolean;
});

test('isLive channel validation', async () => {
  await expect(isLive('WINKisHere')).rejects.toThrow(
    "Invalid channel Id. Channel name must start with '@' i.e @mistahfeet"
  );
});
