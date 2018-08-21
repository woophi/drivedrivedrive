import * as React from 'react';
import { createPortal } from 'react-dom';
import * as Hammer from 'hammerjs';
import { RESIZE_MIN_WIDTH, RESIZER_LINE_STYLE } from '../constants';
import { ISetColumnWidth } from '../types';

interface ResizeHandleProps {
  dataKey: string | number;
  changeWidth: ISetColumnWidth;
  cellRef: React.RefObject<HTMLDivElement>;
  lineRef: React.RefObject<HTMLDivElement>;
}

interface ResizeHandleState {
  isDragging: boolean;
  initialWidth: number;
  initialLeft: number;
  offsetX: number;
  startX: number;
}

const defaultState: ResizeHandleState = {
  isDragging: false,
  initialWidth: 0,
  initialLeft: 0,
  offsetX: 0,
  startX: 0
};

export class ResizeHandle extends React.Component<
  ResizeHandleProps,
  ResizeHandleState
> {
  state: ResizeHandleState = defaultState;

  div = React.createRef<HTMLDivElement>();
  manager: any = null;

  componentDidMount() {
    this.manager = new Hammer.Manager(this.div.current, {
      recognizers: [[Hammer.Pan], [Hammer.Tap, { taps: 2, event: 'doubletap' }]]
    });
    this.manager.on('doubletap', this.reset);
    this.manager.on('panstart', this.onDragStart);
    this.manager.on('panmove', this.onDragMove);
    this.manager.on('panend', this.onDragEnd);
  }

  componentWillUnmount() {
    this.manager.destroy();
  }

  /* Step variant */
  onDragMove = (event: typeof Hammer.Input) => {
    const pointerOffsetX =
      (event.srcEvent as PointerEvent).clientX - this.state.startX;
    const newOffsetX = Math.max(
      RESIZE_MIN_WIDTH - this.state.initialWidth,
      pointerOffsetX
    );
    this.setState({ offsetX: newOffsetX });
  };

  onDragEnd = (event: typeof Hammer.Input) => {
    const realWidth = event.deltaX + this.state.initialWidth;
    const newWidth = Math.max(RESIZE_MIN_WIDTH, realWidth);

    this.setState(defaultState);

    this.props.changeWidth(this.props.dataKey, newWidth);
  };

  onDragStart = (event: typeof Hammer.Input) => {
    const initialLeft = this.props.lineRef.current.getBoundingClientRect().left;
    const rect = this.props.cellRef.current.getBoundingClientRect();

    this.setState({
      startX: (event.srcEvent as PointerEvent).clientX,
      initialWidth: rect.width,
      initialLeft: initialLeft,
      isDragging: true
    });
  };

  reset = () => this.props.changeWidth(this.props.dataKey, undefined);

  render() {
    return (
      <div
        style={{
          flexShrink: 0,
          height: '20px',
          width: '10px',
          cursor: 'col-resize'
        }}
        ref={this.div}
      >
        {this.state.isDragging
          ? createPortal(
              <div
                style={{
                  position: 'absolute',
                  left:
                    this.state.offsetX +
                    this.state.startX -
                    this.state.initialLeft,
                  width: '5px',
                  top: 6,
                  height: 'calc(100% - 6px)',
                  zIndex: 2,
                  cursor: 'col-resize',
                  borderLeft: RESIZER_LINE_STYLE
                }}
              />,
              this.props.lineRef.current
            )
          : null}
      </div>
    );
  }
}
