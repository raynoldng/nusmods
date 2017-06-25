// @flow
import type { FSA } from 'types/redux';
import type {
  SettingsState,
} from 'types/reducers';

import { routerReducer } from 'react-router-redux';

import requests from './requests';
import entities from './entities';
import timetables from './timetables';
import app from './app';
import theme from './theme';
import settings from './settings';
import autobuild from './autobuild';

type State = {
  entities: Object,
  requests: Object,
  timetables: Object,
  routing: Object,
  app: Object,
  theme: Object,
  settings: SettingsState,
};

// $FlowFixMe: State default is delegated to its child reducers.
const defaultState: State = {};

export default function (state: State = defaultState, action: FSA) {
  return {
    entities: entities(state.entities, action),
    requests: requests(state.requests, action),
    timetables: timetables(state.timetables, action, state.autobuild, state.entities),
    routing: routerReducer(state.routing, action),
    app: app(state.app, action),
    theme: theme(state.theme, action),
    settings: settings(state.settings, action),
    autobuild: autobuild(state.autobuild, action),
  };
}
