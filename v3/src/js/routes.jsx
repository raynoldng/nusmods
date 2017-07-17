import React from 'react';
import {
  Router,
  Route,
  // IndexRoute,
  IndexRedirect,
} from 'react-router';
import { Provider } from 'react-redux';

/* eslint-disable import/no-named-as-default */
import AppContainer from 'views/AppContainer';
import NotFoundPage from 'views/NotFoundPage';

import AboutContainer from 'views/static/AboutContainer';
import FaqContainer from 'views/static/FaqContainer';
import TimetableContainer from 'views/timetable/TimetableContainer';
// import ModulesContainer from 'views/browse/ModulesContainer';
// import ModuleFinderContainer from 'views/browse/ModuleFinderContainer';
// import ModulePageContainer from 'views/browse/ModulePageContainer';
import SettingsContainer from 'views/settings/SettingsContainer';
import TeamContainer from 'views/static/TeamContainer';
import ProjectDescriptionContainer from 'views/static/ProjectDescriptionContainer';
import AutobuildContainer from 'views/autobuild/AutobuildContainer';
import AutobuildGuideContainer from 'views/static/AutobuildGuideContainer';
import AutobuildFAQContainer from 'views/static/AutobuildFAQContainer';

/* eslint-disable react/prop-types */
export default function ({ store, history }) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={AppContainer}>
          <IndexRedirect to="/timetable" />
          <Route path="/about" component={AboutContainer} />
          <Route path="/faq" component={FaqContainer} />
          <Route path="/timetable" component={TimetableContainer} />
          { /*
            <Route path="/modules" component={ModulesContainer}>
              <IndexRoute component={ModuleFinderContainer} />
              <Route path=":moduleCode" component={ModulePageContainer} />
            </Route>
          */}
          <Route path="/settings" component={SettingsContainer} />
          <Route path="/team" component={TeamContainer} />
          <Route path="/projectdescription" component={ProjectDescriptionContainer} />
          <Route path="/autobuild" component={AutobuildContainer} />
          <Route path="/autobuild-guide" component={AutobuildGuideContainer} />
          <Route path="/autobuild-faq" component={AutobuildFAQContainer} />
          <Route path="*" component={NotFoundPage} />
        </Route>
      </Router>
    </Provider>
  );
}
