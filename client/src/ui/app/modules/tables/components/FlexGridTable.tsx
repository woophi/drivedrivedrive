import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {
  AutoSizer,
  Grid,
  OnScrollParams,
  ScrollSync
} from 'react-virtualized';
import {
  SortAndFilterState,
  TableConfig
} from '../types';
import {
  noContentRenderer,
  renderBodyCellsAsRow,
  renderHeaderCellsAsRow
} from './renderTableParts';
import * as constants from '../constants';
import * as equals from 'ramda/src/equals';

export interface FlexGridTableProps<T> {
  list: T[];
  config: TableConfig<T>;
  tableState: SortAndFilterState;
}

export class FlexGridTable<T> extends React.Component<FlexGridTableProps<T>> {
  header: Grid = null;
  mainGrid: Grid = null;
  line = React.createRef<HTMLDivElement>();

  setRef = {
    header: (instance: Grid) => this.header = instance,
    mainGrid: (instance: Grid) => {
      this.mainGrid = instance;
      if (!!this.props.config.registerChild) {
        this.props.config.registerChild(instance);
      }
    }
  };

  onScrollScrollbars = (onScroll: (params: OnScrollParams) => void) => (event: React.UIEvent<HTMLDivElement>) => {
    return onScroll(event.target as HTMLDivElement);
  }

  componentDidUpdate(prevProps: FlexGridTableProps<any>) {
    /* Grids use shallowCompare, therefore forceUpdates are needed */
    this.header.forceUpdate();
    if (
      !equals(this.props.list, prevProps.list) ||
      !equals(this.props.tableState, prevProps.tableState)
    ) {
      this.mainGrid.forceUpdate();
    }
  }

  render() {
    // console.debug('flextable props:', this.props);
    const rowHeight = constants.ROW_HEIGHT;

    const {
      config,
      list,
      tableState
    } = this.props;

    const REM = 16;

    const tableMinWidth = config.model.reduce(
      (acc, columnModel) => acc += (
        tableState.columnWidths[columnModel.dataKey as string] ||
        columnModel.width ||
        columnModel.minWidth ||
        constants.DEFAULT_COLUMN_MIN_WIDTH
      ),
      REM + (config.showRowArrows ? REM : 0)
    );

    /* tslint:disable:jsx-no-multiline-js */
    return (
      <AutoSizer>
        {({ height, width }) => {
          const innerWidth = Math.max(tableMinWidth, width);
          return (
            <ScrollSync>
              {({
                onScroll,
                scrollLeft,
                scrollTop,
              }) => {

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
                        height={height - rowHeight}
                        scrollLeft={scrollLeft}
                        scrollTop={scrollTop}
                        // onScroll={onScroll}
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
