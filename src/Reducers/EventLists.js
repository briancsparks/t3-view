
import {
  ADD_RAW_TIMESERIES_DATA,
  RESET_TIMESERIES_DATA,
  ADD_RAW_LOGCAT_DATA,
  SET_EVENT_LIST_SOURCE,
}                             from '../Actions/ActionTypes.js';
import _                      from 'underscore'

var defItem = {
  chosen: [],
  sources : {},
};

var exampleState = {
  items: [{
    chosenSource: 'events',
    chosen: ['events', 'mwpUp'],
    sources : {
      events : 'mwpUp,sentPacket'.split(','),
      logcat : 'WifiStateMachine,WifiConfigManager'.split(','),
    },
  }, {
    chosenSource: 'logcat',
    chosen: ['logcat', 'WifiStateMachine'],
    sources : {
      events : 'mwpUp,sentPacket'.split(','),
      logcat : 'WifiStateMachine,WifiConfigManager'.split(','),
    },
  }]
};
const initialState = exampleState;

// const initialState = {
//   events  : {}
// };


export function EventLists(state = {...initialState}, action) {

  const { type, payload } = action;

  switch (type) {
  case ADD_RAW_LOGCAT_DATA:
    return state;

  case ADD_RAW_TIMESERIES_DATA:
    return state;

  case SET_EVENT_LIST_SOURCE:
    return handleSetEventListSource(state, payload.index, payload.chosen);

  case RESET_TIMESERIES_DATA:
    return initialState;

  default:
    return state;
  }
}

// var state = {
//   items: [{
//     chosen: ['events', 'mwpUp'],           <------- Changes this item
//     sources : {
//       events : [...],
//       logcat : [...],
//     },{
//       ...
//     }
//   }]
// };

function handleSetEventListSource(state, index, chosen__) {
  const subItem = state.items[index] || {...defItem};

  const chosen_   = chosen__.split('.');
  const chosen    = [...chosen_, ..._.rest(subItem.chosen, chosen_.length)];
  const item      = {...subItem, chosen};
  var   items     = [...state.items];

  items[index]    = item;

  return {...state, items}
}

