// @flow
/* eslint-disable no-duplicate-imports */
/* eslint-disable no-alert */
/* eslint-disable no-console */

import Checkbox from 'react-checkbox';
// import storage from 'storage';
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
  addModuleAutobuildComp,
  addModuleAutobuildOpt,
  removeModuleAutobuild,
  toggleFreedayAutobuild,
  changeWorkloadAutobuild,
  changeLessonAutobuild,
  lockLessonAutobuild,
  unlockLessonAutobuild,
  switchMode,
  fetchAndSolveQuery,
  changeBeforeTime,
  changeAfterTime,
  storeState,
  loadState,
  portTimetableToMain,
} from 'actions/autobuild';
import { toggleTimetableOrientation } from 'actions/theme';
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
import ModulesSelect from 'views/components/ModulesSelect';
import AutobuildSelect from 'views/components/AutobuildSelect';
import {
  PORT_TIMETABLE_SUCCESSFUL_NOTIFICATION,
} from 'utils/autobuild-notifications';


import TimetableModulesTable from './TimetableModulesTable';
import Timetable from './Timetable';


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
  cancelModifyLesson: Function,
  toggleTimetableOrientation: Function,
  addModuleAutobuildComp: Function,
  addModuleAutobuildOpt: Function,
  toggleFreedayAutobuild: Function,
  autobuild: Object,
  removeModuleAutobuild: Function,
  changeWorkloadAutobuild: Function,
  semModuleListAutobuild: Array<Object>,
  semTimetableWithLessonsAutobuild: SemTimetableConfig,
  switchMode: Function,
  fetchAndSolveQuery: Function,
  changeBeforeTime: Function,
  changeAfterTime: Function,
  storeState: Function,
  loadState: Function,
  portTimetableToMain: Function,
  // storeState: Object,
};

export class AutobuildContainer extends Component {

  constructor(props: Props) {
    super(props);
    autobind(this);
  }

  componentWillUnmount() {
    this.props.cancelModifyLesson();
  }

  timetableDom: Element

  notificationSystem

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

    const workloadString = this.props.autobuild.workload ?
                            `Workload selected: ${this.props.autobuild.workload} modules` :
                            'Select workload (number of modules, default value is 5)';

