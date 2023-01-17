import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export default (filePath) => {
  const fileExt = path.extname(filePath);
  let data;
  if (fileExt === '.yml' || fileExt === '.yaml') {
    data = yaml.load(fs.readFileSync(filePath, 'utf-8'));
  } else {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return data;
};
