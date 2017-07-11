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

  componentDidMount() {
    if (this.props.step) {
      setTimeout(() => {
        this.props.addStep(this.props.step);
      }, 500);
    }
  }

  render() {
    return (
      <div id={this.props.m_id}>
        <ModulesSelect moduleList={this.props.moduleList}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
        />
        <br />
        <TimetableModulesTable modules={this.props.modules}
          horizontalOrientation={this.props.isHorizontalOrientation}
          semester={this.props.semester}
          onRemoveModule={this.props.onRemoveModule}
          isOptTable={this.props.isOptTable}
        />
      </div>
    );
  }
}
