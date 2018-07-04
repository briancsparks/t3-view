
import {
  ADD_CLIENTS
}                         from '../Actions/ActionTypes.js';
import _                  from 'underscore';

export function clients(state = [], action) {

  const { type, payload } = action;

  switch (type) {
    case ADD_CLIENTS:
      const clients = _.isArray(payload) ? payload : [payload];
      return [...state, ...clients];

    default:
      return state;
  }

}
