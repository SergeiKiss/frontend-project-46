import _ from 'lodash';
import parse from './parsers.js';
import {
  plainStringify,
  stringify,
  isPlainObject,
} from './sub-funcs.js';

const genDiff = (file1, file2) => {
  const data1 = parse(file1);
  const data2 = parse(file2);
  const iter = (o1, o2) => {
    // if (isPlainObject(o1)) return plainGenDiff(o1, o2);
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
  if (isPlainObject(data1)) return plainStringify(iter(data1, data2));
  return stringify(iter(data1, data2));
};
export default genDiff;
