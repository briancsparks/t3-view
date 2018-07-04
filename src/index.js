import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore'
import { getSessionData } from './Drivers/getSessionData'

import './index.css';
import App                        from './Containers/AppContainer';
import registerServiceWorker      from './registerServiceWorker';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
getSessionData(store);
