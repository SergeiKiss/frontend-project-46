import * as path from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '.', '__fixtures__', filename);

describe('flat structures', () => {
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

describe('tree structures', () => {
  const result = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

  test('json type', () => {
    const file1 = 'tree1.json';
    const file2 = 'tree2.json';
    expect(genDiff(getFixturePath(file1), getFixturePath(file2))).toEqual(result);
  });

  test('yaml type', () => {
    const file1 = 'tree1.yml';
    const file2 = 'tree2.yml';
    expect(genDiff(getFixturePath(file1), getFixturePath(file2))).toEqual(result);
  });
});
