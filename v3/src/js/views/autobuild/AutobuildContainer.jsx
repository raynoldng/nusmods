// @flow

import type {
  ThemeState,
  TimetableOrientation,
} from 'types/reducers';
import {
  HORIZONTAL,
} from 'types/reducers';
import type {
  ModifiableLesson,
  Lesson,
  Module,
  ModuleCode,
  RawLesson,
} from 'types/modules';
import type { SemTimetableConfig, TimetableArrangement } from 'types/timetables';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import NotificationSystem from 'react-notification-system';
import autobind from 'react-autobind';
import _ from 'lodash';
import config from 'config';
import classnames from 'classnames';
import { getSemModuleSelectList } from 'reducers/entities/moduleBank';
import {
  cancelModifyLesson,
  modifyLesson,
} from 'actions/timetables';
import {
  addModuleAutobuild,
  removeModuleAutobuild,
  changeWorkloadAutobuild,
  changeLessonAutobuild,
  lockLessonAutobuild,
  unlockLessonAutobuild,
  fetchAndSolveQuery,
  storeState,
  loadState,
  portTimetableToMain,
  changeNumFreedays,
  unlockGenerateTimetable,
} from 'actions/autobuild';
import {
  addStep,
  startJoyride,
} from 'actions/joyride';
import { getModuleTimetable, areLessonsSameClass } from 'utils/modules';
import { isCompMod,
         isOptMod,
         autobuildToSemTimetableConfig,
         isLessonLocked,
} from 'utils/autobuild';
import {
  timetableLessonsArray,
  hydrateSemTimetableWithLessons,
  arrangeLessonsForWeek,
  areOtherClassesAvailable,
  lessonsForLessonType,
} from 'utils/timetables';
import AutobuildSelect from 'views/components/AutobuildSelect';
import {
  PORT_TIMETABLE_SUCCESSFUL_NOTIFICATION,
  LOAD_PREVIOUS_OPTIONS_SUCCESSFUL_NOTIFICATION,
} from 'utils/autobuild-notifications';
import allSteps from 'utils/autobuild-tour';

import ModeButtons from './ModeButtons';
import Timetable from './Timetable';
import MoreOptions from './MoreOptions';
import ModulesContainer from './ModulesContainer';

type Props = {
  semester: number,
  modules: Module,
  theme: string,
  colors: ThemeState,
  autobuildcolors: ThemeState,
  activeLesson: ModifiableLesson,
  timetableOrientation: TimetableOrientation,
  hiddenInTimetable: Array<ModuleCode>,
  modifyLesson: Function,
  changeLessonAutobuild: Function,
  lockLessonAutobuild: Function,
  unlockLessonAutobuild: Function,
  unlockGenerateTimetable: Function,
  cancelModifyLesson: Function,
  addModuleAutobuild: Function,
  autobuild: Object,
  freedays: Object,
  removeModuleAutobuild: Function,
  changeWorkloadAutobuild: Function,
  semModuleListAutobuild: Array<Object>,
  semTimetableWithLessonsAutobuild: SemTimetableConfig,
  fetchAndSolveQuery: Function,
  storeState: Function,
  loadState: Function,
  portTimetableToMain: Function,
  changeNumFreedays: Function,

  joyride: Object,
  addStep: Function,
  startJoyride: Function,
  // storeState: Object,
};

export class AutobuildContainer extends Component {

