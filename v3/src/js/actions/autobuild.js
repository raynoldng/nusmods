// @flow
/* eslint no-unused-vars: 0 */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
/* eslint-disable consistent-return */

import fetch from 'isomorphic-fetch';

import NUSModsPlannerApi from 'apis/nusmodsplanner';
import type {
Module,
ModuleCode,
Semester,
RawLesson,
// Lesson,
} from 'types/modules';

import { lessonSlotStringToObject, isCompMod, isOptMod } from 'utils/autobuild';

import { loadModule } from 'actions/moduleBank';
import { randomModuleLessonConfig } from 'utils/timetables';
import { getModuleTimetable } from 'utils/modules';
import { parseOutput, slotsFromModel } from 'utils/smtSolver';
import {
  NOT_ENOUGH_MODULES_NOTIFICATION,
  UNSAT_NOTIFICATION,
  ERROR_NOTIFICATION,
  // TEST_NOTIFICATION,
} from 'utils/autobuild-notifications';
import _ from 'lodash';


export const ADD_MODULE_AUTOBUILD_COMP: string = 'ADD_MODULE_AUTOBUILD_COMP';
export function addModuleAutobuildComp(semester: Semester, moduleCode: ModuleCode) {
  return (dispatch: Function, getState: Function) => {
    return dispatch(loadModule(moduleCode)).then(() => {
      const module: Module = getState().entities.moduleBank.modules[moduleCode];
      const lessons: Array<RawLesson> = getModuleTimetable(module, semester);
      let moduleLessonConfig: ModuleLessonConfig = {};
      if (lessons) { // Module may not have lessons.
        moduleLessonConfig = randomModuleLessonConfig(lessons);
      }
      return dispatch({
        type: ADD_MODULE_AUTOBUILD_COMP,
        payload: {
          semester,
          moduleCode,
          moduleLessonConfig,
        },
      });
    });
  };
}

// no need for moduleLessonConfig in optional module
export const ADD_MODULE_AUTOBUILD_OPT: string = 'ADD_MODULE_AUTOBUILD_OPT';
export function addModuleAutobuildOpt(semester: Semester, moduleCode: ModuleCode) {
  return (dispatch: Function, getState: Function) => {
    return dispatch(loadModule(moduleCode)).then(() => {
      return dispatch({
        type: ADD_MODULE_AUTOBUILD_OPT,
        payload: {
          semester,
          moduleCode,
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

export const TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD: string = 'TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD';
export function toggleFreedayAutobuild(semester: Semester): FSA {
  return {
    type: TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD,
    payload: {
      semester,
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

function solve(boolector, query) {
  let output = '';
  boolector.print = function (x) {
    output += x + '\n';
  };
  boolector.printErr = function (x) {
    output += x + '\n';
  };
  const solveString = boolector.cwrap('solve_string', 'string', ['string', 'number']);
  const result = solveString(query, 2);
  const outcome = [result, output];
  return outcome;
}

function solveQuery(query, boolectorarray) {
  /* for (let i = 0; i < boolectorarray.length; i += 1) {
    const outcome1 = solve(boolectorarray[i], query);
    if (outcome1[0] !== 'ERROR') {
      return outcome1;
    }
  }
  const n = boolectorarray.push(createBoolector());
  return solve(boolectorarray[n - 1], query); */
  const newBoolector = createBoolector();
  return solve(newBoolector, query);
}

function syncQuery(url) {
  const request = new XMLHttpRequest();
  request.open('GET', url, false);  // `false` makes the request synchronous
  request.send(null);

  if (request.status === 200) {
    // console.log(request.responseText);
    const data2 = JSON.parse(request.responseText);
    const smtlib2 = data2[0];
    const mapping = data2[1]; // not really needed
    const outcome = solveQuery(smtlib2, BoolectorModuleArray);
    return [outcome, mapping];
  }

  return ['UNABLE TO GET QUERY STRING', null];
}

function flatten(arr) {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

export const FETCH_AND_SOLVE_QUERY: string = 'FETCH_QUERY';
export const UPDATE_AUTOBUILD_TIMETABLE: string = 'UPDATE_AUTOBUILD_TIMETABLE';
export function fetchAndSolveQuery(autobuild, semester, notificationGenerator) {
  // first filter the mods
  const compMods = Object.keys(_.pickBy(autobuild, isCompMod));
  const optMods = Object.keys(_.pickBy(autobuild, isOptMod));
  const workload = autobuild.workload ? autobuild.workload : 5;
  const options = { freeday: autobuild.freeday };
  if (compMods.length + optMods.length < workload) {
    notificationGenerator(NOT_ENOUGH_MODULES_NOTIFICATION);
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

  const url = NUSModsPlannerApi.plannerQueryUrl(semester, options, compMods, optMods, workload, semester);

  console.log(url);

  return (dispatch: Function, getState: Function) => {
    const retVal = syncQuery(url);
    const outcome = retVal[0];
    const moduleMapping = retVal[1];
    console.log(outcome);
    const model = outcome[1];
    const result = outcome[0];
    const timetable = slotsFromModel(model, compMods, optMods, workload, moduleMapping);
    console.log(timetable);

    const obj = {};

    if (result === 'ERROR') {
      notificationGenerator(ERROR_NOTIFICATION);
      window.location.reload();
      return {};
    } else if (timetable.length === 0) { // UNSAT
      notificationGenerator(UNSAT_NOTIFICATION);
      return {};
    }

    timetable.forEach((string) => {
      const arr = string.split('_');
      obj[arr[0]] = {
        ...obj[arr[0]],
        [arr[1]]: arr[2],
        status: 'comp',
      };
    });
    return dispatch({
      type: UPDATE_AUTOBUILD_TIMETABLE,
      payload: {
        semester,
        state: obj,
      },
    });
  };
}
