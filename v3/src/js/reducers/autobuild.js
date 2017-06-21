/* eslint no-unused-vars: 0 */
/* eslint-disable no-console */

import { ADD_MODULE_AUTOBUILD_COMP,
         ADD_MODULE_AUTOBUILD_OPT,
         REMOVE_MODULE_AUTOBUILD,
         TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD,
         CHANGE_WORKLOAD_AUTOBUILD,
         CHANGE_LESSON_AUTOBUILD,
         LOCK_LESSON_AUTOBUILD,
         UNLOCK_LESSON_AUTOBUILD,
         SWITCH_MODE,
         CHANGE_AFTER_TIME,
         CHANGE_BEFORE_TIME,
} from 'actions/autobuild';

import _ from 'lodash';

function moduleLessonConfig(state = {}, action) {
  switch (action.type) {
    case CHANGE_LESSON_AUTOBUILD:
    case LOCK_LESSON_AUTOBUILD:
      return (() => {
        if (!action.payload) {
          return state;
        }
        const classNo = action.payload.classNo;
        const lessonType = action.payload.lessonType;
        if (!(classNo && lessonType)) {
          return state;
        }
        return {
          ...state,
          [lessonType]: classNo,
        };
      })();
    default:
      return state;
  }
}

// even though we only need array, using object to maintain type compatibility
function semTimetable(state = {}, action) {
  if (!action.payload) {
    return state;
  }
  if (action.type === CHANGE_WORKLOAD_AUTOBUILD) {
    return {
      ...state,
      workload: action.payload.workload,
    };
  }
  if (action.type === CHANGE_BEFORE_TIME) {
    return {
      ...state,
      noLessonsBefore: action.payload.noLessonsBefore,
    };
  }
  if (action.type === CHANGE_AFTER_TIME) {
    return {
      ...state,
      noLessonsAfter: action.payload.noLessonsAfter,
    };
  }
  if (action.type === TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD) {
    return {
      ...state,
      checked: !state.checked,
    };
  }
  if (action.type === SWITCH_MODE) {
    return {
      ...state,
      mode: action.payload.mode,
    };
  }
  const moduleCode = action.payload.moduleCode;
  if (!moduleCode) {
    return state;
  }
  switch (action.type) {
    case ADD_MODULE_AUTOBUILD_COMP:
      return {
        ...state,
        [moduleCode]: {
          ...action.payload.moduleLessonConfig,
          status: 'comp',
        },
      };
    case ADD_MODULE_AUTOBUILD_OPT:
      return {
        ...state,
        [moduleCode]: {
          status: 'opt',
        },
      };
    case REMOVE_MODULE_AUTOBUILD:
      return _.omit(state, [moduleCode]);
    case CHANGE_LESSON_AUTOBUILD:
      return {
        ...state,
        [moduleCode]: moduleLessonConfig(state[moduleCode], action),
      };
    case LOCK_LESSON_AUTOBUILD:
      if (state.lockedLessons) {
        return {
          ...state,
          lockedLessons: {
            ...state.lockedLessons,
            [moduleCode]: moduleLessonConfig(state.lockedLessons[moduleCode], action),
          },
        };
      }
      return {
        ...state,
        lockedLessons: {
          [moduleCode]: moduleLessonConfig({}, action),
        },
      };
    case UNLOCK_LESSON_AUTOBUILD:
      return {
        ...state,
        lockedLessons: {
          ...state.lockedLessons,
          [moduleCode]: _.omit(state.lockedLessons.moduleCode, action.payload.lessonType),
        },
      };
    default:
      return state;
  }
}

function autobuild(state = {}, action) {
  switch (action.type) {
    case ADD_MODULE_AUTOBUILD_COMP:
    case ADD_MODULE_AUTOBUILD_OPT:
    case REMOVE_MODULE_AUTOBUILD:
    case TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD:
    case CHANGE_WORKLOAD_AUTOBUILD:
    case CHANGE_LESSON_AUTOBUILD:
    case LOCK_LESSON_AUTOBUILD:
    case UNLOCK_LESSON_AUTOBUILD:
    case SWITCH_MODE:
    case CHANGE_BEFORE_TIME:
    case CHANGE_AFTER_TIME:
      return {
        ...state,
        [action.payload.semester]: semTimetable(state[action.payload.semester], action),
      };
    default:
      return state;
  }
}

export default autobuild;
