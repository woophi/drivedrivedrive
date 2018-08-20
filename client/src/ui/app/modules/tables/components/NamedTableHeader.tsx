import * as React from 'react';
import { connect as fela, FelaRule, FelaStyles } from 'react-fela';
import { SortDirectionType } from 'react-virtualized';
import { getNextSortDirection } from '../constants';
import { ResizeHandle } from './ResizeHandle';
import { SortArrow } from './SortArrow';
import { ISetSort, ISetColumnWidth } from '../types';

type NamedTableHeaderProps = {
  label: string | JSX.Element,
  dataKey: string,
  disableSort: boolean,
  onSort?: ISetSort,
  onUpdate?: () => void,
  showDivider: boolean,
  showSortArrow?: boolean;
  sortDirection: SortDirectionType,
  resizer: any;
};

class NamedTableHeaderComponent extends React.Component<NamedTableHeaderProps & FelaStyles<typeof mapStylesToProps>> {
  static defaultProps: Partial<NamedTableHeaderProps> = {
    onSort: () => null,
    onUpdate: () => null,
    disableSort: false,
    showSortArrow: false,
    showDivider: false
  };

  onClick = this.props.disableSort ? undefined : (event: React.MouseEvent<HTMLDivElement>) => {
    const newState = {
      sortBy: this.props.dataKey,
      sortDirection: getNextSortDirection(this.props.sortDirection)
    };
    this.props.onSort(newState);
    this.props.onUpdate();
  };

  render() {
    const {
      sortDirection,
      showDivider,
      showSortArrow,
      disableSort,
      styles
    } = this.props;

    const className = 'd-flex col p-0 align-items-center '.concat(
      this.props.showDivider ? 'border border-left-0 border-top-0 border-bottom-0' : ''
    );

    return (
      <div className={className}>
        <div className={`px-2 text-truncate font-weight-bold ${styles.label}`} onClick={this.onClick}>
          {this.props.label}
        </div>
        <div className={'pr-1 curp'}>
          {this.props.children}
        </div>
        <div className="ml-auto">
          {!!sortDirection && !disableSort && showSortArrow && <SortArrow sortDirection={sortDirection} />}
        </div>
        {this.props.resizer}
      </div>
    );
  }
}

const label: FelaRule<NamedTableHeaderProps> = props => ({
  userSelect: 'none',
  cursor: props.disableSort ? undefined : 'pointer'
});

const mapStylesToProps = {
  label
};

export const NamedTableHeader = fela(mapStylesToProps)(
  NamedTableHeaderComponent
);
