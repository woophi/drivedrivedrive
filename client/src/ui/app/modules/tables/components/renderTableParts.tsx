import * as React from 'react';
import { GridCellRenderer } from 'react-virtualized';
import { DefaultTableRow } from './DefaultTableRow';
import { RowContentRenderer } from './RowContentRenderer';
import { HeaderRowContentRenderer } from './HeaderRowContentRenderer';
import { NoContent } from './NoContent';
import { SortAndFilterState, TableConfig } from '../types';
import { createComponent } from 'react-fela';

const ArrowPlaceholder = createComponent(
  () => ({
    padding: '0 .25rem'
  }),
  'div'
);

const renderArrowPlaceholder = (parent: any) =>
  parent.props.config.showRowArrows && <ArrowPlaceholder />;

export const noContentRenderer = (
  width: number,
  customContent?: () => React.ReactNode
) => (): React.ReactNode => (
  <div style={{ width: `${width}px`, overflow: 'hidden' }}>
    {customContent || <NoContent />}
  </div>
);

export const renderHeaderCellsAsRow: GridCellRenderer = ({
  key,
  style,
  parent
}) =>
  parent.props.config.hideHeader ? null : (
    <DefaultTableRow style={style} key={key} withBorder>
      <HeaderRowContentRenderer
        model={parent.props.model}
        config={parent.props.config}
        tableState={parent.props.tableState}
        lineRef={parent.props.lineRef}
      />
      {renderArrowPlaceholder(parent)}
    </DefaultTableRow>
  );

export const renderBodyCellsAsRow: GridCellRenderer = ({
  key,
  rowIndex,
  style,
  parent
}) => {
  if (rowIndex >= parent.props.list.length) {
    return null;
  }
  const {
    onRowClick,
    selectedRowGetter = () => false,
    showRowArrows,
    showRowDividers
  } = parent.props.config as TableConfig<any>;

  const { selectedRowId } = parent.props.tableState as SortAndFilterState;
  const rowData = parent.props.list[rowIndex];

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    onRowClick({
      index: rowIndex,
      rowData,
      event
    });
  }

  const selected = selectedRowGetter(rowData) === selectedRowId;
  return (
    <DefaultTableRow
      style={style}
      key={key}
      onClick={onRowClick ? onClick : undefined}
      selected={selected}
      withArrow={showRowArrows}
      withBorder={showRowDividers}
    >
      <RowContentRenderer
        rowIndex={rowIndex}
        rowData={rowData}
        model={parent.props.model}
        columnWidths={parent.props.tableState.columnWidths}
      />
      {renderArrowPlaceholder(parent)}
    </DefaultTableRow>
  );
};
