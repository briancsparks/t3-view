import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore'
import { getSessionData } from './Drivers/getSessionData'
import { setConfig, cold } from 'react-hot-loader'

import './index.css';
import App                        from './Containers/AppContainer';
import registerServiceWorker      from './registerServiceWorker';

const onComponentRegister = (type, name, file) => {
  console.log(`${name}, ${file}`)
  if (file.indexOf('node_modules') > 0) {
    cold(type)
  }
}

setConfig({
  onComponentRegister
})

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
getSessionData(store);
