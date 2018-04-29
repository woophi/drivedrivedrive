import { Reducer, Store, Unsubscribe } from 'redux';

//https://github.com/reactjs/redux/issues/2380
declare module 'redux' {
  export interface StoreCreator {
    <S, D extends Action>(reducer: Reducer<S>, enhancer?: StoreEnhancer<S>): Store2<S, D>;
  }

  export interface Store2<S, D extends Action> extends Store<S> {
    dispatch: Dispatch2<S, D>;
  }

  export interface Dispatch2<S, D extends Action> {
    <A extends D>(action: A): A;
  }
}
