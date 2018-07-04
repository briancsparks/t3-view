
import {
  createStore,
  combineReducers,
}                               from 'redux'

export default function configureStore(preloadedState) {

  if (module.hot) {
    module.hot.accept('./Reducers/index', () => {
      const nextRootReducer = combineReducers(require('./Reducers/index').default /*...*/);
      store.replaceReducer(nextRootReducer);
    })
  }

  const rootReducer = combineReducers(require('./Reducers/index').default /*...*/);
  const store = createStore(rootReducer, preloadedState)
  return store;
}

