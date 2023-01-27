import _ from 'lodash';
import { isPlainObject } from '../sub-funcs.js';

const plainStringify = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (el, counter) => {
    const arr = Object.entries(el).map(([key, val]) => {
      if (typeof val === 'object' && val) return (`${replacer.repeat(counter)}${key}: ${iter(val, counter + spacesCount)}`);
      return (`${replacer.repeat(counter)}${key}: ${val}`);
    });
    const result = arr.join('\n');
    return counter === spacesCount ? `{\n${result}\n}` : `{\n${result}\n${replacer.repeat(counter - spacesCount)}}`;
  };
  return typeof value !== 'object' ? `${value}` : iter(value, spacesCount);
};

const getIndent = (depth, spacesCount = 4) => ' '.repeat((depth * spacesCount) - 2);

const getBracketIndent = (depth, spacesCount = 4) => ' '.repeat((depth * spacesCount) - spacesCount);

export const stringify = (value) => {
  if (isPlainObject(value)) return plainStringify(value);

  const iter = (currentValue, depth = 1) => {
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    const indent = getIndent(depth);
    const bracketIndent = getBracketIndent(depth);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => {
        const firstKeyEl = key[0];
        if (firstKeyEl === '+' || firstKeyEl === '-') {
          return `${indent}${key}: ${iter(val, depth + 1)}`;
        }
        return `${indent}  ${key}: ${iter(val, depth + 1)}`;
      });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value);
};

export default stringify;
