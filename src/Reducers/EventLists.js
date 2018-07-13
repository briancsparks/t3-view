
import {
  ADD_RAW_TIMESERIES_DATA,
  RESET_TIMESERIES_DATA,
  ADD_RAW_LOGCAT_DATA,
  SET_EVENT_LIST_SOURCE,
}                             from '../Actions/ActionTypes.js';
import {
  cleanItem as cleanLogcatItem
}                             from './Logcat';
import {
  unpackPayload,
}                             from '../utils';
import sg                     from 'sgsg/lite'
import _                      from 'underscore'

var defItem = {
  chosen: [],
  sources : {},
};

// eslint-disable-next-line no-unused-vars
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
// const initialState = exampleState;

const initialState = {
  items: [{
    chosen: ['logcat', null],
    sources : {
      logcat : [],
    },
  }]
};


export function EventLists(state = {...initialState}, action) {

  const { type, payload } = action;

  switch (type) {
  case ADD_RAW_LOGCAT_DATA:
    // console.log(`EventLists reduce logcat`, {action});
    return handleAddRawLogcatData(state, action);

  case ADD_RAW_TIMESERIES_DATA:
    // console.log(`EventLists reduce timeseries`, {action});
    return handleAddRawTimeseriesData(state, payload);

  case SET_EVENT_LIST_SOURCE:
    return handleSetEventListSource(state, payload.index, payload.chosen);

  case RESET_TIMESERIES_DATA:
    return initialState;

  default:
    return state;
  }
}


function handleAddRawTimeseriesData(state, action) {
  return state;
}


function handleAddRawLogcatData(state, action) {
  const { payload, store }   = action;

  var   eventList     = unpackPayload(payload)
  const items0        = (store.EventLists && store.EventLists.items && store.EventLists.items[0]) || {};
  const oldLogcat     = (items0.sources && items0.sources.logcat) || [];

  const logcat = sg.reduce(eventList.items, {...oldLogcat}, (m, event_) => {
    const event   = cleanLogcatItem(event_);
    const mod     = event.mod || event.module;
    if (!mod)   { return m; }

    m[mod] = m[mod] || { count: 0 };
    m[mod].count += 1;

    return m;
  });

  return {...state,
    items: state.items.map(item => {
      return {...item,
        sources: {...item.sources,
          logcat
        }
      }
    })
  };

  // return state;
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
  const chosenArr_  = chosenStr.split('.');
  const source      = chosenArr_[0];
  const module      = _.rest(chosenArr_).join('.');
  const chosenArr   = [..._.compact([source, module]), null].slice(0, 2);

  const subItem = state.items[index] || {...defItem};
  const chosen      = [...chosenArr, ..._.rest(subItem.chosen, chosenArr.length)];
  const item        = {...subItem, chosen};
  var   items       = [...state.items];

  items[index]      = item;

  return {...state, items}
}

// const x = updated(state, {
//   items : (oldItems) => {
//     return [
//       [+index, updated(oldItems[index], {
//         chosen: chosenArr
//       })]
//     ];
//   }
// });


// eslint-disable-next-line no-unused-vars
function updated(obj, updaters) {
  const updates = sg.reduce(updaters, {}, (m, updater, key) => {
    const value = obj[key];

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

// function xyz() {
//   const obj = {items:[1,2,3], other:'foo'}

//   const o2 = updated(obj, {
//     items: function() {
//       return [[2, "foo"]]
//     }
//   })
// }

