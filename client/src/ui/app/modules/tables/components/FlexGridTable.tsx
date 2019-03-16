import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { AutoSizer, Grid, OnScrollParams, ScrollSync } from 'react-virtualized';
import { SortAndFilterState, TableConfig } from '../types';
import {
  noContentRenderer,
  renderBodyCellsAsRow,
  renderHeaderCellsAsRow
} from './renderTableParts';
import * as constants from '../constants';
import * as equals from 'ramda/src/equals';

export interface FlexGridTableProps<T = {}, TP = {}, RP = {}> {
  list: T[];
  config: TableConfig<T, TP, RP>;
  tableState: SortAndFilterState;
}


interface FlexGridTableState<TP = {}> {
  tableProps: TP;
}
export class FlexGridTable<T, TP, RP> extends React.Component<FlexGridTableProps<T, TP, RP>, FlexGridTableState<TP>> {
  static getDerivedStateFromProps(props: FlexGridTableProps, state: FlexGridTableState) {
    const { list, config, tableState, ...restProps } = props;

    if (!equals(state.tableProps, restProps)) {
      return { tableProps: restProps };
    }
    return null;
  }


  header: Grid = null;
  mainGrid: Grid = null;
  table: HTMLDivElement = null;
  line = React.createRef<HTMLDivElement>();

  state: FlexGridTableState<TP> = {
    tableProps: null
  };

  setRef = {
    header: (instance: Grid) => (this.header = instance),
    mainGrid: (instance: Grid) => {
      this.mainGrid = instance;

      if (!!this.props.config.registerChild) {
        this.props.config.registerChild(instance);
      }
    }
  };

  onScrollScrollbars = (onScroll: (params: OnScrollParams) => void) => (
    event: React.UIEvent<HTMLDivElement>
  ) => {
    return onScroll(event.target as HTMLDivElement);
  };

  componentDidUpdate() {
    this.header.forceUpdate();
    this.mainGrid.forceUpdate();
  }

  get configModel() {
    const { model } = this.props.config;
    return typeof model === 'function' ? model(this.state.tableProps) : model;
  }

  render() {
    const { list, config,  tableState } = this.props;
    const rowHeight = constants.ROW_HEIGHT;
    const REM = 16;

    const tableMinWidth = this.configModel.reduce(
      (acc, columnModel) => acc += (
        tableState.columnWidths[columnModel.dataKey] ||
        columnModel.width ||
        columnModel.minWidth ||
        constants.DEFAULT_COLUMN_MIN_WIDTH
      ),
      REM
    );

    return (
      <AutoSizer>
        {({ height, width }) => {
          const innerWidth = Math.max(tableMinWidth, width);
          return (
            <ScrollSync>
              {({ onScroll, scrollLeft, scrollTop }) => {
                return (
                  <div style={{ height, width }}>
                    <div ref={this.line} />
                    <Grid
                      style={constants.HEADER_GRID_STYLE}
                      model={config.model}
                      config={config}
                      tableState={tableState}
                      lineRef={this.line}
                      cellRenderer={renderHeaderCellsAsRow}
                      columnWidth={innerWidth}
                      columnCount={1}
                      height={config.hideHeader ? 0 : rowHeight}
                      overscanColumnCount={0}
                      rowHeight={rowHeight}
                      rowCount={1}
                      scrollLeft={scrollLeft}
                      width={width}
                      ref={this.setRef.header}
                    />
                    <Scrollbars
                      style={{
                        height: height - (config.hideHeader ? 0 : rowHeight),
                        width
                      }}
                      onScroll={this.onScrollScrollbars(onScroll)}
                    >
                      <Grid
                        style={constants.MAIN_GRID_STYLE}
                        model={config.model}
                        config={config}
                        tableState={tableState}
                        list={list}
                        cellRenderer={renderBodyCellsAsRow}
                        columnWidth={innerWidth}
                        columnCount={1}
                        height={height - (config.hideHeader ? 0 : rowHeight)}
                        scrollLeft={scrollLeft}
                        scrollTop={scrollTop}
                        overscanColumnCount={1}
                        overscanRowCount={constants.OVERSCAN_ROW_COUNT}
                        noContentRenderer={noContentRenderer(innerWidth)}
                        rowHeight={rowHeight}
                        rowCount={list.length}
                        width={width}
                        ref={this.setRef.mainGrid}
                        {...this.props.config.mainGridProps}
                      />
                    </Scrollbars>
                  </div>
                );
              }}
            </ScrollSync>
          );
        }}
      </AutoSizer>
    );
  }
}
