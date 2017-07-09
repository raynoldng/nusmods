// @flow

export const ADD_STEP: string = 'ADD_STEP';
export function addStep(step: Object): FSA {
  return {
    type: ADD_STEP,
    payload: {
      step,
    },
  };
}

export const START_JOYRIDE: string = 'START_JOYRIDE';
export function startJoyride(): FSA {
  return {
    type: START_JOYRIDE,
    payload: {},
  };
}
