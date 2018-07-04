
import {
  ADD_SESSIONS
}                         from '../Actions/ActionTypes.js';
import _                  from 'underscore';

export function sessions(state = [], action) {

  const { type, payload } = action;

  switch (type) {
    case ADD_SESSIONS:
      const sessions = _.isArray(payload) ? payload : [payload];
      return [...state, ...sessions];

    default:
      return state;
  }

}
