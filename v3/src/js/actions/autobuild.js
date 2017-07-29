// @flow
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable func-names */

// import fetch from 'isomorphic-fetch';
import NUSModsPlannerApi from 'apis/nusmodsplanner';
import type {
Module,
ModuleCode,
Semester,
RawLesson,
// Lesson,
} from 'types/modules';

import {
  // lessonSlotStringToObject,
  isCompMod,
  isOptMod,
  isModWithoutLessons,
} from 'utils/autobuild';

import { loadModule } from 'actions/moduleBank';
import { randomModuleLessonConfig } from 'utils/timetables';
import { getModuleTimetable } from 'utils/modules';
import { resultAndtimetableBuilder } from 'utils/smtSolver';
import {
  NOT_ENOUGH_MODULES_NOTIFICATION,
  UNSAT_NOTIFICATION,
  ERROR_NOTIFICATION,
  TOO_MANY_COMP_MODULES_NOTIFICATION,
  SAT_NOTIFICATION,
  RELAXED_SAT_NOTIFICATION,
  DOUBLE_UNSAT_NOTIFICATION,
  // TEST_NOTIFICATION,
} from 'utils/autobuild-notifications';
import _ from 'lodash';


export const ADD_MODULE_AUTOBUILD: string = 'ADD_MODULE_AUTOBUILD';
export function addModuleAutobuild(semester: Semester, moduleCode: ModuleCode, status) {
  return (dispatch: Function, getState: Function) => {
    return dispatch(loadModule(moduleCode)).then(() => {
      const module: Module = getState().entities.moduleBank.modules[moduleCode];
      const lessons: Array<RawLesson> = getModuleTimetable(module, semester);
      let moduleLessonConfig: ModuleLessonConfig = {};
      if (lessons) { // Module may not have lessons.
        moduleLessonConfig = randomModuleLessonConfig(lessons);
      }
      return dispatch({
        type: ADD_MODULE_AUTOBUILD,
        payload: {
          semester,
          moduleCode,
          moduleLessonConfig,
          status,
        },
      });
    });
  };
}

export const REMOVE_MODULE_AUTOBUILD: string = 'REMOVE_MODULE_AUTOBUILD';
export function removeModuleAutobuild(semester: Semester, moduleCode: ModuleCode): FSA {
  return {
    type: REMOVE_MODULE_AUTOBUILD,
    payload: {
      semester,
      moduleCode,
    },
  };
}

export const TOGGLE_MODULE_STATUS_AUTOBUILD: string = 'TOGGLE_MODULE_STATUS_AUTOBUILD';
export function toggleModuleStatusAutobuild(semester: Semester, moduleCode: ModuleCode): FSA {
  return {
    type: TOGGLE_MODULE_STATUS_AUTOBUILD,
    payload: {
      semester,
      moduleCode,
    },
  };
}

export const TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD: string = 'TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD';
export function toggleFreedayAutobuild(semester: Semester): FSA {
  return {
    type: TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD,
    payload: {
      semester,
    },
  };
}

export const TOGGLE_FREE_WEEKDAY_CHECKBOX_AUTOBUILD: string = 'TOGGLE_FREE_WEEKDAY_CHECKBOX_AUTOBUILD';
export function toggleFreeWeekdayAutobuild(semester: Semester, weekday: String): FSA {
  return {
    type: TOGGLE_FREE_WEEKDAY_CHECKBOX_AUTOBUILD,
    payload: {
      semester,
      weekday,
    },
  };
}

export const TOGGLE_BEFORE_OPTION: string = 'TOGGLE_BEFORE_OPTION';
export function toggleBeforeOption(semester: Semester): FSA {
  return {
    type: TOGGLE_BEFORE_OPTION,
    payload: {
      semester,
    },
  };
}

export const TOGGLE_AFTER_OPTION: string = 'TOGGLE_AFTER_OPTION';
export function toggleAfterOption(semester: Semester): FSA {
  return {
    type: TOGGLE_AFTER_OPTION,
    payload: {
      semester,
    },
  };
}

export const CHANGE_NUM_FREEDAYS: string = 'CHANGE_NUM_FREEDAYS';
export function changeNumFreedays(semester: Semester, numFreedays, numWeekdayCheckedBoxes): FSA {
  return {
    type: CHANGE_NUM_FREEDAYS,
    payload: {
      semester,
      numFreedays,
      numWeekdayCheckedBoxes,
    },
  };
}


