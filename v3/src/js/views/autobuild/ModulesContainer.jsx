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
};

export default class extends Component {

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
      <div>
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
