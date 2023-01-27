import _ from 'lodash';

export const isPlainObject = (o) => {
  const values = Object.values(o);
  return values.reduce((acc, value) => {
    if (acc === false || _.isObject(value)) return false;
    return true;
  }, true);
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
