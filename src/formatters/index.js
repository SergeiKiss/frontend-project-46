import stringifyStylish from './stylish.js';
import stringifyPlain from './plain.js';

export default (formatName) => {
  switch (formatName) {
    case 'plain':
      return stringifyPlain;

    default:
      return stringifyStylish;
  }
};