    const workloadOptions = [
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 },
      { label: '7', value: 7 },
      { label: '8', value: 8 },
      { label: '9', value: 9 },
    ];

    const noBeforeString = this.props.autobuild.noLessonsBefore ?
                            `${this.props.autobuild.noLessonsBefore} a.m.` :
                            'Select time (optional)';

    const noLessonsBeforeOptions = [
      { label: 'Nil', value: undefined },
      { label: '8 a.m.', value: 8 },
      { label: '9 a.m.', value: 9 },
      { label: '10 a.m.', value: 10 },
      { label: '11 a.m.', value: 11 },
    ];

    const noAfterString = this.props.autobuild.noLessonsAfter ?
                            `${this.props.autobuild.noLessonsAfter - 12} p.m.` :
                            'Select time (optional)';

    const noLessonsAfterOptions = [
      { label: 'Nil', value: undefined },
      { label: '4 p.m.', value: 16 },
      { label: '5 p.m.', value: 17 },
      { label: '6 p.m.', value: 18 },
      { label: '7 p.m.', value: 19 },
      { label: '8 p.m.', value: 20 },
    ];

    return (
      <DocumentTitle title={`Auto-build - ${config.brandName}`}>
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
              />
              <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
              <br />
            </div>
            <div className={classnames({
              'col-md-12': isHorizontalOrientation,
              'col-md-4': !isHorizontalOrientation,
            })}>
              <div className="timetable-action-row text-xs-right">
                <button type="button"
                  className={classnames('btn', { 'btn-outline-primary': !isNormalMode }, {
                    'btn-primary': isNormalMode,
                  })}
                  onClick={() => this.props.switchMode(this.props.semester, '')}
                >
                  Normal Mode
                </button>
                <button type="button"
                  className={classnames('btn', { 'btn-outline-primary': !isLockingMode }, {
                    'btn-primary': isLockingMode,
                  })}
                  onClick={() => this.props.switchMode(this.props.semester, 'lock')}
                >
                  Lock Mode
                </button>
                <button type="button"
                  className={classnames('btn', { 'btn-outline-primary': !isUnlockingMode }, {
                    'btn-primary': isUnlockingMode,
                  })}
                  onClick={() => this.props.switchMode(this.props.semester, 'unlock')}
                >
                  Unlock Mode
                </button>
                <button type="button"
                  className="btn btn-outline-primary"
                  onClick={this.props.toggleTimetableOrientation}
                >
                  <i className={classnames('fa', 'fa-exchange', {
                    'fa-rotate-90': isHorizontalOrientation,
                  })} />
                </button>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <ModulesSelect moduleList={this.props.semModuleListAutobuild}
                    onChange={(moduleCode) => {
                      this.props.addModuleAutobuildComp(this.props.semester, moduleCode.value);
                    }}
                    placeholder="Add compuslory module to timetable"
                  />
                  <br />
                  <TimetableModulesTable modules={
                    Object.keys(_.pickBy(this.props.autobuild, isCompMod)).sort((a, b) => {
                      return a.localeCompare(b);
                    }).map((moduleCode) => {
                      const module = this.props.modules[moduleCode] || {};
                      // Inject color index.
                      module.colorIndex = this.props.autobuildcolors[moduleCode];
                      module.hiddenInTimetable = this.isHiddenInTimetable(moduleCode);
                      return module;
                    })}
                    horizontalOrientation={isHorizontalOrientation}
                    semester={this.props.semester}
                    onRemoveModule={(moduleCode) => {
                      this.props.removeModuleAutobuild(this.props.semester, moduleCode);
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <ModulesSelect moduleList={this.props.semModuleListAutobuild}
                    onChange={(moduleCode) => {
                      this.props.addModuleAutobuildOpt(this.props.semester, moduleCode.value);
                    }}
                    placeholder="Add optional module to timetable"
                  />
                  <br />
                  <TimetableModulesTable modules={
                    Object.keys(_.pickBy(this.props.autobuild, isOptMod)).sort((a, b) => {
                      return a.localeCompare(b);
                    }).map((moduleCode) => {
                      const module = this.props.modules[moduleCode] || {};
                      // Inject color index.
                      module.colorIndex = this.props.colors[moduleCode];
                      module.hiddenInTimetable = this.isHiddenInTimetable(moduleCode);
                      return module;
                    })}
                    horizontalOrientation={isHorizontalOrientation}
                    semester={this.props.semester}
                    onRemoveModule={(moduleCode) => {
                      this.props.removeModuleAutobuild(this.props.semester, moduleCode);
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <AutobuildSelect onChange={(selectedWorkload) => {
                    this.props.changeWorkloadAutobuild(this.props.semester, selectedWorkload);
                  }}
                    placeholder={workloadString}
                    options={workloadOptions}
                    />
                </div>
              </div>
              <br />
              Options:
              <br />
              <div className="row">
                <div className="col-md-12">
                  No lessons starting before:
                  <AutobuildSelect onChange={(timing) => {
                    this.props.changeBeforeTime(this.props.semester, timing);
                  }}
                    placeholder={noBeforeString}
                    options={noLessonsBeforeOptions}
                    />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-12">
                  No lessons ending later than:
                  <AutobuildSelect onChange={(timing) => {
                    this.props.changeAfterTime(this.props.semester, timing);
                  }}
                    placeholder={noAfterString}
                    options={noLessonsAfterOptions}
                    />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-12">
                  <Checkbox checked={this.props.autobuild.freeday}
                    onChange={() => {
                      this.props.toggleFreedayAutobuild(this.props.semester);
                    }}
                  /> I want a free day!
                </div>
              </div>
              <br />
              <div className="row">
                <button type="button" className="btn btn-info"
                  onClick={() => {
                    this.props.storeState(this.props.semester);
                    this.props.fetchAndSolveQuery(this.props.autobuild, this.props.semester, this.addNotification);
                    /* storage.saveState({
                      entities: {
                        moduleBank: {
                          modules: this.props.storeState.entities.moduleBank.modules,
                          moduleList: this.props.storeState.entities.moduleBank.moduleList,
                        },
                      },
                      timetables: this.props.storeState.timetables,
                      theme: this.props.storeState.theme,
                      settings: this.props.storeState.settings,
                      autobuild: this.props.storeState.autobuild,
                    });
                    window.location.reload(); */
                  }}>Generate Timetable</button>
                <span className="divider" style={{ width: '5px',
                  height: 'auto',
                  display: 'inline-block',
                }} />
                <button type="button" className="btn btn-success"
                  onClick={() => {
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
    toggleTimetableOrientation,
    addModuleAutobuildComp,
    addModuleAutobuildOpt,
    removeModuleAutobuild,
    toggleFreedayAutobuild,
    changeWorkloadAutobuild,
    switchMode,
    lockLessonAutobuild,
    unlockLessonAutobuild,
    fetchAndSolveQuery,
    changeAfterTime,
    changeBeforeTime,
    storeState,
    loadState,
    portTimetableToMain,
  },
)(AutobuildContainer);
