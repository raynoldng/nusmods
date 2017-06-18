// @flow
/* eslint no-unused-vars: 0 */

import type {
  // Module,
  ModuleCode,
  Semester,
  // RawLesson,
  // Lesson,
} from 'types/modules';

import { loadModule } from 'actions/moduleBank';

export const ADD_MODULE_AUTOBUILD_COMP: string = 'ADD_MODULE_AUTOBUILD_COMP';
export function addModuleAutobuildComp(semester: Semester, moduleCode: ModuleCode) {
  return (dispatch: Function, getState: Function) => {
    return dispatch(loadModule(moduleCode)).then(() => {
      return dispatch({
        type: ADD_MODULE_AUTOBUILD_COMP,
        payload: {
          semester,
          moduleCode,
        },
      });
    });
  };
}

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
