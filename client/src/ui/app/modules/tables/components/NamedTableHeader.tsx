import * as React from 'react';
import { connect as fela, FelaRule, FelaStyles, IStyle } from 'react-fela';
import { SortDirectionType } from 'react-virtualized';
import { getNextSortDirection } from '../constants';
import { SortArrow } from './SortArrow';
import { ISetSort } from '../types';

type NamedTableHeaderProps = {
  label: string | JSX.Element;
  dataKey: string;
  disableSort: boolean;
  onSort?: ISetSort;
  onUpdate?: () => void;
  showDivider: boolean;
  showSortArrow?: boolean;
  sortDirection: SortDirectionType;
  resizer: any;
};

class NamedTableHeaderComponent extends React.Component<
  NamedTableHeaderProps & FelaStyles<typeof mapStylesToProps>
> {
  static defaultProps: Partial<NamedTableHeaderProps> = {
    onSort: () => null,
    onUpdate: () => null,
    disableSort: false,
    showSortArrow: false,
    showDivider: false
  };

  onClick = this.props.disableSort
    ? undefined
    : () => {
        const newState = {
          sortBy: this.props.dataKey,
          sortDirection: getNextSortDirection(this.props.sortDirection)
        };
        this.props.onSort(newState);
        this.props.onUpdate();
      };

  render() {
    const { sortDirection, showSortArrow, disableSort, styles } = this.props;

    const sortArrow = !!sortDirection &&
      !disableSort &&
      showSortArrow && <SortArrow sortDirection={sortDirection} />;

    return (
      <div className={styles.container} onClick={this.onClick}>
        <div className={`text-truncate ${styles.label}`}>
          {this.props.label}
        </div>
        <div className={`curp ${styles.childLabel}`}>{this.props.children}</div>
        <div className={styles.arrow}>{sortArrow}</div>
        {this.props.resizer}
      </div>
    );
  }
}

const label: FelaRule<NamedTableHeaderProps> = () => ({
  userSelect: 'none',
  padding: '0 0.5rem',
  fontWeight: 'bold'
});
const childLabel: FelaRule<NamedTableHeaderProps> = () => ({
  paddingRight: '0.25rem'
});
const arrow: FelaRule<NamedTableHeaderProps> = () => ({
  marginLeft: 'auto'
});
const container: FelaRule<NamedTableHeaderProps> = props => {
  const withDivider: IStyle = props.showDivider && {
    border: `1px solid ${props.theme.palette.line}`,
    borderTop: 0,
    borderBottom: 0,
    borderLeft: 0
  };
  return {
    display: 'flex',
    padding: 0,
    alignItems: 'center',
    flexBasis: 0,
    flexGrow: 1,
    maxWidth: '100%',
    cursor: props.disableSort ? undefined : 'pointer',
    fontSize: '1.25rem',
    ...withDivider
  };
};

const mapStylesToProps = {
  label,
  container,
  childLabel,
  arrow
};

export const NamedTableHeader = fela(mapStylesToProps)(
  NamedTableHeaderComponent
);
