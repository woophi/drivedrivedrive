import * as React from 'react';
import { FlexGridTable } from './FlexGridTable';
import { ComposedTableProps, TableConfig } from '../types';

export function composeTable<T = {}>(
  config: TableConfig<T>
): React.ComponentClass<ComposedTableProps<T>> {
  return class extends React.Component<ComposedTableProps<T>> {

    render() {
      const { list, data, dispatch, children, ...tableState } = this.props;
      return (
        <FlexGridTable list={list} config={config} tableState={tableState} />
      );
    }
  };
}
