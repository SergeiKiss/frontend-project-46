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

describe('new formatters', () => {
  const plainResult = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

  test('plain', () => {
    const file1 = 'tree1.json';
    const file2 = 'tree2.json';
    expect(genDiff(getFixturePath(file1), getFixturePath(file2), 'plain')).toEqual(plainResult);
  });

  const jsonResult = [
    {
      key: 'common',
      change: null,
      value: [
        {
          key: 'follow',
          change: 'added',
          value: false,
        },
        {
          key: 'setting1',
          change: null,
          value: 'Value 1',
        },
        {
          key: 'setting2',
          change: 'removed',
          value: 200,
        },
        {
          key: 'setting3',
          change: 'updated',
          oldValue: true,
          value: null,
        },
        {
          key: 'setting4',
          change: 'added',
          value: 'blah blah',
        },
        {
          key: 'setting5',
          change: 'added',
          value: [
            {
              key: 'key5',
              change: null,
              value: 'value5',
            },
          ],
        },
        {
          key: 'setting6',
          change: null,
          value: [
            {
              key: 'doge',
              change: null,
              value: [
                {
                  key: 'wow',
                  change: 'updated',
                  oldValue: '',
                  value: 'so much',
                },
              ],
            },
            {
              key: 'key',
              change: null,
              value: 'value',
            },
            {
              key: 'ops',
              change: 'added',
              value: 'vops',
            },
          ],
        },
      ],
    },
    {
      key: 'group1',
      change: null,
      value: [
        {
          key: 'baz',
          change: 'updated',
          oldValue: 'bas',
          value: 'bars',
        },
        {
          key: 'foo',
          change: null,
          value: 'bar',
        },
        {
          key: 'nest',
          change: 'updated',
          oldValue: [
            {
              key: 'key',
              change: null,
              value: 'value',
            },
          ],
          value: 'str',
        },
      ],
    },
    {
      key: 'group2',
      change: 'removed',
      value: [
        {
          key: 'abc',
          change: null,
          value: 12345,
        },
        {
          key: 'deep',
          change: null,
          value: [
            {
              key: 'id',
              change: null,
              value: 45,
            },
          ],
        },
      ],
    },
    {
      key: 'group3',
      change: 'added',
      value: [
        {
          key: 'deep',
          change: null,
          value: [
            {
              key: 'id',
              change: null,
              value: [
                {
                  key: 'number',
                  change: null,
                  value: 45,
                },
              ],
            },
          ],
        },
        {
          key: 'fee',
          change: null,
          value: 100500,
        },
      ],
    },
  ];

  test('json', () => {
    const file1 = 'tree1.json';
    const file2 = 'tree2.json';
    expect(genDiff(getFixturePath(file1), getFixturePath(file2), 'json')).toEqual(JSON.stringify(jsonResult));
  });
});
