import parse from './parsers.js';
import {
  plainStringify,
  stringify,
  isPlainObject,
  calcDiff,
} from './sub-funcs.js';

const genDiff = (file1, file2) => {
  const data1 = parse(file1);
  const data2 = parse(file2);

  if (isPlainObject(data1)) return plainStringify(calcDiff(data1, data2));
  return stringify(calcDiff(data1, data2));
};
export default genDiff;
