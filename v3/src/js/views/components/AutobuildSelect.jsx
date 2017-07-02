// @flow

import React from 'react';
import Select from 'react-select';

type Props = {
  options: Object,
  onChange: Function,
  placeholder: string,
  searchable?: boolean,
  value?: string,
  name?: string,
};

const AutobuildWorkloadSelect = (props: Props) => {
  return (
    <Select options={props.options}
      name={props.name}
      value={props.value}
      // placeholder={props.placeholder}
      onChange={props.onChange}
      searchable={props.searchable ? props.searchable : false}
      clearable={false}
    />
  );
};

export default AutobuildWorkloadSelect;
