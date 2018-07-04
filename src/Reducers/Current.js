
import {
  INCR_CURRENT_TEST_COUNT
}                         from '../Actions/ActionTypes.js';

const initialState = {
  testCount  : 0,
};

export function current(state = {...initialState}, action) {

  const { type, payload } = action;

  switch (type) {
    case INCR_CURRENT_TEST_COUNT:
      const newTestCount = state.testCount + payload;
      const result = {...state, ...{testCount : newTestCount}};

      // console.log(`increment ${newTestCount}`, result)
      console.log(`incr ${newTestCount}`, result)

      return result;

    default:
      return state;
  }

}
