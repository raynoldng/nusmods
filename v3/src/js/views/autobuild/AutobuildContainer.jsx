// @flow
/* eslint-disable no-duplicate-imports */
import Checkbox from 'react-checkbox';
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
import autobind from 'react-autobind';
import _ from 'lodash';
import config from 'config';
import classnames from 'classnames';
import { getSemModuleSelectList } from 'reducers/entities/moduleBank';
import { downloadAsJpeg, downloadAsIcal } from 'actions/export';
import {
  addModule,
  cancelModifyLesson,
  changeLesson,
  modifyLesson,
  removeModule,
  removeAllModules,
} from 'actions/timetables';
import {
  addModuleAutobuildComp,
  addModuleAutobuildOpt,
  removeModuleAutobuild,
  toggleFreedayAutobuild,
} from 'actions/autobuild';
import { toggleTimetableOrientation } from 'actions/theme';
import { getModuleTimetable, areLessonsSameClass } from 'utils/modules';
import { isCompMod, isOptMod, autobuildToSemTimetableConfig } from 'utils/autobuild';
import {
  timetableLessonsArray,
  hydrateSemTimetableWithLessons,
  arrangeLessonsForWeek,
  areOtherClassesAvailable,
  lessonsForLessonType,
} from 'utils/timetables';
import ModulesSelect from 'views/components/ModulesSelect';

import Timetable from '../timetable/Timetable';
import TimetableModulesTable from '../timetable/TimetableModulesTable';

type Props = {
  semester: number,
  modules: Module,
  theme: string,
  colors: ThemeState,
  autobuildcolors: ThemeState,
  activeLesson: ModifiableLesson,
  timetableOrientation: TimetableOrientation,
  hiddenInTimetable: Array<ModuleCode>,
  addModule: Function,
  removeModule: Function,
  modifyLesson: Function,
  changeLesson: Function,
  cancelModifyLesson: Function,
  toggleTimetableOrientation: Function,
  downloadAsJpeg: Function,
  downloadAsIcal: Function,
  removeAllModules: Function,
  addModuleAutobuildComp: Function,
  addModuleAutobuildOpt: Function,
  toggleFreedayAutobuild: Function,
  autobuild: Object,
  removeModuleAutobuild: Function,
  semModuleListAutobuild: Array<Object>,
  semTimetableWithLessonsAutobuild: SemTimetableConfig,
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

  isHiddenInTimetable(moduleCode: ModuleCode) {
    return this.props.hiddenInTimetable.includes(moduleCode);
  }

  modifyCell(lesson: ModifiableLesson) {
    if (lesson.isAvailable) {
      this.props.changeLesson(this.props.semester, lesson);
    } else if (lesson.isActive) {
      this.props.cancelModifyLesson();
    } else {
      this.props.modifyLesson(lesson);
    }
  }

  render() {
    let timetableLessons: Array<Lesson | ModifiableLesson> = timetableLessonsArray(
      this.props.semTimetableWithLessonsAutobuild);
    if (this.props.activeLesson) {
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
          return {
            ...lesson,
            isModifiable: areOtherClassesAvailable(moduleTimetable, lesson.LessonType),
          };
        });
      });
    });

    const isHorizontalOrientation = this.props.timetableOrientation === HORIZONTAL;

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
                onModifyCell={this.modifyCell}
                ref={r => (this.timetableDom = r && r.timetableDom)}
              />
              <br />
            </div>
            <div className={classnames({
              'col-md-12': isHorizontalOrientation,
              'col-md-4': !isHorizontalOrientation,
            })}>
              <div className="timetable-action-row text-xs-right">
                <button type="button"
                  className="btn btn-outline-primary"
                  onClick={this.props.toggleTimetableOrientation}
                >
                  <i className={classnames('fa', 'fa-exchange', {
                    'fa-rotate-90': isHorizontalOrientation,
                  })} />
                </button>
                <button type="button"
                  className="btn btn-outline-primary"
                  onClick={() => this.props.downloadAsJpeg(this.timetableDom)}
                >
                  <i className="fa fa-image" />
                </button>
                <button type="button"
                  className="btn btn-outline-primary"
                  onClick={() => this.props.downloadAsIcal(
                    this.props.semester, this.props.semTimetableWithLessonsAutobuild, this.props.modules)}
                >
                  <i className="fa fa-calendar" />
                </button>
                <button type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    this.props.removeAllModules(this.props.semester);
                  }
                  }
                >
                  <i className="fa fa-trash" />
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
                  <Checkbox checked={this.props.autobuild.checked}
                    onChange={() => {
                      this.props.toggleFreedayAutobuild(this.props.semester);
                    }}
                  /> I want a free day!
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
  };
}

export default connect(
  mapStateToProps,
  {
    addModule,
    removeModule,
    modifyLesson,
    changeLesson,
    cancelModifyLesson,
    toggleTimetableOrientation,
    downloadAsJpeg,
    downloadAsIcal,
    removeAllModules,
    addModuleAutobuildComp,
    addModuleAutobuildOpt,
    removeModuleAutobuild,
    toggleFreedayAutobuild,
  },
)(AutobuildContainer);
