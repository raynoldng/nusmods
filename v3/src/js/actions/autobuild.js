// @flow
import type { ModuleLessonConfig } from 'types/timetables';
import type { FSA } from 'types/redux';
import type {
  Module,
  ModuleCode,
  Semester,
  RawLesson,
  Lesson,
} from 'types/modules';

import { loadModule } from 'actions/moduleBank';
import { randomModuleLessonConfig } from 'utils/timetables';
import { getModuleTimetable } from 'utils/modules';

export const ADD_MODULE_AUTOBUILD: string = 'ADD_MODULE_AUTOBUILD';
export function addModule(semester: Semester, moduleCode: ModuleCode) {
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
        },
      });
    });
  };
}
