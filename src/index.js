import parse from './parsers.js';
import { calcDiff } from './sub-funcs.js';
import getFormatter from './formatters/index.js';

const genDiff = (file1, file2, formatName) => {
  const data1 = parse(file1);
  const data2 = parse(file2);
  const formatter = getFormatter(formatName);

  return formatter(calcDiff(data1, data2));
};
export default genDiff;
