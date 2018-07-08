
import {
  ADD_RAW_TIMESERIES_DATA,
  RESET_TIMESERIES_DATA,
  ADD_RAW_LOGCAT_DATA,
  SET_EVENT_LIST_SOURCE,
}                             from '../Actions/ActionTypes.js';
import sg                     from 'sgsg/lite'
import _                      from 'underscore'

var defItem = {
  chosen: [],
  sources : {},
};

var exampleState = {
  items: [{
    chosen: ['logcat', 'WifiStateMachine'],
    sources : {
      events : sg.keyMirror('mwpUp,sentPacket'),
      logcat : sg.keyMirror('WifiStateMachine,WifiConfigManager'),
    },
  }, {
    chosen: ['events', 'mwpUp'],
    sources : {
      events : sg.keyMirror('mwpUp,sentPacket'),
      logcat : sg.keyMirror('WifiStateMachine,WifiConfigManager'),
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

function handleSetEventListSource(state, index, chosenStr) {
  const subItem = state.items[index] || {...defItem};

  const chosenArr   = [...chosenStr.split('.'), null].slice(0, 2);
  const chosen      = [...chosenArr, ..._.rest(subItem.chosen, chosenArr.length)];
  const item        = {...subItem, chosen};
  var   items       = [...state.items];

  items[index]      = item;

  return {...state, items}
}

