// @flow
import type {
  ModuleCode,
} from 'types/modules';
import type { FSA } from 'types/redux';

import { API_REQUEST } from 'middlewares/requests-middleware';
import NUSModsPlannerApi from 'apis/nusmodsplanner';

export const FETCH_PLANNER_QUERY: string = 'FETCH_PLANNER_QUERY';
export function fetchPlannerQuery(compModuleCodes: Array<ModuleCode>,
  optModuleCodes: Array<ModuleCode>,
  numMods: number): FSA {
  return {
    type: FETCH_PLANNER_QUERY,
    payload: {
      method: 'GET',
      url: NUSModsPlannerApi.plannerQueryUrl(compModuleCodes, optModuleCodes, numMods),
    },
    meta: {
      [API_REQUEST]: true,
    },
  };
}

export const LOAD_PLANNER_QUERY: string = 'LOAD_PLANNER_QUERY';
export function loadPlannerQuery(compModuleCodes: Array<ModuleCode>,
  optModuleCodes: Array<ModuleCode>,
  numMods: number): FSA {
  return (dispatch: Function) => {
    // TODO some form of cache check so that we dont send the same query
    return dispatch(fetchPlannerQuery(compModuleCodes, optModuleCodes, numMods));
  };
}
