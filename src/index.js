import React                      from 'react';
import ReactDOM                   from 'react-dom';
import { Provider }               from 'react-redux';
import configureStore             from './configureStore'
import { getSessionData }         from './Drivers/getSessionData'
import { setConfig, cold }        from 'react-hot-loader'
import Actions                    from './Actions/Actions';

import './index.css';
import App                        from './Containers/AppContainer';
import registerServiceWorker      from './registerServiceWorker';

var   store;

// var   hotReloads = 0;
const onComponentRegister = (type, name, file) => {
  // hotReloads += 1;
  if (store) {
    store.dispatch(Actions.incrHotReloadCount())
  }
  // console.log(`HMRing: ${hotReloads} -- ${name}, ${file}`)
  if (file.indexOf('node_modules') > 0) {
    cold(type)
  }
}

setConfig({
  onComponentRegister
})

store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
getSessionData(store);
