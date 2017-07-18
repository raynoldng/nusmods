/* eslint-disable no-nested-ternary */
// @flow
import type { ModuleWithColor, ModuleCode } from 'types/modules';
import type { ColorIndex } from 'types/reducers';

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import classnames from 'classnames';
import ColorPicker from 'views/components/color-picker/ColorPicker';
import config from 'config';

import { selectModuleColorAutobuild, modifyModuleColorAutobuild, cancelModifyModuleColor } from 'actions/theme';
import { hideLessonInTimetable, showLessonInTimetable } from 'actions/settings';
import {
  toggleModuleStatusAutobuild,
  removeModuleAutobuild,
} from 'actions/autobuild';

// import { getModuleSemExamDate, modulePagePath } from 'utils/modules';
import { getModuleSemExamDate } from 'utils/modules';

type Props = {
  activeModule: ModuleCode,
  selectModuleColorAutobuild: Function,
  modifyModuleColorAutobuild: Function,
  toggleModuleStatusAutobuild: Function,
  cancelModifyModuleColor: Function,
  hideLessonInTimetable: Function,
  showLessonInTimetable: Function,
  removeModuleAutobuild: Function,
  semester: number,
  modules: Array<ModuleWithColor>,
  onRemoveModule: Function,
  horizontalOrientation: boolean,
  isOptTable?: Boolean,
};

class TimetableModulesTable extends Component {
  componentWillUnmount() {
    this.props.cancelModifyModuleColor();
  }

  showButton(moduleCode) {
    return (
      <button className="btn-link btn-remove" onClick={() => this.props.showLessonInTimetable(moduleCode)}>
        <i className="fa fa-eye-slash" />
      </button>
    );
  }

  hideButton(moduleCode) {
    return (
      <button className="btn-link btn-remove" onClick={() => this.props.hideLessonInTimetable(moduleCode)}>
        <i className="fa fa-eye" />
      </button>
    );
  }

  moveToCompButton(moduleCode) {
    return (
      <button className="btn-link btn-remove" onClick={() =>
        this.props.toggleModuleStatusAutobuild(this.props.semester, moduleCode)}>
        <i className="fa fa-arrow-left" />
      </button>
    );
  }

  moveToOptButton(moduleCode) {
    return (
      <button className="btn-link btn-remove" onClick={() =>
        this.props.toggleModuleStatusAutobuild(this.props.semester, moduleCode)}>
        <i className="fa fa-arrow-right" />
      </button>
    );
  }

  props: Props;

  render() {
    return (
      <div className="modules-table row">
        {this.props.modules.length ?
          this.props.modules.map((module) => {
            return (
              <div className={classnames('modules-table-row', {
                'col-md-4': this.props.horizontalOrientation,
                'col-md-12': !this.props.horizontalOrientation,
              })}
                key={module.ModuleCode}
              >
                <div className="modules-table-row-inner">
                  {!this.props.isOptTable ? <div className="color-column">
                    <div className={classnames('modules-table-color', {
                      [`color-${module.colorIndex}`]: !module.hiddenInTimetable,
                      'color-muted': module.hiddenInTimetable,
                    })}
                      onClick={() => {
                        if (this.props.activeModule === module.ModuleCode) {
                          this.props.cancelModifyModuleColor();
                        } else {
                          this.props.modifyModuleColorAutobuild(module.ModuleCode);
                        }
                      }} />
                    {this.props.activeModule === module.ModuleCode &&
                      <ColorPicker onChooseColor={(colorIndex: ColorIndex) => {
                        this.props.selectModuleColorAutobuild(module.ModuleCode, colorIndex);
                      }} />
                    }
                  </div> : <div />}
                  <div className="module-details-column">
                    {/* <Link to="http://v3.nusmods.com/modules/{module.ModuleCode}" target="_blank">*/}
                    {/* {module.ModuleCode} {module.ModuleTitle}*/}
                    {/* </Link>*/}
                    <a href={`http://v3.nusmods.com/modules/${module.ModuleCode}`} target="_blank"
                      rel="noopener noreferrer">
                      {module.ModuleCode} {module.ModuleTitle}
                    </a>
                    <div>
                      <small>
                        Exam: {getModuleSemExamDate(module, this.props.semester)}
                        &nbsp;&middot;&nbsp;
                        {module.ModuleCredit} MCs
                        &nbsp;&middot;
                        <button className="btn-link btn-remove" onClick={() => {
                          this.props.removeModuleAutobuild(this.props.semester, module.ModuleCode);
                        }}>
                          Remove
                        </button>
                        {this.props.isOptTable ? undefined :
                          module.hiddenInTimetable ?
                            this.showButton(module.ModuleCode) : this.hideButton(module.ModuleCode)
                        }
                        {this.props.isOptTable ?
                            this.moveToCompButton(module.ModuleCode) : this.moveToOptButton(module.ModuleCode)
                        }
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          : <p className="text-sm-center">No modules added.</p>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeModule: state.app.activeModule,
    semester: config.semester,
  };
}

export default connect(
  mapStateToProps,
  {
    selectModuleColorAutobuild,
    modifyModuleColorAutobuild,
    cancelModifyModuleColor,
    hideLessonInTimetable,
    showLessonInTimetable,
    toggleModuleStatusAutobuild,
    removeModuleAutobuild,
  },
)(TimetableModulesTable);
