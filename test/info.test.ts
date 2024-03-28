import { getInfo } from '../src';
import { test, expect } from 'bun:test';

test('getInfo function', async () => {
  expect(await getInfo('TRE-h757B7I')).toBeObject();
});
