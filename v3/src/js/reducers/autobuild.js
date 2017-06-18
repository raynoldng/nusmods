/* eslint no-unused-vars: 0 */

import { ADD_MODULE_AUTOBUILD_COMP,
         ADD_MODULE_AUTOBUILD_OPT,
         REMOVE_MODULE_AUTOBUILD,
         TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD,
         CHANGE_WORKLOAD_AUTOBUILD,
} from 'actions/autobuild';


import _ from 'lodash';

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
  if (action.type === TOGGLE_FREEDAY_CHECKBOX_AUTOBUILD) {
    return {
      ...state,
      checked: !state.checked,
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
      return {
        ...state,
        [action.payload.semester]: semTimetable(state[action.payload.semester], action),
      };
    default:
      return state;
  }
}

export default autobuild;