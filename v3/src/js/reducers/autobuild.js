import { ADD_MODULE_AUTOBUILD_COMP, ADD_MODULE_AUTOBUILD_OPT } from 'actions/autobuild';

// even though we only need array, using object to maintain type compatibility
function semTimetable(state = {}, action) {
  if (!action.payload) {
    return state;
  }
  const moduleCode = action.payload.moduleCode;
  if (!moduleCode) {
    return state;
  }
  switch (action.type) {
    case ADD_MODULE_AUTOBUILD_COMP:
      return {
        ...state,
        [moduleCode]: 'comp',
      };
    case ADD_MODULE_AUTOBUILD_OPT:
      return {
        ...state,
        [moduleCode]: 'opt',
      };
    default:
      return state;
  }
}

function autobuild(state = {}, action) {
  switch (action.type) {
    case ADD_MODULE_AUTOBUILD_COMP:
    case ADD_MODULE_AUTOBUILD_OPT:
      return {
        ...state,
        [action.payload.semester]: semTimetable(state[action.payload.semester], action),
      };
    default:
      return state;
  }
}

export default autobuild;
