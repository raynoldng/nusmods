/* eslint-disable no-console */
/* eslint-disable no-case-declarations */

import {
  ADD_STEP,
  START_JOYRIDE,
} from 'actions/joyride';

function joyride(state = {}, action) {
  switch (action.type) {
    case START_JOYRIDE:
      return {
        ...state,
        isRunning: true,
      };
    case ADD_STEP:
      return {
        ...state,
        steps: state.steps ? state.steps.concat(action.payload.step) : action.payload.step,
      };
    default:
      return state;
  }
}

export default joyride;
