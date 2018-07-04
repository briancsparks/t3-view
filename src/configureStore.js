
import {
  createStore,
  combineReducers,
  applyMiddleware,
}                               from 'redux'
import thunkMiddleware          from 'redux-thunk'
import loggerMiddleware         from './Middleware/Logger'
import { composeWithDevTools }  from 'redux-devtools-extension'

export default function configureStore(preloadedState) {
  const middlewares           = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer    = applyMiddleware(...middlewares)
  const enhancers             = [middlewareEnhancer]
  const composedEnhancers     = composeWithDevTools(...enhancers)



  if (module.hot) {
    module.hot.accept('./Reducers/index', () => {
      const nextRootReducer = combineReducers(require('./Reducers/index').default /*...*/);
      store.replaceReducer(nextRootReducer);
    })
  }

  const rootReducer = combineReducers(require('./Reducers/index').default /*...*/);
  const store = createStore(rootReducer, preloadedState, composedEnhancers)
  return store;
}

