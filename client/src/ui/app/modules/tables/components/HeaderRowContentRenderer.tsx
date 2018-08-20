import * as React from 'react';
import { i18n } from 'core/shared/i18n';
import { CellContainer } from './CellContainer';
import { NamedTableHeader } from './NamedTableHeader';
import { FilterRenderer } from './FilterRenderer';
import { SortAndFilterState, TableConfig, TableModel } from '../types';
import { ResizeHandle } from './ResizeHandle';

const renderLabel = (label: string, fallback?: string) => (label === '' ? label :
  !label ? fallback :
  label.indexOf('::') !== -1 ? i18n.t(label) : label
);

interface HeaderRowRendererProps {
  model: TableModel;
  config: TableConfig<any>;
  tableState: SortAndFilterState;
  lineRef: React.RefObject<HTMLDivElement>;
}

export class HeaderRowContentRenderer extends React.PureComponent<HeaderRowRendererProps> {
  sortDir = (columnDataKey: string) => this.props.tableState.sortBy === columnDataKey ? this.props.tableState.sortDirection : null;

  cellsRefs = this.props.config.model.map(() => React.createRef<HTMLDivElement>());

  render() {
    const { model, config, tableState } = this.props;

    const cells = model.map((columnModel, index) => {
      const label = renderLabel(columnModel.label, columnModel.dataKey);
      const width = tableState.columnWidths[columnModel.dataKey] || columnModel.width;

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
            showDivider={config.showHeaderDividers ? model.length - 1 !== index : false}
            showSortArrow={config.showHeaderSortControls}
            resizer={config.showHeaderDividers ? <ResizeHandle
              dataKey={columnModel.dataKey}
              changeWidth={tableState.setColumnWidth}
              cellRef={this.cellsRefs[index]}
              lineRef={this.props.lineRef}
            /> : null}
          >
            <FilterRenderer
              id={`table-filter-of-${columnModel.dataKey}`}
              columnModel={columnModel}
              label={label}
              filterValue={tableState.filters[columnModel.dataKey]}
              setFilter={tableState.setFilter}
              onUpdate={config.onFiltersUpdated}
            />
          </NamedTableHeader>
        </CellContainer>
      );
    });

    return (
      <React.Fragment>
        {cells}
      </React.Fragment>
    );
  }
}
