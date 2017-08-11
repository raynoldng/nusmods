// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'react-autobind';

import {
  switchMode,
  removeAllOptModulesAutobuild,
  removeAllCompModulesAutobuild,
} from 'actions/autobuild';

import type {
  TimetableOrientation,
} from 'types/reducers';

import { HORIZONTAL } from 'types/reducers';

import classnames from 'classnames';
import { toggleTimetableOrientation } from 'actions/theme';

import config from 'config';

type Props = {
  autobuild: Object,
  switchMode: Function,
  toggleTimetableOrientation: Function,
  semester: Number,
  timetableOrientation: TimetableOrientation,
  removeAllOptModulesAutobuild: Function,
  removeAllCompModulesAutobuild: Function,
};

class ModeButtons extends Component {

  constructor(props: Props) {
    super(props);
    autobind(this);
  }

  render() {
    const isLockingMode = this.props.autobuild.mode === 'lock';
    const isUnlockingMode = this.props.autobuild.mode === 'unlock';
    const isNormalMode = !this.props.autobuild.mode;
    const isHorizontalOrientation = this.props.timetableOrientation === HORIZONTAL;

    return (
      <div className="timetable-action-row text-xs-right" id="mode-switch">
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
          onClick={() => {
            this.props.removeAllCompModulesAutobuild(this.props.semester);
          }
          }
        >
          <i className="fa fa-trash" /> Compulsory
        </button>
        <button type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            this.props.removeAllOptModulesAutobuild(this.props.semester);
          }
          }
        >
          <i className="fa fa-trash" /> Optional
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
    );
  }
}

function mapStateToProps(state) {
  const semester = config.semester;
  const autobuild = state.autobuild[semester] || {};
  const timetableOrientation = state.theme.timetableOrientation;

  return {
    autobuild,
    semester,
    timetableOrientation,
  };
}

export default connect(
  mapStateToProps,
  {
    toggleTimetableOrientation,
    switchMode,
    removeAllOptModulesAutobuild,
    removeAllCompModulesAutobuild,
  },
)(ModeButtons);