  constructor(props: Props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.addStep(allSteps);
      this.props.startJoyride();
    }, 100);
    this.props.unlockGenerateTimetable(this.props.semester);
  }

  componentWillUnmount() {
    this.props.cancelModifyLesson();
  }

  timetableDom: Element

  notificationSystem

  joyride

  isHiddenInTimetable(moduleCode: ModuleCode) {
    return this.props.hiddenInTimetable.includes(moduleCode);
  }

  addNotification(notif) {
    // event.preventDefault();
    this.notificationSystem.addNotification(notif);
  }

  modifyCell(lesson: ModifiableLesson) {
    if (lesson.isAvailable) {
      this.props.changeLessonAutobuild(this.props.semester, lesson);
    } else if (lesson.isActive) {
      this.props.cancelModifyLesson();
    } else {
      this.props.modifyLesson(lesson);
    }
  }

  lockCell(lesson: ModifiableLesson) {
    this.props.lockLessonAutobuild(this.props.semester, lesson);
  }

  unlockCell(lesson: ModifiableLesson) {
    // TO-DO
    this.props.unlockLessonAutobuild(this.props.semester, lesson);
  }

  render() {
    const isLockingMode = this.props.autobuild.mode === 'lock';
    const isUnlockingMode = this.props.autobuild.mode === 'unlock';
    const isNormalMode = !this.props.autobuild.mode;

    let modifyFunction;

    if (isLockingMode) {
      modifyFunction = this.lockCell;
    } else if (isUnlockingMode) {
      modifyFunction = this.unlockCell;
    } else {
      modifyFunction = this.modifyCell;
    }

    let timetableLessons: Array<Lesson | ModifiableLesson> = timetableLessonsArray(
      this.props.semTimetableWithLessonsAutobuild);
    if (this.props.activeLesson && isNormalMode) {
      const activeLesson = this.props.activeLesson;
      const moduleCode = activeLesson.ModuleCode;

      const module = this.props.modules[moduleCode];
      const moduleTimetable: Array<RawLesson> = getModuleTimetable(module, this.props.semester);
      const lessons = lessonsForLessonType(moduleTimetable, activeLesson.LessonType)
        .map((lesson) => {
          // Inject module code in
          return { ...lesson, ModuleCode: moduleCode };
        });
      const otherAvailableLessons = lessons
        .filter((lesson) => {
          // Exclude the lesson being modified.
          return !areLessonsSameClass(lesson, activeLesson);
        })
        .map((lesson) => {
          return { ...lesson, isAvailable: true };
        });
      timetableLessons = timetableLessons.map((lesson) => {
        // Identify the current lesson being modified.
        if (areLessonsSameClass(lesson, activeLesson)) {
          return { ...lesson, isActive: true };
        }
        return lesson;
      });
      timetableLessons = [...timetableLessons, ...otherAvailableLessons];
    }

    // Inject color index into lessons.
    timetableLessons = timetableLessons.map((lesson) => {
      return { ...lesson, colorIndex: this.props.autobuildcolors[lesson.ModuleCode] };
    });

    // inject hidden into lessons.
    timetableLessons = timetableLessons.filter(lesson => !this.isHiddenInTimetable(lesson.ModuleCode));

    const arrangedLessons: TimetableArrangement = arrangeLessonsForWeek(timetableLessons);
    const arrangedLessonsWithModifiableFlag: TimetableArrangement = _.mapValues(arrangedLessons, (dayRows) => {
      return dayRows.map((row) => {
        return row.map((lesson) => {
          const module: Module = this.props.modules[lesson.ModuleCode];
          const moduleTimetable: Array<RawLesson> = getModuleTimetable(module, this.props.semester);
          let modifiable: Boolean = areOtherClassesAvailable(moduleTimetable, lesson.LessonType);
          if (isLockingMode || isNormalMode) {
            modifiable = modifiable && !isLessonLocked(lesson, this.props.autobuild.lockedLessons);
          } else if (isUnlockingMode) {
            modifiable = isLessonLocked(lesson, this.props.autobuild.lockedLessons);
          }
          return {
            ...lesson,
            isModifiable: modifiable,
          };
        });
      });
    });

    const isHorizontalOrientation = this.props.timetableOrientation === HORIZONTAL;

    const workloadString = 'Select workload (default value is 5)';

    const workloadOptions = [
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 },
      { label: '7', value: 7 },
      { label: '8', value: 8 },
      { label: '9', value: 9 },
    ];

    const generateTimetableButton = (<button type="button"
      className="btn btn-info"
      onClick={() => {
        this.props.storeState(this.props.semester);
        this.props.fetchAndSolveQuery(this.props.autobuild, this.props.semester, this.addNotification);
      }}
      id="generateTimetable"
    >Generate Timetable</button>);

    const generatingButton = (<button type="button"
      className="btn btn-info"
    >Please Wait... Generating Timetable</button>);

    return (
      <DocumentTitle title={`Auto-build - ${config.brandName}`}>
        <div>
          <div className={`theme-${this.props.theme} timetable-page-container page-container`} onClick={() => {
            if (this.props.activeLesson) {
              this.props.cancelModifyLesson();
            }
          }}>
            <div className="row">
              <div className={classnames('timetable-wrapper', {
                'col-md-12': isHorizontalOrientation,
                'col-md-8': !isHorizontalOrientation,
              })}>
                <Timetable lessons={arrangedLessonsWithModifiableFlag}
                  horizontalOrientation={isHorizontalOrientation}
                  onModifyCell={modifyFunction}
                  ref={r => (this.timetableDom = r && r.timetableDom)}
                  lockedLessons={this.props.autobuild.lockedLessons}
                  id="timetable"
                />
                <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
                <br />
              </div>
              <div className={classnames({
                'col-md-12': isHorizontalOrientation,
                'col-md-4': !isHorizontalOrientation,
              })}
              >
                <ModeButtons />
                <div className="row">
                  <div className="col-md-6">
                    <ModulesContainer moduleList={this.props.semModuleListAutobuild}
                      onChange={(moduleCode) => {
                        this.props.addModuleAutobuild(this.props.semester, moduleCode.value, 'comp');
                      }}
                      modules={
                        Object.keys(_.pickBy(this.props.autobuild, isCompMod)).sort((a, b) => {
                          return a.localeCompare(b);
                        }).map((moduleCode) => {
                          const module = this.props.modules[moduleCode] || {};
                          module.colorIndex = this.props.autobuildcolors[moduleCode];
                          module.hiddenInTimetable = this.isHiddenInTimetable(moduleCode);
                          return module;
                        })}
                      horizontalOrientation={isHorizontalOrientation}
                    />
                  </div>
                  <div className="col-md-6">
                    <ModulesContainer moduleList={this.props.semModuleListAutobuild}
                      onChange={(moduleCode) => {
                        this.props.addModuleAutobuild(this.props.semester, moduleCode.value, 'opt');
                      }}
                      modules={
                        Object.keys(_.pickBy(this.props.autobuild, isOptMod)).sort((a, b) => {
                          return a.localeCompare(b);
                        }).map((moduleCode) => {
                          const module = this.props.modules[moduleCode] || {};
                          module.colorIndex = this.props.colors[moduleCode];
                          module.hiddenInTimetable = this.isHiddenInTimetable(moduleCode);
                          return module;
                        })}
                      horizontalOrientation={isHorizontalOrientation}
                      isOptTable
                    />
                  </div>
                </div>
                <div className="row" id="workloadSelect">
                  <div className="col-md-12">
                    Intended Workload (number of modules):
                  </div>
                  <div className="col-md-2">
                    <AutobuildSelect onChange={(selectedWorkload) => {
                      this.props.changeWorkloadAutobuild(this.props.semester, selectedWorkload);
                    }}
                      value={this.props.autobuild.workload}
                      name="workloadSelect"
                      placeholder={workloadString}
                      options={workloadOptions}
                      />
                  </div>

                </div>
                <br />
                <div id="moreOptions">
                  <MoreOptions />
                </div>
                <br />
                <div className="row">
                  {this.props.autobuild.lockedGen ? generatingButton : generateTimetableButton}
                  <span className="divider" style={{ width: '5px',
                    height: 'auto',
                    display: 'inline-block',
                  }} />
                  <button type="button" className="btn btn-success"
                    onClick={() => {
                      this.addNotification(LOAD_PREVIOUS_OPTIONS_SUCCESSFUL_NOTIFICATION);
                      this.props.loadState(this.props.semester);
                    }}>Load Previous Options</button>
                  <span className="divider" style={{ width: '5px',
                    height: 'auto',
                    display: 'inline-block',
                  }} />
                  <button type="button" className="btn btn-failure"
                    onClick={() => {
                      this.props.portTimetableToMain(this.props.semester);
                      this.addNotification(PORT_TIMETABLE_SUCCESSFUL_NOTIFICATION);
                    }}>Port Timetable to Mainpage</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

AutobuildContainer.contextTypes = {
  router: PropTypes.object,
};

function mapStateToProps(state) {
  const modules = state.entities.moduleBank.modules;
  const semester = config.semester;
  const hiddenInTimetable = state.settings.hiddenInTimetable || [];
  const autobuild = state.autobuild[semester] || {};
  const semModuleListAutobuild = getSemModuleSelectList(state.entities.moduleBank, semester, autobuild);
  const semTimetableWithLessonsAutobuild = hydrateSemTimetableWithLessons(
    autobuildToSemTimetableConfig(autobuild), modules, semester);
  // const isLockingMode = state.autobuild.lockingMode || false;
  const joyride = state.joyride || {};

  return {
    semester,
    modules,
    activeLesson: state.app.activeLesson,
    theme: state.theme.id,
    colors: state.theme.colors,
    autobuildcolors: state.theme.autobuildcolors,
    timetableOrientation: state.theme.timetableOrientation,
    hiddenInTimetable,
    autobuild,
    semModuleListAutobuild,
    semTimetableWithLessonsAutobuild,
    joyride,
    // storeState: state,
    // isLockingMode,
  };
}

export default connect(
  mapStateToProps,
  {
    modifyLesson,
    changeLessonAutobuild,
    cancelModifyLesson,
    addModuleAutobuild,
    removeModuleAutobuild,
    changeNumFreedays,
    changeWorkloadAutobuild,
    lockLessonAutobuild,
    unlockLessonAutobuild,
    unlockGenerateTimetable,
    fetchAndSolveQuery,
    storeState,
    loadState,
    portTimetableToMain,

    addStep,
    startJoyride,
  },
)(AutobuildContainer);
