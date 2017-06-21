// @flow

import React from 'react';
import Select from 'react-select';

type Props = {
  options: Object,
  onChange: Function,
  placeholder: string,
};

const AutobuildWorkloadSelect = (props: Props) => {
  return (
    <Select options={props.options}
      placeholder={props.placeholder}
      onChange={props.onChange}
    />
  );
};

export default AutobuildWorkloadSelect;
