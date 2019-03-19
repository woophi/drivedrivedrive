import * as React from 'react';
import { CellContainer } from './CellContainer';
import { NamedTableHeader } from './NamedTableHeader';
import { SortAndFilterState, TableConfig, ColumnModel } from '../types';
import { ResizeHandle } from './ResizeHandle';
import i18n from 'i18next';
import { withTranslation, WithTranslation } from 'react-i18next';

function renderLabel<T>(label: string,  t: i18n.TFunction, fallback?: Extract<keyof T, string>) {
  return (label === '' ? label :
    !label ? fallback :
      label.indexOf('::') !== -1 ? t(label) : label
  );
}

type Props<T = {}, TP = {}, RP = {}> = {
  lineRef: React.RefObject<HTMLDivElement>;
} & FlexGridTableParentProps<T, TP, RP> & WithTranslation;

export type FlexGridTableParentProps<T = {}, TP = {}, RP = {}> = {
  tableProps: TP;
  model: ColumnModel<T, TP, RP>[];
  tableState: SortAndFilterState;
  config: TableConfig<T, TP, RP>;
};
class HeaderRowContentRendererComponent<T, TP, RP> extends React.PureComponent<Props<T, TP, RP>> {
  sortDir = (columnDataKey: keyof T) => this.props.tableState.sortBy === columnDataKey ? this.props.tableState.sortDirection : null;

  cellsRefs = this.props.model.map(() => React.createRef<HTMLDivElement>());

  render() {
    const { model, config, tableState, t } = this.props;

    const cells = model.map((columnModel, index) => {
      const label = renderLabel(columnModel.label, t,  columnModel.dataKey);
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

export const HeaderRowContentRenderer = withTranslation()(HeaderRowContentRendererComponent);
