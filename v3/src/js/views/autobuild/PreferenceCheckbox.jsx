// @flow

import React from 'react';
import { connect } from 'react-redux';
import config from 'config';

import Checkbox from 'react-checkbox';

import { toggleFreeWeekdayAutobuild } from 'actions/autobuild';

import type {
  FreedayPreferences,
} from 'types/autobuild';

import type {
  Semester,
} from 'types/modules';

type Props = {
  day: String,
  preferences: FreedayPreferences,
  semester: Semester,
  toggleFreeWeekdayAutobuild: Function,
};

const PreferenceCheckbox = function foo(props: Props) {
  const day = props.day;
  return (
    <Checkbox checked={props.preferences[day]} onChange={() =>
      props.toggleFreeWeekdayAutobuild(props.semester, day)} />
  );
};

function mapStateToProps(state) {
  const semester = config.semester;
  const autobuild = state.autobuild[semester] || {};
  const preferences = autobuild.freedayPreferences || {};
  return {
    preferences,
    semester,
  };
}

export default connect(
  mapStateToProps,
  {
    toggleFreeWeekdayAutobuild,
  },
)(PreferenceCheckbox);
