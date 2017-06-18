import _ from 'lodash';

export function isCompMod(obj) {
  return obj.status === 'comp';
}

export function isOptMod(obj) {
  return obj.status === 'opt';
}

export function autobuildToSemTimetableConfig(autobuild) {
  return _.mapValues(_.pickBy(autobuild, isCompMod), (obj) => {
    return _.omit(obj, status);
  });
}
