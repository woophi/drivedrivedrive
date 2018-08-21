import * as React from 'react';
import { CellContainer } from './CellContainer';
import { NamedTableHeader } from './NamedTableHeader';
import { SortAndFilterState, TableConfig, TableModel } from '../types';
import { ResizeHandle } from './ResizeHandle';

const renderLabel = (label: string, fallback?: string) =>
  label === '' ? label : !label ? fallback : label;

interface HeaderRowRendererProps {
  model: TableModel;
  config: TableConfig<any>;
  tableState: SortAndFilterState;
  lineRef: React.RefObject<HTMLDivElement>;
}

export class HeaderRowContentRenderer extends React.PureComponent<
  HeaderRowRendererProps
> {
  cellsRefs = this.props.config.model.map(() =>
    React.createRef<HTMLDivElement>()
  );

  sortDir = (columnDataKey: string) =>
    this.props.tableState.sortBy === columnDataKey
      ? this.props.tableState.sortDirection
      : null;

  render() {
    const { model, config, tableState } = this.props;

    const cells = model.map((columnModel, index) => {
      const label = renderLabel(columnModel.label, columnModel.dataKey);
      const width =
        tableState.columnWidths[columnModel.dataKey] || columnModel.width;

      const showDivider = config.showHeaderDividers
        ? model.length - 1 !== index
        : false;

      const resizer = config.showHeaderDividers ? (
        <ResizeHandle
          dataKey={columnModel.dataKey}
          changeWidth={tableState.setColumnWidth}
          cellRef={this.cellsRefs[index]}
          lineRef={this.props.lineRef}
        />
      ) : null;

      return (
        <CellContainer
          key={`header-${columnModel.dataKey}-${index}`}
          flexGrow={columnModel.flexGrow}
          flexShrink={columnModel.flexShrink}
          width={width}
          maxWidth={columnModel.maxWidth}
          minWidth={columnModel.minWidth}
          title={label}
          cellRef={this.cellsRefs[index]}
        >
          <NamedTableHeader
            label={label}
            dataKey={columnModel.dataKey}
            disableSort={columnModel.disableSort}
            sortDirection={this.sortDir(columnModel.dataKey)}
            onSort={tableState.setSort}
            onUpdate={config.onFiltersUpdated}
            showDivider={showDivider}
            showSortArrow={config.showHeaderSortControls}
            resizer={resizer}
          />
        </CellContainer>
      );
    });

    return <React.Fragment>{cells}</React.Fragment>;
  }
}
