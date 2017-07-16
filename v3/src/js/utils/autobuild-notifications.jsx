/* eslint-disable no-console */

import { Link } from 'react-router';
import React from 'react';

export const NOT_ENOUGH_MODULES_NOTIFICATION = {
  message: 'You have not specified enough modules to satisfy your selected workload',
  level: 'error',
};

export const DOUBLE_UNSAT_NOTIFICATION = {
  message: 'Sorry, a free day is simply not possible with your workload',
  level: 'error',
};

export const UNSAT_NOTIFICATION = {
  message: 'Sorry, there is no timetable that meets your specified constraints',
  level: 'error',
};

export const TEST_NOTIFICATION = {
  message: 'Notification message',
  level: 'success',
};

export const PORT_TIMETABLE_SUCCESSFUL_NOTIFICATION = {
  message: 'Timetable ported successfully to mainpage!',
  level: 'success',
  children: (
    <div>
      <br />
      <button className="btn-success">
        <Link style={{ display: 'block', height: '100%', color: '#fff' }} to="/timetable">
          Take me there!
        </Link>
      </button>
    </div>
  ),
  autoDismiss: 10,
};

export const ERROR_NOTIFICATION = {
  message: 'Please wait a while before resending your request',
  level: 'error',
};

export const TOO_MANY_COMP_MODULES_NOTIFICATION = {
  message: 'You have provided more compulsory modules than your intended workload!',
  level: 'error',
};

export const RELAXED_SAT_NOTIFICATION = {
  message: 'Timetable generated successfully, but we were unable to meet your preferred free days. ' +
  'We have moved the modules in your timetable to the compulsory section',
  level: 'info',
};

export const SAT_NOTIFICATION = {
  message: 'Timetable generated successfully! We have moved the modules in your ' +
  'timetable to the compulsory section',
  level: 'success',
};

export const LOAD_PREVIOUS_OPTIONS_SUCCESSFUL_NOTIFICATION = {
  message: 'Previous options loaded!',
  level: 'success',
};
