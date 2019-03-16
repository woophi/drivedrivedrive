import * as api from 'core/models/api';
import { AppState } from 'core/models/app';
import * as React from 'react';
import { connect as ReduxConnect } from 'react-redux';
import { defaultStateItem } from 'core/app/data';
import { Preloader } from '../preloader';
import { Empty } from './Empty';
import { Alert } from '../Alert';
import * as equals from 'ramda/src/equals';

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

type Props<T, P = {}> = Readonly<{
  change: any;
  children?: React.ReactNode;
  data: api.DataStateItem<T>;
}> & P;

export default function Loader<T, P = {}>(params: LoaderParams<T, P>) {
  return ReduxConnect((state: AppState, _: P) => {
    const change = params.changeSelector && params.changeSelector(state);
    try {
      const data = params.dataSelector(state) || defaultStateItem(null);
      return { data, change };
    } catch (e) {
      return { data: defaultStateItem(null), change };
    }
  })(
    class extends React.Component<Props<T, P>> {
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
        const Component = params.component;
        const { status, errorInfo, result } = this.props.data;
        const { data, children, ...props } = this.props;

        switch (status) {
          case api.DataStatus.INITIAL || api.DataStatus.QUIET_FETCHING:
            return null;

          case api.DataStatus.FETCHING:
            return <Preloader isShow />;

          case api.DataStatus.UPDATING: {
            if (params.showUpdating) {
              return <Preloader isShow />;
            }
            return <Component data={result} isUpdating {...props as P} />;
          }

          case api.DataStatus.EMPTY: {
            if (!!params.doNotUseEmptyComponent) {
              return <Component data={result} {...props as P} />;
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
            return <Component data={result} {...props as P} />;
          }

          default:
            return null;
        }
      }
    } as any
  );
}

type ComponentClass<P> = React.ComponentClass<P>;
type StatelessComponent<P> = React.StatelessComponent<P>;
type Component<P> = ComponentClass<P> | StatelessComponent<P>;
