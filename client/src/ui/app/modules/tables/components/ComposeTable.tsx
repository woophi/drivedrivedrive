import * as React from 'react';
import { FlexGridTable } from './FlexGridTable';
import { ComposedTableProps, TableConfig } from '../types';

export function composeTable<T = {}, TP = {}, RP = {}>(
  config: TableConfig<T, TP, RP>
): React.ComponentClass<ComposedTableProps<T> & TP> {
  return class extends React.Component<ComposedTableProps<T> & TP> {

    render() {
      const { list, children, ...tableState } = this.props;
      return (
        <FlexGridTable list={list} config={config} tableState={tableState} />
      );
    }
  };
}
