// @flow
/* eslint-disable no-duplicate-imports */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

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
  toggleFreeWeekdayAutobuild,
  changeBeforeTime,
  changeAfterTime,
} from 'actions/autobuild';

import config from 'config';

type Props = {
  autobuild: Object,
  toggleBeforeOption: Function,
  toggleAfterOption: Function,
  toggleFreedayAutobuild: Function,
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
  /* componentDidMount() {
    setTimeout(() => {
      this.props.addSteps(allSteps);
    }, 500);
  } */

  render() {
    return (
      <Collapsible trigger="More Options" id="moreOptions">
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
            {/* Should create a component for this, a lot of code duplication */}
            <Checkbox checked={this.props.autobuild.Mon} onChange={() =>
              this.props.toggleFreeWeekdayAutobuild(this.props.semester, 'Mon')} />&nbsp;Mon &nbsp;
            <Checkbox checked={this.props.autobuild.Tue} onChange={() =>
              this.props.toggleFreeWeekdayAutobuild(this.props.semester, 'Tue')} />&nbsp;Tue &nbsp;
            <Checkbox checked={this.props.autobuild.Wed} onChange={() =>
              this.props.toggleFreeWeekdayAutobuild(this.props.semester, 'Wed')} />&nbsp;Wed &nbsp;
            <Checkbox checked={this.props.autobuild.Thu} onChange={() =>
              this.props.toggleFreeWeekdayAutobuild(this.props.semester, 'Thu')} />&nbsp;Thurs &nbsp;
            <Checkbox checked={this.props.autobuild.Fri} onChange={() =>
              this.props.toggleFreeWeekdayAutobuild(this.props.semester, 'Fri')} />&nbsp;Fri &nbsp;
            <Checkbox checked={this.props.autobuild.Any} onChange={() =>
              this.props.toggleFreeWeekdayAutobuild(this.props.semester, 'Any')} />
            &nbsp;No Preference (default) &nbsp;
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
    toggleFreeWeekdayAutobuild,
    changeBeforeTime,
    changeAfterTime,
  },
)(MoreOptions);
