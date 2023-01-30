import stringifyStylish from './stylish.js';
import stringifyPlain from './plain.js';
import stringifyJSON from './json.js';

export default (formatName) => {
  switch (formatName) {
    case 'stylish':
      return stringifyStylish;
    case 'plain':
      return stringifyPlain;

    case 'json':
      return stringifyJSON;

    default:
      throw new Error('Unknown formatter');
  }
};
