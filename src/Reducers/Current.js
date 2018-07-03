
import {
  INCR_CURRENT_TEST_COUNT
}                         from '../Actions/ActionTypes.js';

// const _                 = require('underscore');

const initialState = {
  testCount  : 0,
};

export function current(state = {...initialState}, action) {

  const { type, payload } = action;

  switch (type) {
    case INCR_CURRENT_TEST_COUNT:
      if (!payload) { return state; }
console.log(`incr`)
      return {...state, ...{testCount : state.testCount + payload}};

    default:
      return state;
  }

}
