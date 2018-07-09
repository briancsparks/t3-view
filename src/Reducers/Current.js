
import {
  INCR_CURRENT_TEST_COUNT, INCR_HOT_RELOAD_COUNT
}                         from '../Actions/ActionTypes.js';

const initialState = {
  testCount       : 0,
  hotReloadCount  : 0,
};

export function current(state = {...initialState}, action) {

  const { type, payload } = action;

  switch (type) {
  case INCR_CURRENT_TEST_COUNT:
    const newTestCount = state.testCount + payload;
    const result = {...state, ...{testCount : newTestCount}};

    return result;

  case INCR_HOT_RELOAD_COUNT:
    return {...state, hotReloadCount: state.hotReloadCount + +(payload || 1)};

  default:
    return state;
  }

}
