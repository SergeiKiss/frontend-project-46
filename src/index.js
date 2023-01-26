import _ from 'lodash';
import parse from './parsers.js';

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

export const stringify = (currentValue, depth = 1) => {
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
        return `${indent}${key}: ${stringify(val, depth + 1)}`;
      }
      return `${indent}  ${key}: ${stringify(val, depth + 1)}`;
    });

  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

const plainGenDiff = (plainObj1, plainObj2) => {
  const interimResult = {};
  const keys1 = Object.keys(plainObj1);
  const keys2 = Object.keys(plainObj2);
  const sortedUnionKeys = _.sortBy(_.union(keys1, keys2), (k) => k);
  sortedUnionKeys.forEach((key) => {
    const value1 = plainObj1[key];
    const value2 = plainObj2[key];
    if (value1 === value2) interimResult[`  ${key}`] = value1;
    if (keys1.includes(key) && !keys2.includes(key)) interimResult[`- ${key}`] = value1;
    if (!keys1.includes(key) && keys2.includes(key)) interimResult[`+ ${key}`] = value2;
    if (keys1.includes(key) && keys2.includes(key) && value1 !== value2) {
      interimResult[`- ${key}`] = value1;
      interimResult[`+ ${key}`] = value2;
    }
  });
  return interimResult;
};

const isPlainObject = (o) => {
  const values = Object.values(o);
  return values.reduce((acc, value) => {
    if (acc === false || _.isObject(value)) return false;
    return true;
  }, true);
};

const genDiff = (file1, file2) => {
  const data1 = parse(file1);
  const data2 = parse(file2);
  const iter = (o1, o2) => {
    if (isPlainObject(o1)) return plainGenDiff(o1, o2);
    const interimResult = {};
    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);
    const sortedUnionKeys = _.sortBy(_.union(keys1, keys2), (k) => k);
    sortedUnionKeys.forEach((key) => {
      const value1 = o1[key];
      const value2 = o2[key];

      if (_.isObject(value1) && _.isObject(value2)) {
        interimResult[`${key}`] = iter(value1, value2);
      } else {
        if (value1 === value2) interimResult[`${key}`] = value1;
        if (keys1.includes(key) && !keys2.includes(key)) interimResult[`- ${key}`] = value1;
        if (!keys1.includes(key) && keys2.includes(key)) interimResult[`+ ${key}`] = value2;
        if (keys1.includes(key) && keys2.includes(key) && value1 !== value2) {
          interimResult[`- ${key}`] = value1;
          interimResult[`+ ${key}`] = value2;
        }
      }
    });
    return interimResult;
  };
  if (isPlainObject(data1)) return plainStringify(iter(data1, data2));
  return stringify(iter(data1, data2));
};
export default genDiff;
