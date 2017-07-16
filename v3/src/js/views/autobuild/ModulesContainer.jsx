// @flow

import React, { Component } from 'react';
import autobind from 'react-autobind';

import ModulesSelect from 'views/components/ModulesSelect';
import TimetableModulesTable from './TimetableModulesTable';

type Props = {
  moduleList: Array<Object>,
  onChange: Function,
  placeholder: String,
  modules: Array<Object>,
  isHorizontalOrientation: Boolean,
  semester: Number,
  onRemoveModule: Function,
  isOptTable?: Boolean,
  step?: Object,
  addStep: Function,
  m_id?: String
};

export default class extends Component {

  constructor(props: Props) {
    super(props);
    autobind(this);
  }

  render() {
    const placeholder = this.props.isOptTable ?
      'Add optional module to timetable' : 'Add compuslory module to timetable';
    const id = this.props.isOptTable ?
      'optMods' : 'compMods';
    return (
      <div id={id}>
        <ModulesSelect moduleList={this.props.moduleList}
          onChange={this.props.onChange}
          placeholder={placeholder}
        />
        <br />
        <TimetableModulesTable modules={this.props.modules}
          horizontalOrientation={this.props.isHorizontalOrientation}
          isOptTable={this.props.isOptTable}
        />
      </div>
    );
  }
}
