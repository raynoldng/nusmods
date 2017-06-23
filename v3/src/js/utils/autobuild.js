import _ from 'lodash';

export function isCompMod(obj) {
  if (obj) {
    return obj.status === 'comp';
  }
  return false;
}

export function isOptMod(obj) {
  if (obj) {
    return obj.status === 'opt';
  }
  return false;
}

export function autobuildToSemTimetableConfig(autobuild) {
  return _.mapValues(_.pickBy(autobuild, isCompMod), (obj) => {
    return _.omit(obj, status);
  });
}

export function isLessonLocked(lesson, lockedLessons) {
  // console.log(lesson);
  if (lockedLessons) {
    if (lockedLessons[lesson.ModuleCode]) {
      if ((lockedLessons[lesson.ModuleCode])[lesson.LessonType]) {
        return true;
      }
    }
  }
  return false;
}
