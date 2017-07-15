// @flow
import type { TimetableConfig, SemTimetableConfig } from 'types/timetables';
import type { FetchRequest, ModuleList, ModuleSelectList } from 'types/reducers';

import React, { Component } from 'react';
import { routerShape, Link } from 'react-router';
import { connect } from 'react-redux';
import NUSModerator from 'nusmoderator';
import Joyride from 'react-joyride';

import config from 'config';
import { fetchModuleList, loadModule } from 'actions/moduleBank';

import {
  addStep,
  startJoyride,
} from 'actions/joyride';

// import allSteps from 'utils/autobuild-tour';

import ModulesSelect from './components/ModulesSelect';
import Footer from './layout/Footer';

type Props = {
  children: React.Children,
  loadModule: Function,
  fetchModuleList: Function,
  moduleList: ModuleList,
  moduleSelectList: ModuleSelectList,
  timetables: TimetableConfig,
  fetchModuleListRequest: FetchRequest,
  addStep: Function,
  startJoyride: Function,
  joyride: Object,
};

// Put outside render because this only needs to computed on page load.
const weekText = (() => {
  const week = NUSModerator.academicCalendar.getAcadWeekInfo(new Date());
  let thisWeekText = `AY20${week.year}, ${week.sem}, `;
  if (week.type !== 'Instructional') { // hide 'Instructional'
    thisWeekText += week.type;
  }
  thisWeekText += ' Week';
  if (week.num > 0) { // do not show the week number if there is only one week, eg. recess
    thisWeekText += ` ${week.num}`;
  }
  return thisWeekText;
})();

export class AppContainer extends Component {
  componentDidMount() {
    this.props.fetchModuleList();
    const semesterTimetable: SemTimetableConfig = this.props.timetables[config.semester];
    if (semesterTimetable) {
      Object.keys(semesterTimetable).forEach((moduleCode) => {
        // TODO: Handle failed loading of module.
        this.props.loadModule(moduleCode);
      });
    }
    /* setTimeout(() => {
      this.props.addStep(allSteps);
      this.props.startJoyride();
    }, 500); */
  }

  props: Props;

  joyride;

  /* eslint-disable jsx-a11y/anchor-has-content */
  render() {
    return (
      <div className="app-container">
        <Joyride ref={(c) => { this.joyride = c; }}
          steps={this.props.joyride.steps || []}
          run={this.props.joyride.isRunning} // or some other boolean for when you want to start it
          showSkipButton
          showStepsProgress
          type="continuous"
          debug
        />
        <nav className="navbar navbar-fixed-top navbar-light bg-faded nm-navbar">
          <Link className="navbar-brand nm-navbar-brand" to="/" title="Home" />
          <form className="hidden-xs-down"
            style={{ width: '100%', maxWidth: 400, display: 'inline-block' }}
          >
            <ModulesSelect moduleList={this.props.moduleSelectList}
              onChange={(moduleCode) => {
                this.context.router.push(`/modules/${moduleCode.value}`);
              }}
              placeholder="Search modules"
            />
          </form>
          <p className="pull-xs-right hidden-xs-down"><small>{weekText}</small></p>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <ul className="nm-nav-tabs">
                <li role="presentation" className="nm-nav-item">
                  <Link className="nav-link" activeClassName="active" to="/timetable">
                    <i className="fa fa-fw fa-lg fa-table" />
                    <span className="nm-link-title"> Timetable</span>
                  </Link>
                </li>
                <li role="presentation" className="nm-nav-item">
                  <Link className="nav-link" activeClassName="active" to="/modules">
                    <i className="fa fa-fw fa-lg fa-list" />
                    <span className="nm-link-title"> Browse</span>
                  </Link>
                </li>
                <li role="presentation" className="nm-nav-item">
                  <Link className="nav-link" activeClassName="active" to="/settings">
                    <i className="fa fa-fw fa-lg fa-gear" />
                    <span className="nm-link-title"> Settings</span>
                  </Link>
                </li>
                <li role="presentation" className="nm-nav-item">
                  <Link className="nav-link" activeClassName="active" to="/projectdescription">
                    <i className="fa fa-fw fa-lg fa-file-pdf-o" />
                    <span className="nm-link-title"> Project Description</span>
                  </Link>
                </li>
                <li role="presentation" className="nm-nav-item" id="autobuild-link">
                  <Link className="nav-link" activeClassName="active" to="/autobuild">
                    <i className="fa fa-fw fa-lg fa-table" />
                    <span className="nm-link-title"> Auto-Build Timetable</span>
                  </Link>
                </li>
                <li role="presentation" className="nm-nav-item">
                  <Link className="nav-link" activeClassName="active" to="/autobuild-guide">
                    <i className="fa fa-fw fa-lg fa-book" />
                    <span className="nm-link-title"> Auto-Build Guide</span>
                  </Link>
                </li>
                <li role="presentation" className="nm-nav-item">
                  <Link className="nav-link" activeClassName="active" to="/autobuild-faq">
                    <i className="fa fa-fw fa-lg fa-question-circle-o" />
                    <span className="nm-link-title"> Auto-Build FAQ</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-10 main-content">
              {this.props.fetchModuleListRequest.isPending && !this.props.moduleList.length ?
                <p>Loading...</p> : null
              }
              {this.props.fetchModuleListRequest.isSuccessful || this.props.moduleList.length ?
                this.props.children : null
              }
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

AppContainer.contextTypes = {
  router: routerShape,
};

function mapStateToProps(state) {
  return {
    moduleList: state.entities.moduleBank.moduleList,
    moduleSelectList: state.entities.moduleBank.moduleSelectList,
    timetables: state.timetables,
    fetchModuleListRequest: state.requests.fetchModuleListRequest || {},
    joyride: state.joyride || {},
  };
}

export default connect(
  mapStateToProps,
  {
    fetchModuleList,
    loadModule,
    addStep,
    startJoyride,
  },
)(AppContainer);
