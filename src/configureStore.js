
import { createStore } from 'redux'

import rootReducer        from './Reducers/index';

export default function configureStore(preloadedState) {
  const store = createStore(rootReducer, preloadedState)

  return store;
}