export const CHANGE_WORKLOAD_AUTOBUILD: string = 'CHANGE_WORKLOAD_AUTOBUILD';
export function changeWorkloadAutobuild(semester: Semester, workload): FSA {
  return {
    type: CHANGE_WORKLOAD_AUTOBUILD,
    payload: {
      semester,
      workload: workload.value,
    },
  };
}

export const CHANGE_BEFORE_TIME: string = 'CHANGE_BEFORE_TIME';
export function changeBeforeTime(semester: Semester, timing): FSA {
  return {
    type: CHANGE_BEFORE_TIME,
    payload: {
      semester,
      noLessonsBefore: timing,
    },
  };
}

export const CHANGE_AFTER_TIME: string = 'CHANGE_AFTER_TIME';
export function changeAfterTime(semester: Semester, timing): FSA {
  return {
    type: CHANGE_AFTER_TIME,
    payload: {
      semester,
      noLessonsAfter: timing,
    },
  };
}

export const CHANGE_LESSON_AUTOBUILD: string = 'CHANGE_LESSON_AUTOBUILD';
export function changeLessonAutobuild(semester: Semester, lesson: Lesson): FSA {
  return {
    type: CHANGE_LESSON_AUTOBUILD,
    payload: {
      semester,
      moduleCode: lesson.ModuleCode,
      lessonType: lesson.LessonType,
      classNo: lesson.ClassNo,
    },
  };
}

export const LOCK_LESSON_AUTOBUILD: string = 'LOCK_LESSON_AUTOBUILD';
export function lockLessonAutobuild(semester: Semester, lesson: Lesson): FSA {
  return {
    type: LOCK_LESSON_AUTOBUILD,
    payload: {
      semester,
      moduleCode: lesson.ModuleCode,
      lessonType: lesson.LessonType,
      classNo: lesson.ClassNo,
    },
  };
}

export const UNLOCK_LESSON_AUTOBUILD: string = 'UNLOCK_LESSON_AUTOBUILD';
export function unlockLessonAutobuild(semester: Semester, lesson: Lesson): FSA {
  return {
    type: UNLOCK_LESSON_AUTOBUILD,
    payload: {
      semester,
      moduleCode: lesson.ModuleCode,
      lessonType: lesson.LessonType,
      classNo: lesson.ClassNo,
    },
  };
}

export const SWITCH_MODE: string = 'SWITCH_MODE';
export function switchMode(semester: Semester, mode: String): FSA {
  return {
    type: SWITCH_MODE,
    payload: {
      semester,
      mode,
    },
  };
}

export const STORE_STATE: string = 'STORE_STATE';
export function storeState(semester: Semester): FSA {
  return {
    type: STORE_STATE,
    payload: {
      semester,
    },
  };
}

export const LOAD_STATE: string = 'LOAD_STATE';
export function loadState(semester: Semester): FSA {
  return {
    type: LOAD_STATE,
    payload: {
      semester,
    },
  };
}

export const PORT_TIMETABLE: string = 'PORT_TIMETABLE';
export function portTimetableToMain(semester: Semester): FSA {
  return {
    type: PORT_TIMETABLE,
    payload: {
      semester,
    },
  };
}

export const MOVE_TO_OPT_AUTOBUILD: string = 'MOVE_TO_OPT_AUTOBUILD';
export function moveToOptAutobuild(semester: Semester, moduleCode: ModuleCode): FSA {
  return {
    type: MOVE_TO_OPT_AUTOBUILD,
    payload: {
      semester,
      moduleCode,
    },
  };
}

export const MOVE_TO_COMP_AUTOBUILD: string = 'MOVE_TO_COMP_AUTOBUILD';
export function moveToCompAutobuild(semester: Semester, moduleCode: ModuleCode): FSA {
  return {
    type: MOVE_TO_COMP_AUTOBUILD,
    payload: {
      semester,
      moduleCode,
    },
  };
}

