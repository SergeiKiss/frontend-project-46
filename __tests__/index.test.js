import * as path from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '.', '__fixtures__', filename);

describe('basic', () => {
  const result = '{\n - follow: false\n   host: hexlet.io\n - proxy: 123.234.53.22\n - timeout: 50\n + timeout: 20\n + verbose: true\n}';

  test('json type', () => {
    const file1 = 'file1.json';
    const file2 = 'file2.json';
    expect(genDiff(getFixturePath(file1), getFixturePath(file2))).toEqual(result);
  });

  test('yaml type', () => {
    const file1 = 'file1.yml';
    const file2 = 'file2.yml';
    expect(genDiff(getFixturePath(file1), getFixturePath(file2))).toEqual(result);
  });
});
