import * as React from 'react';
import { ColumnModel } from '../types';
import { FilterPopover, TableFilterOptions } from 'ui/mluvii/table-filters';

type ISetFilter = (fieldName: string | number, params: TableFilterOptions) => void;

interface FilterRendererProps {
  columnModel: ColumnModel;
  label: string | JSX.Element;
  id: string;
  filterValue?: TableFilterOptions;
  setFilter?: ISetFilter;
  onUpdate?: () => void;
}

export class FilterRenderer extends React.PureComponent<FilterRendererProps> {
  static defaultProps: Partial<FilterRendererProps> = {
    setFilter: (...args: any[]) =>
      console.warn('setFilter on FilterRenderer is not set', args),
    onUpdate: (...args: any[]) =>
      console.warn('onUpdate on FilterRenderer is not set', args)
  };

  applyFilter = (f: TableFilterOptions) => {
    this.props.setFilter(this.props.columnModel.dataKey, f);
    this.props.onUpdate();
  };

  render() {
    const { filterObjectProp, filterNullable, filterType } = this.props.columnModel;

    return (
      !!filterType && (
        <FilterPopover
          id={this.props.id}
          label={this.props.label}
          onChange={this.applyFilter}
          type={filterType}
          value={this.props.filterValue}
          nullable={filterNullable}
          filterObjectProp={filterObjectProp}
        />
      )
    );
  }
}
