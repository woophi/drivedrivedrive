// import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import 'rxjs/add/operator/ignoreElements';
import thunk from 'redux-thunk';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, createStore, Reducer, ReducersMapObject, Store2 } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as sharedReducers from './reducers';
import { history } from 'ui/app/history';
import { AppDispatch, AppState } from 'core/models/app';

const router = routerMiddleware(history);
// const logger = createLogger();
const epicMiddleware = createEpicMiddleware(combineEpics(action$ => action$.ignoreElements()));
const middleware = applyMiddleware(thunk, router, epicMiddleware);

const asyncEpics = [] as Epic<any, AppState>[];

export function injectEpic(epic: Epic<any, AppState>) {
  // console.debug('Injecting epic', epic);
  asyncEpics.push(epic);
  epicMiddleware.replaceEpic(
    combineEpics(...asyncEpics)
  );
  return store;
}

const rootReducerMap: ReducersMapObject = {
  router: routerReducer,
  ...sharedReducers
};

let asyncReducers: ReducersMapObject = {};

function updateRootReducer() {
  store.replaceReducer(
    combineReducers<AppState>({
      ...rootReducerMap,
      ...asyncReducers
    })
  );
}

export function injectReducer(name: string, reducer: Reducer<any>) {
  console.debug(`Injecting ${name} reducer to shared store`);
  asyncReducers[name] = reducer;
  updateRootReducer();
  return store;
}

export function injectReducers(reducers: ReducersMapObject) {
  asyncReducers = {
    ...asyncReducers,
    ...reducers
  };
  updateRootReducer();
  return store;
}

const store: Store2<AppState, AppDispatch> = createStore(
  combineReducers(rootReducerMap), composeWithDevTools(middleware)
);
export default store;
