import * as React from 'react';
import { CellContainer } from './CellContainer';
import { DefaultTableCell } from './DefaultTableCell';
import { CellContentRenderer } from './CellContentRenderer';
import { ColumnModel, TableModel, IColumnWidths } from '../types';

export interface RowRendererProps {
  rowData: any;
  rowIndex: number;
  model: TableModel;
  columnWidths: IColumnWidths;
}

export class RowContentRenderer extends React.PureComponent<RowRendererProps> {
  render() {
    const { rowData, model, rowIndex, columnWidths } = this.props;

    const columns = model.map((columnModel: ColumnModel, index: number) => {
      const { cellRenderer, dataKey, title } = columnModel;

      // TODO: cell tooltips
      // const tooltipText = typeof title === 'function' ? title(cellData) :
      //   (title === undefined && (
      //     typeof cellData === 'string' ||
      //     typeof cellData === 'number'
      //   )) ? cellData :
      //   title === false ? undefined : cellData;

      const width = columnWidths[dataKey] || columnModel.width;

      return (
        <CellContainer
          key={`${columnModel.dataKey}-${rowIndex}-${index}`}
          title={''}
          width={width}
          minWidth={columnModel.minWidth}
          maxWidth={columnModel.maxWidth}
          flexShrink={columnModel.flexShrink}
          flexGrow={columnModel.flexGrow}
        >
          <DefaultTableCell>
            <CellContentRenderer
              rowData={rowData}
              dataKey={dataKey as string}
              cellRenderer={cellRenderer}
            />
          </DefaultTableCell>
        </CellContainer>
      );
    });

    return (
      <React.Fragment>
        {columns}
      </React.Fragment>
    );
  }
}
