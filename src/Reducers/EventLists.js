
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
  const chosenArr   = [...chosenStr.split('.'), null].slice(0, 2);

  const subItem = state.items[index] || {...defItem};
  const chosen      = [...chosenArr, ..._.rest(subItem.chosen, chosenArr.length)];
  const item        = {...subItem, chosen};
  var   items       = [...state.items];

  items[index]      = item;

  console.log(`two`, {...state, items});

  const x = updated(state, {
    items : (oldItems) => {
      return [
        [+index, updated(oldItems[index], {
          chosen: chosenArr
        })]
      ];
    }
  });

  console.log(`one`, x);

  return {...state, items}
}

function updated(obj, updaters) {
  const updates = sg.reduce(updaters, {}, (m, updater, key) => {
    const value = obj[key];
console.log({key, value})

    if (!_.isFunction(updater)) {
      return {...m, [key]: updater};
    }

    if (_.isArray(value)) {
      return {...m, [key]: updatedArray(value, updater)};
    }

    /* otherwise */
    if (updater.length > 1) {
      return {...m, [key]: updater(value, {...value})};
    }

    /* otherwise */
    return {...m, [key]: updater(value)};
  });

console.log(`updating`, {obj, updates})
  return {...obj, ...updates}
}

function updatedArray(arr, updater) {
  var result;
  if (updater.length > 1) {
    // updater is asking for a copy of the old array
    result = updater(arr, [...arr]);
  } else {
    result = updater(arr);
  }
console.log(`uArr res`, {result})
  if (sg.isnt(result))        { return arr; }

  if (!_.isArray(result)) {
    return [...arr, result];
  }

  if (result.length === 0)    { return arr; }

  if (isIndexUpdateArray(result)) {
    return sg.reduce(result, [...arr], (m, updateArr) => {
      m[updateArr[0]] = updateArr[1]
      return m;
    });
  }

  /* otherwise -- the final result was returned */
  return result;
}

function isIndexUpdateArray(arr) {
  const x0 = arr[0];
  if (!_.isArray(x0))   { return false; }

  if (x0.length === 2 && _.isNumber(x0[0])) {
    return true;
  }

  return false;
}

function xyz() {
  const obj = {items:[1,2,3], other:'foo'}

  const o2 = updated(obj, {
    items: function() {
      return [[2, "foo"]]
    }
  })
}

