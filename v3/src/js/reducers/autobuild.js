/* eslint-disable no-console */
/* eslint-disable no-case-declarations */

import { ADD_MODULE_AUTOBUILD,
         REMOVE_MODULE_AUTOBUILD,
         TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD,
         TOGGLE_LUNCH_CHECKBOX_AUTOBUILD,
         TOGGLE_FREE_WEEKDAY_CHECKBOX_AUTOBUILD,
         TOGGLE_BEFORE_OPTION,
         TOGGLE_AFTER_OPTION,
         CHANGE_WORKLOAD_AUTOBUILD,
         CHANGE_LESSON_AUTOBUILD,
         LOCK_LESSON_AUTOBUILD,
         UNLOCK_LESSON_AUTOBUILD,
         SWITCH_MODE,
         CHANGE_AFTER_TIME,
         CHANGE_BEFORE_TIME,
         UPDATE_AUTOBUILD_TIMETABLE,
         STORE_STATE,
         LOAD_STATE,
         TOGGLE_MODULE_STATUS_AUTOBUILD,
         CHANGE_NUM_FREEDAYS,
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
  switch (action.type) {
    case CHANGE_WORKLOAD_AUTOBUILD:
      return {
        ...state,
        workload: action.payload.workload,
      };
    case CHANGE_BEFORE_TIME:
      if (action.payload.noLessonsBefore) {
        return {
          ...state,
          noLessonsBefore: action.payload.noLessonsBefore,
        };
      }
      return _.omit(state, 'noLessonsBefore');
    case CHANGE_AFTER_TIME:
      if (action.payload.noLessonsAfter) {
        return {
          ...state,
          noLessonsAfter: action.payload.noLessonsAfter,
        };
      }
      return _.omit(state, 'noLessonsAfter');
    case TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD:
      if (state.freeday) {
        return {
          ..._.omit(state, 'freedayPreferences'),
          freeday: !state.freeday,
        };
      }
      return {
        ...state,
        freeday: !state.freeday,
      };
    case TOGGLE_LUNCH_CHECKBOX_AUTOBUILD:
      return {
        ...state,
        lunchOption: !state.lunchOption,
      };
    case TOGGLE_FREE_WEEKDAY_CHECKBOX_AUTOBUILD:
      const day = action.payload.weekday;
      if (day === 'Any') {
        return {
          ...state,
          freedayPreferences: {
            Any: true,
          },
          freeday: true,
        };
      } else if (state.freedayPreferences) {
        return {
          ...state,
          freedayPreferences: {
            ...state.freedayPreferences,
            [day]: !state.freedayPreferences[day],
            Any: false,
          },
          freeday: true,
        };
      }
      return {
        ...state,
        freedayPreferences: {
          [day]: true,
        },
        freeday: true,
      };
    case TOGGLE_BEFORE_OPTION:
      return {
        ...state,
        beforeOption: !state.beforeOption,
        noLessonsBefore: state.noLessonsBefore ? state.noLessonsBefore : 8,
      };
    case TOGGLE_AFTER_OPTION:
      return {
        ...state,
        afterOption: !state.afterOption,
        noLessonsAfter: state.noLessonsAfter ? state.noLessonsAfter : 16,
      };
    case SWITCH_MODE:
      return {
        ...state,
        mode: action.payload.mode,
      };
    case UPDATE_AUTOBUILD_TIMETABLE:
      return {
        ...state,
        ...action.payload.state,
      };
    case STORE_STATE:
      return {
        ...state,
        storedState: _.omit(state, 'storedState'),
      };
    case LOAD_STATE:
      if (state.storedState) {
        return state.storedState;
      }
      return state;
    default:
      if (!action.payload.moduleCode) {
        return state;
      }
  }
  const moduleCode = action.payload.moduleCode;
  switch (action.type) {
    case ADD_MODULE_AUTOBUILD:
      return {
        ...state,
        [moduleCode]: {
          ...action.payload.moduleLessonConfig,
          status: action.payload.status,
        },
      };
    case REMOVE_MODULE_AUTOBUILD:
      if (state.lockedLessons) {
        return {
          ..._.omit(state, [moduleCode]),
          lockedLessons: _.omit(state.lockedLessons, [moduleCode]),
        };
      }
      return _.omit(state, [moduleCode]);
    case TOGGLE_MODULE_STATUS_AUTOBUILD:
      if (state.lockedLessons) {
        return {
          ...state,
          [moduleCode]: {
            ...state[moduleCode],
            status: state[moduleCode].status === 'comp' ? 'opt' : 'comp',
          },
          lockedLessons: _.omit(state.lockedLessons, [moduleCode]),
        };
      }
      return {
        ...state,
        [moduleCode]: {
          ...state[moduleCode],
          status: state[moduleCode].status === 'comp' ? 'opt' : 'comp',
        },
      };
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
          [moduleCode]: _.omit(state.lockedLessons[moduleCode], action.payload.lessonType),
        },
      };
    default:
      return state;
  }
}

function autobuild(state = {}, action) {
  switch (action.type) {
    case ADD_MODULE_AUTOBUILD:
    case REMOVE_MODULE_AUTOBUILD:
    case TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD:
    case TOGGLE_LUNCH_CHECKBOX_AUTOBUILD:
    case TOGGLE_FREE_WEEKDAY_CHECKBOX_AUTOBUILD:
    case TOGGLE_AFTER_OPTION:
    case TOGGLE_BEFORE_OPTION:
    case CHANGE_WORKLOAD_AUTOBUILD:
    case CHANGE_LESSON_AUTOBUILD:
    case LOCK_LESSON_AUTOBUILD:
    case UNLOCK_LESSON_AUTOBUILD:
    case SWITCH_MODE:
    case CHANGE_BEFORE_TIME:
    case CHANGE_AFTER_TIME:
    case UPDATE_AUTOBUILD_TIMETABLE:
    case STORE_STATE:
    case LOAD_STATE:
    case CHANGE_NUM_FREEDAYS:
    case TOGGLE_MODULE_STATUS_AUTOBUILD:
      return {
        ...state,
        [action.payload.semester]: semTimetable(state[action.payload.semester], action),
      };
    default:
      return state;
  }
}

export default autobuild;
