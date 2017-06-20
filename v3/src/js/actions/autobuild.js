// @flow
/* eslint no-unused-vars: 0 */
/* eslint-disable no-console */
import fetch from 'isomorphic-fetch';

import NUSModsPlannerApi from 'apis/nusmodsplanner';
import type {
Module,
ModuleCode,
Semester,
RawLesson,
// Lesson,
} from 'types/modules';

import { loadModule } from 'actions/moduleBank';
import { randomModuleLessonConfig } from 'utils/timetables';
import { getModuleTimetable } from 'utils/modules';
import { solve, parseOutput, slotsFromModel } from '../utils/smtSolver';


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

export const FETCH_QUERY: string = 'FETCH_QUERY';
export function fetchQuery(autobuild) {
  // first filter out the mods
  const mods = Object.keys(autobuild).filter(k => autobuild[k].status);
  const compMods = mods.filter(m => autobuild[m].status === 'comp');
  const optMods = mods.filter(m => autobuild[m].status === 'opt');
  const workload = autobuild.workload ? autobuild.workload : 5;

  // console.log('compMods:');
  // console.log(compMods);
  // console.log('optMods:');
  // console.log(optMods);

  const url = NUSModsPlannerApi.plannerQueryUrl(compMods, optMods, workload);
  // console.log(`url: ${url}`);

  // fetch(url).then(req => req.text()).then(data => console.log(data));
  fetch(url).then(req => req.text()).then((data) => {
    // console.log('there is the query:');
    // console.log(data);
    const result = solve(data);
    return result;
    // console.log('result of SMT computation:');
    // console.log(parseOutput(result));
  }).then((result) => {
    console.log(parseOutput(result));
    slotsFromModel(result, compMods, optMods, workload);
  });
}