function flatten(arr) {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function getResultAndTimetable(semester, options, compMods, optMods, workload) {
  const url = NUSModsPlannerApi.plannerQueryUrl(semester, options, compMods, optMods, workload);
  console.log(url);

  const request = new XMLHttpRequest();
  request.open('GET', url, false);  // `false` makes the request synchronous
  request.send(null);

  let smtQuery;
  let moduleMapping;

  if (request.status === 200) {
    const data = JSON.parse(request.responseText);
    smtQuery = data[0];
    moduleMapping = data[1];
  } else {
    return [];
  }

  return resultAndtimetableBuilder(smtQuery, moduleMapping, workload, options);
}

export const FETCH_AND_SOLVE_QUERY: string = 'FETCH_QUERY';
export const UPDATE_AUTOBUILD_TIMETABLE: string = 'UPDATE_AUTOBUILD_TIMETABLE';
export function fetchAndSolveQuery(autobuild, semester, notificationGenerator) {
  // first filter the mods
  const compMods = Object.keys(_.pickBy(autobuild, isCompMod));
  const workload = autobuild.workload ? autobuild.workload : 5;
  const optMods = (compMods.length < workload) ? Object.keys(_.pickBy(autobuild, isOptMod)) : [];
  const options = {};
  const preferences = autobuild.freedayPreferences || {};

  // dem code smells...
  if (autobuild.freeday) {
    options.freeday = true;
    const fullWeekdayMapping = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };
    const possibleFreedays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].filter((day) => { return preferences[day]; })
      .map(d => fullWeekdayMapping[d]);
    options.possibleFreedays = possibleFreedays;
  }

  if (compMods.length + optMods.length < workload) {
    notificationGenerator(NOT_ENOUGH_MODULES_NOTIFICATION);
    return;
  }
  if (compMods.length > workload) {
    notificationGenerator(TOO_MANY_COMP_MODULES_NOTIFICATION);
    return;
  }

  if (autobuild.noLessonsAfter && autobuild.afterOption) options.noLessonsAfter = autobuild.noLessonsAfter;
  if (autobuild.noLessonsBefore && autobuild.beforeOption) options.noLessonsBefore = autobuild.noLessonsBefore;

  if (autobuild.lockedLessons) {
    const lockedLessons = Object.keys(autobuild.lockedLessons).map((moduleCode) => {
      return Object.keys(autobuild.lockedLessons[moduleCode]).map((lessonType) => {
        return [moduleCode, lessonType, autobuild.lockedLessons[moduleCode][lessonType]].join('_');
      });
    });

    options.lockedLessonSlots = flatten(lockedLessons);
  }

  // const url = NUSModsPlannerApi.plannerQueryUrl(semester, options, compMods, optMods, workload);
  // console.log(url);

  return (dispatch: Function) => {
    window.worker.onmessage = function (event) {
      dispatch({
        type: 'UPDATE_AUTOBUILD_TIMETABLE_HOHOHO',
        payload: {
          semester,
          options,
          data: event.data,
        },
      });
    };
    window.worker.postMessage({
      hello: 'abc',
    });
    let finalTimetable;
    const { result, timetable } = getResultAndTimetable(semester, options, compMods, optMods, workload);
    const obj = {};

    if (result === 'ERROR') {
      notificationGenerator(ERROR_NOTIFICATION);
      window.location.reload();
      return {};
    } else if (timetable.length === 0) { // UNSAT
      // try again with relaxed constraints
      if (options.possibleFreedays && options.possibleFreedays.length > 0) {
        const relaxedOptions = {
          ...options,
          possibleFreedays: [],
        };
        const outcome = getResultAndTimetable(semester, relaxedOptions, compMods, optMods, workload);
        const relaxedResult = outcome.result;
        const relaxedTimetable = outcome.timetable;

        if (relaxedResult === 'ERROR') {
          notificationGenerator(ERROR_NOTIFICATION);
          window.location.reload();
          return {};
        }

        if (relaxedTimetable.length === 0) {
          notificationGenerator(DOUBLE_UNSAT_NOTIFICATION);
          return {};
        }

        finalTimetable = relaxedTimetable;
        notificationGenerator(RELAXED_SAT_NOTIFICATION);
      } else {
        // vanilla unsat notification
        notificationGenerator(UNSAT_NOTIFICATION);
        return {};
      }
    } else { // SAT
      notificationGenerator(SAT_NOTIFICATION);
      finalTimetable = timetable;
    }

    console.log(finalTimetable);
    finalTimetable.forEach((string) => {
      const arr = string.split('_');
      obj[arr[0]] = {
        ...obj[arr[0]],
        [arr[1]]: arr[2],
        status: 'comp',
      };
    });
    const curTimetableLength = Object.keys(obj).length;
    if (curTimetableLength !== workload) {
      const modsWithoutLessons = Object.keys(_.pickBy(autobuild, isModWithoutLessons));
      for (let i = 0; i < workload - curTimetableLength; i += 1) {
        obj[modsWithoutLessons[i]] = {
          status: 'comp',
        };
      }
    }

    return dispatch({
      type: UPDATE_AUTOBUILD_TIMETABLE,
      payload: {
        semester,
        state: obj,
      },
    });
  };
}
