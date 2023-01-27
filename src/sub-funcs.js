import _ from 'lodash';

export const isPlainObject = (o) => {
  const values = Object.values(o);
  return values.reduce((acc, value) => {
    if (acc === false || _.isObject(value)) return false;
    return true;
  }, true);
};

export const plainStringify = (value, replacer = ' ', spacesCount = 1) => {
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

export const getIndent = (depth, spacesCount = 4) => ' '.repeat((depth * spacesCount) - 2);

export const getBracketIndent = (depth, spacesCount = 4) => ' '.repeat((depth * spacesCount) - spacesCount);

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

export const calcDiff = (o1, o2) => {
  const interimResult = {};
  const keys1 = Object.keys(o1);
  const keys2 = Object.keys(o2);
  const sortedUnionKeys = _.sortBy(_.union(keys1, keys2), (k) => k);
  sortedUnionKeys.forEach((key) => {
    const value1 = o1[key];
    const value2 = o2[key];

    if (_.isObject(value1) && _.isObject(value2)) {
      interimResult[`${key}`] = calcDiff(value1, value2);
    } else {
      if (value1 === value2) {
        if (isPlainObject(o1)) interimResult[`  ${key}`] = value1;
        else interimResult[`${key}`] = value1;
      }
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
