import _ from 'lodash';

export const isPlainObject = (o) => {
  const values = Object.values(o);
  return values.reduce((acc, value) => {
    if (acc === false || _.isObject(value)) return false;
    return true;
  }, true);
};

export const calcDiff = (o1, o2) => {
  const keys1 = Object.keys(o1);
  const keys2 = Object.keys(o2);
  const sortedUnionKeys = _.sortBy(_.union(keys1, keys2), (k) => k);
  const result = sortedUnionKeys.reduce((arr, key) => {
    const value1 = o1[key];
    const value2 = o2[key];

    if (_.isObject(value1) && _.isObject(value2)) {
      return { ...arr, [`${key}`]: calcDiff(value1, value2) };
    }
    if (value1 === value2) {
      if (isPlainObject(o1)) return { ...arr, [`  ${key}`]: value1 };
      return { ...arr, [`${key}`]: value1 };
    }
    if (keys1.includes(key) && !keys2.includes(key)) return { ...arr, [`- ${key}`]: value1 };
    if (!keys1.includes(key) && keys2.includes(key)) return { ...arr, [`+ ${key}`]: value2 };
    if (keys1.includes(key) && keys2.includes(key) && value1 !== value2) return { ...arr, [`- ${key}`]: value1, [`+ ${key}`]: value2 };
    return null;
  }, {});
  return result;
};
