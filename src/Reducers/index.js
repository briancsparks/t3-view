
import { combineReducers }        from 'redux';

import { current }                from './Current';

const rootReducer = combineReducers({
  current,
});

export default rootReducer

