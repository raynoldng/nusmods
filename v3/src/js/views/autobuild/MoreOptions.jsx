// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'react-autobind';

import Collapsible from 'react-collapsible';
import Checkbox from 'react-checkbox';
import NumericInput from 'react-numeric-input';

import {
  toggleBeforeOption,
  toggleAfterOption,
  toggleFreedayAutobuild,
  toggleLunchAutobuild,
  toggleFreeWeekdayAutobuild,
  changeBeforeTime,
  changeAfterTime,
} from 'actions/autobuild';

import type {
  Autobuild,
} from 'types/autobuild';

import config from 'config';
import PreferenceCheckbox from './PreferenceCheckbox';

type Props = {
  autobuild: Autobuild,
  toggleBeforeOption: Function,
  toggleAfterOption: Function,
  toggleFreedayAutobuild: Function,
  toggleLunchAutobuild: Function,
  toggleFreeWeekdayAutobuild: Function,
  changeBeforeTime: Function,
  changeAfterTime: Function,
  semester: Number,
};

class MoreOptions extends Component {

  constructor(props: Props) {
    super(props);
    autobind(this);
  }

  render() {
    return (
      <Collapsible trigger="More Options">
        <div className="row">
          <div className="col-md-12">
            <Checkbox checked={this.props.autobuild.beforeOption}
              onChange={() => {
                this.props.toggleBeforeOption(this.props.semester);
              }}
              />
            &nbsp;No lessons starting before:&nbsp;
            <NumericInput onChange={(timing) => {
              this.props.changeBeforeTime(this.props.semester, timing);
            }}
              min={8}
              max={11}
              value={this.props.autobuild.noLessonsBefore || 8}
              size={10}
              />&nbsp;a.m.
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12">
            <Checkbox checked={this.props.autobuild.afterOption}
              onChange={() => {
                this.props.toggleAfterOption(this.props.semester);
              }}
              />
            &nbsp;No lessons ending later than:&nbsp;
            <NumericInput min={4}
              max={8}
              value={this.props.autobuild.noLessonsAfter ? this.props.autobuild.noLessonsAfter - 12 : 4}
              size={10}
              onChange={(timing) => {
                this.props.changeAfterTime(this.props.semester, timing + 12);
              }}
              />&nbsp;p.m.
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12">
            <Checkbox checked={this.props.autobuild.freeday}
              onChange={() => {
                this.props.toggleFreedayAutobuild(this.props.semester);
              }}
            />&nbsp;I want a free day, preferably on these days:&nbsp;
            <PreferenceCheckbox day="Mon" />&nbsp;Mon&nbsp;
            <PreferenceCheckbox day="Tue" />&nbsp;Tue&nbsp;
            <PreferenceCheckbox day="Wed" />&nbsp;Wed&nbsp;
            <PreferenceCheckbox day="Thu" />&nbsp;Thu&nbsp;
            <PreferenceCheckbox day="Fri" />&nbsp;Fri&nbsp;
            <PreferenceCheckbox day="Any" />&nbsp;No Preference (default)&nbsp;
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Checkbox checked={this.props.autobuild.lunchOption}
              onChange={() => {
                this.props.toggleLunchAutobuild(this.props.semester);
              }}
            />&nbsp;I want a lunch hour every day!&nbsp;
          </div>
        </div>
      </Collapsible>
    );
  }
}

function mapStateToProps(state) {
  const semester = config.semester;
  const autobuild = state.autobuild[semester] || {};

  return {
    autobuild,
    semester,
  };
}

export default connect(
  mapStateToProps,
  {
    toggleBeforeOption,
    toggleAfterOption,
    toggleFreedayAutobuild,
    toggleLunchAutobuild,
    toggleFreeWeekdayAutobuild,
    changeBeforeTime,
    changeAfterTime,
  },
)(MoreOptions);
