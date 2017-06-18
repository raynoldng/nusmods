// @flow

import React from 'react';
import Select from 'react-select';

const options = [
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
];

type Props = {
  onChange: Function,
  placeholder: string,
};

const AutobuildWorkloadSelect = (props: Props) => {
  return (
    <Select options={options}
      placeholder={props.placeholder || 'Select workload (number of modules)'}
      onChange={props.onChange}
    />
  );
};

export default AutobuildWorkloadSelect;
