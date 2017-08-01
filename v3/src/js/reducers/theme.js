// @flow
import type { FSA } from 'types/redux';
/* eslint-disable no-duplicate-imports */
/* eslint-disable no-console */
import type {
  ColorIndex,
  ColorMapping,
  ThemeState,
} from 'types/reducers';

import _ from 'lodash';
import { ADD_MODULE, REMOVE_MODULE, REMOVE_ALL_MODULES } from 'actions/timetables';
import { SELECT_THEME,
         SELECT_MODULE_COLOR,
         TOGGLE_TIMETABLE_ORIENTATION,
         SELECT_MODULE_COLOR_AUTOBUILD,
} from 'actions/theme';
import { ADD_MODULE_AUTOBUILD,
         REMOVE_MODULE_AUTOBUILD,
         STORE_STATE,
         LOAD_STATE,
         PORT_TIMETABLE,
         UPDATE_AUTOBUILD_TIMETABLE,
} from 'actions/autobuild';

import {
  VERTICAL,
  HORIZONTAL,
} from 'types/reducers';

const defaultColorsState: ColorMapping = {};
const defaultThemeState: ThemeState = {
  // Available themes are defined in `themes.scss`
  id: 'eighties',
  colors: defaultColorsState,
  timetableOrientation: HORIZONTAL,
};

export const NUM_DIFFERENT_COLORS: number = 8;

// Returns a new index that is not present in the current color index.
// If there are more than NUM_DIFFERENT_COLORS modules already present,
// will try to balance the color distribution.
function getNewColor(currentColorIndices: Array<ColorIndex>): number {
  function generateInitialIndices(): Array<number> {
    return _.range(NUM_DIFFERENT_COLORS);
  }

  let availableColorIndices = generateInitialIndices();
  currentColorIndices.forEach((index: ColorIndex) => {
    availableColorIndices = _.without(availableColorIndices, index);
    if (availableColorIndices.length === 0) {
      availableColorIndices = generateInitialIndices();
    }
  });

  return _.sample(availableColorIndices);
}

function colors(state: ColorMapping, action: FSA): ColorMapping {
  if (action.type === UPDATE_AUTOBUILD_TIMETABLE) {
    const obj = {};
    Object.keys(action.payload.state).forEach((module, index) => {
      obj[module] = index % 8;
    });
    return {
      ...state,
      ...obj,
    };
  }
  if (!(action.payload && action.payload.moduleCode)) {
    return state;
  }
  switch (action.type) {
    case ADD_MODULE:
    case ADD_MODULE_AUTOBUILD:
      return {
        ...state,
        [action.payload.moduleCode]: getNewColor(_.values(state)),
      };
    case REMOVE_MODULE:
    case REMOVE_MODULE_AUTOBUILD:
      return _.omit(state, action.payload.moduleCode);
    case REMOVE_ALL_MODULES:
      return {};
    case SELECT_MODULE_COLOR:
    case SELECT_MODULE_COLOR_AUTOBUILD:
      return {
        ...state,
        [action.payload.moduleCode]: action.payload.colorIndex,
      };
    default:
      return state;
  }
}

function theme(state: ThemeState = defaultThemeState, action: FSA): ThemeState {
  switch (action.type) {
    case ADD_MODULE:
    case REMOVE_MODULE:
    case SELECT_MODULE_COLOR:
    case REMOVE_ALL_MODULES:
      return {
        ...state,
        colors: colors(state.colors, action),
      };
    case ADD_MODULE_AUTOBUILD:
    case REMOVE_MODULE_AUTOBUILD:
    case SELECT_MODULE_COLOR_AUTOBUILD:
    case UPDATE_AUTOBUILD_TIMETABLE:
      return {
        ...state,
        autobuildcolors: colors(state.autobuildcolors, action),
      };
    case SELECT_THEME:
      return {
        ...state,
        id: action.payload,
      };
    case TOGGLE_TIMETABLE_ORIENTATION:
      return {
        ...state,
        timetableOrientation: state.timetableOrientation === VERTICAL ? HORIZONTAL : VERTICAL,
      };
    case STORE_STATE:
      return {
        ...state,
        storedState: {
          ...state.autobuildcolors,
        },
      };
    case LOAD_STATE:
      {
        if (state.storedState) {
          return {
            ...state,
            autobuildcolors: {
              ...state.storedState,
            },
          };
        }
        return state;
      }
    case PORT_TIMETABLE:
      return {
        ...state,
        colors: {
          ...state.autobuildcolors,
        },
      };
    default:
      return state;
  }
}

export default theme;
