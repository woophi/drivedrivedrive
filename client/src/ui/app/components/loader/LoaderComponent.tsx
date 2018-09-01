import * as api from 'core/models/api';
import { AppState } from 'core/models/app';
import * as React from 'react';
import { connect as ReduxConnect } from 'react-redux';
import { defaultStateItem } from 'core/app/data';
import { Preloader } from '../preloader';
import { Empty } from './Empty';
import { Alert } from '../Alert';
import * as equals from 'ramda/src/equals';

/* tslint:disable max-classes-per-file */

type LoaderParams<T, P> = {
  loadData: () => Promise<T>;
  dataSelector: (state: AppState) => api.DataStateItem<T>;
  onMount?: () => void;
  onUnmount?: () => void;
  changeSelector?: (state: AppState) => any;
  changeHandler?: (change: any) => void;
  component: Component<{ data?: T; isUpdating?: boolean } & P>;
  updateInterval?: number;
  doNotUseEmptyComponent?: boolean;
  showUpdating?: boolean;
};

export default function Loader<T, P = {}>(params: LoaderParams<T, P>) {
  return ReduxConnect((state: AppState, ownProps: P) => {
    const change = params.changeSelector && params.changeSelector(state);
    let data;
    try {
      data = params.dataSelector(state) || defaultStateItem(null);
      return { data, change, ...(ownProps as {}) } as {
        data: typeof data;
        change: any;
      } & P;
    } catch (e) {
      return { data: defaultStateItem(null), change, ...(ownProps as {}) } as {
        data: typeof data;
        change: any;
      } & P;
    }
  })(
    class extends React.Component<
      { data: api.DataStateItem<T>; change: any } & P
    > {
      static displayName: 'Loader';
      interval: number = null;

      createIntervalIfSet = () => {
        if (params.updateInterval) {
          this.interval = window.setInterval(
            this.fetchData,
            params.updateInterval
          );
        }
      };

      removeInterval = () => {
        if (!!this.interval) {
          window.clearInterval(this.interval);
        }
      };

      async componentDidMount() {
        await this.fetchData();
        this.createIntervalIfSet();
        if (!!params.onMount) {
          params.onMount();
        }
      }

      componentDidUpdate(prevProps: any) {
        if (!equals(prevProps.change, this.props.change)) {
          this.removeInterval();
          this.fetchData();
          this.createIntervalIfSet();
          if (!!params.changeHandler) {
            params.changeHandler(this.props.change);
          }
        }
      }

      componentWillUnmount() {
        this.removeInterval();
        if (!!params.onUnmount) {
          params.onUnmount();
        }
      }

      fetchData = async () => {
        try {
          await params.loadData();
        } catch (e) {
          console.error('[!] Loader error:', e);
        }
      };

      render() {
        const { status, errorInfo, result } = this.props.data;
        const { data, children, ...props } = this.props as {
          [key: string]: object;
        };

        switch (status) {
          case api.DataStatus.INITIAL || api.DataStatus.QUIET_FETCHING:
            return null;

          case api.DataStatus.FETCHING:
            return <Preloader isShow />;

          case api.DataStatus.UPDATING: {
            const Component = params.component;
            if (params.showUpdating) {
              return <Preloader isShow />;
            }
            return <Component data={result} isUpdating {...props} />;
          }

          case api.DataStatus.EMPTY: {
            if (!!params.doNotUseEmptyComponent) {
              const Component = params.component;
              return <Component data={result} {...props} />;
            }
            return <Empty />;
          }

          case api.DataStatus.ERROR:
            return (
              <div className="m-auto">
                <Alert mssg={JSON.stringify(errorInfo)} type={'error'} />
              </div>
            );

          case api.DataStatus.SUCCESS: {
            const Component = params.component;
            return <Component data={result} {...props} />;
          }

          default:
            return null;
        }
      }
    }
  );
}

type ComponentClass<P> = React.ComponentClass<P>;
type StatelessComponent<P> = React.StatelessComponent<P>;
type Component<P> = ComponentClass<P> | StatelessComponent<P>;
