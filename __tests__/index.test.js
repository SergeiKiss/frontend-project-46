import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

test('basic', () => {
  const file1 = '__fixtures__/file1.json';
  const file2 = '__fixtures__/file2.json';
  const result = '{\n - follow: false\n   host: hexlet.io\n - proxy: 123.234.53.22\n - timeout: 50\n + timeout: 20\n + verbose: true\n}';
  expect(genDiff(file1, file2)).toEqual(result);
});
