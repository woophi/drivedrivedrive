import * as React from 'react';

interface CellContentRendererProps<T = any> {
  dataKey: string;
  rowData: T;
  cellRenderer: any;
}

export class CellContentRenderer extends React.Component<
  CellContentRendererProps
> {
  render() {
    const { rowData, dataKey, cellRenderer } = this.props;
    let content: React.ReactNode = null;

    try {
      let cellData = null;
      if (Array.isArray(rowData) && rowData.length - 1 < parseInt(dataKey)) {
        return '';
      } else {
        cellData = rowData[dataKey];
      }
      content = cellRenderer
        ? cellRenderer({
            rowData,
            cellData,
            columnIndex: 1,
            isScrolling: false // TODO: deprecate this and do not use TableCellRendererType
          })
        : cellData;
    } catch (e) {
      content = '######';
    } finally {
      return content;
    }
  }
}
