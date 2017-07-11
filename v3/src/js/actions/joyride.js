// @flow

export const ADD_STEP: string = 'ADD_STEP';
export function addStep(step: Object): FSA {
  let newSteps = step;
  if (!Array.isArray(newSteps)) {
    newSteps = [newSteps];
  }
  return {
    type: ADD_STEP,
    payload: {
      step: newSteps,
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
