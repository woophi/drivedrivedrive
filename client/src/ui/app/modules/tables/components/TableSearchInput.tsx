import * as React from 'react';
import { connect as redux } from 'react-redux';
import { State } from 'core/models/application';
import { TablesState } from '../types';
import { SearchInput } from 'ui/mluvii';

type OwnProps = {
  tableName?: keyof TablesState,
  className?: string,
  autoFocus?: boolean
};

const mapStateToProps = (state: State, props: OwnProps) => ({
  value: state.admin.tables[props.tableName].search
});

const mapDispatchToProps = (dispatch: any, props: OwnProps) => ({
  onChange: (value: string) => dispatch({ type: 'admin/tables/setSearch', name: props.tableName, payload: value })
});

type Props = OwnProps & {
  searchQuery: string;
  onChange: (value: string) => void;
};

export const TableSearchInputComponent: React.SFC<Props> = props => (
  <SearchInput
    autoFocus={props.autoFocus}
    className={props.className}
    onChange={props.onChange}
    value={props.searchQuery}
  />
);

export const TableSearchInput = redux(mapStateToProps, mapDispatchToProps)(SearchInput);
