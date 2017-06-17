// @flow
import type {
  // Module,
  ModuleCode,
  Semester,
  // RawLesson,
  // Lesson,
} from 'types/modules';

export const ADD_MODULE_AUTOBUILD_COMP: string = 'ADD_MODULE_AUTOBUILD_COMP';
export function addModuleAutobuildComp(semester: Semester, moduleCode: ModuleCode) {
  return {
    type: ADD_MODULE_AUTOBUILD_COMP,
    payload: {
      semester,
      moduleCode,
    },
  };
}

export const ADD_MODULE_AUTOBUILD_OPT: string = 'ADD_MODULE_AUTOBUILD_OPT';
export function addModuleAutobuildOpt(semester: Semester, moduleCode: ModuleCode) {
  return {
    type: ADD_MODULE_AUTOBUILD_OPT,
    payload: {
      semester,
      moduleCode,
    },
  };
}
