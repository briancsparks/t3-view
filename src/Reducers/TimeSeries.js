import {
  ADD_RAW_TIMESERIES_DATA,
  RESET_TIMESERIES_DATA,
}                             from '../Actions/ActionTypes.js';
import { enumEntity }         from './Attributes';
import {
  unpackPayload,
  cleanKey,
  invokeIt,
  bestIp,
  ipNumber,
  // _increment,
  isOnSubnet,
  firstIpFromNetmask,
}                             from '../utils';
const sg                    = require('sgsg/lite');
const _                     = require('underscore');

var   nextId = 5;
const zereos = ['0000000000', '000000000', '00000000', '000000', '00000', '0000', '000', '00', '0', '', '', '', '', '', '', '', ''];

function genId() {
  const numStr  = ''+nextId++;
  const len     = numStr.length;

  return `ev:${zereos[len]}${numStr}`;
}

const initialState = {
  events  : {}
};

export function events(state = {...initialState}, action) {

  const { type } = action;

  switch (type) {
    case ADD_RAW_TIMESERIES_DATA:
      return handleRawTimeSeriesData(state, action);

    case RESET_TIMESERIES_DATA:
      return initialState;

    default:
      return state;
  }
}

function handleRawTimeSeriesData(state, action) {
  const { payload }   = action;
  const interfaces    = enumEntity(action.store, 'interface');
  const eventList     = unpackPayload(payload)

  var {
    firstTick,
    lastTick,
  }                 = state;

  // We will not handle events that cannot be indexed
  var   events = eventList.items.filter(event => isGoodKey(event.eventType));

  // Fixup events
  events = events.map((event_) => {
    var   event = sg.kv(event_, 'eventTypeKey', cleanKey(event_.eventType));

    event = sg.kv(event, 'ip', bestIp(event));
    if (event.ip) {
      event = sg.kv(event, 'ipNum', ipNumber(event.ip));
      event = sg.kv(event, 'nodeNum', nodeNum(event, interfaces));
    }

    event = sg.kv(event, '__id', genId());

    firstTick = invokeIt(Math.min, firstTick, event.tick);
    lastTick  = invokeIt(Math.max, lastTick,  event.tick);

    return event;
  });

  // // Filter out items with duplicate ticks within the same group
  // events = sg.reduce(_.groupBy(events, 'eventTypeKey'), [], (m, group, key) => {
  //   var g = _.sortBy(group, 'tick')
  //   return [...m, ..._.uniq(g, true, event => event.tick)];
  // })

  // These are the events
  events = _.sortBy([...state.events, ...events], 'tick');

  // Index the events by eventType
  const eventsByEventType = _.groupBy(events, 'eventTypeKey');

  return {...state, firstTick, lastTick, events, eventsByEventType};
}






function isGoodKey(key) {
  var result = cleanKey(key);
  if (!sg.isnt(result)) {
    result = result.replace(/_/ig, '');
  }

  return !!result;
}

function nodeNum(item, interfaces) {
  const ipNum   = item.ipNum     || ipNumber(item.ip);
  if (!ipNum) {
    return /*undefined*/;
  }

  const len   = sg.numKeys(interfaces);

  var result;

  for (var i = 0; i < len; ++i) {
    const iface = interfaces[i];
    if (isOnSubnet(item, iface)) {
      if (result) {
        console.log(`Duplicate subnet for ${item.ip}: ${iface.id}`);
      }

      const firstIp = iface.firstIp || firstIpFromNetmask(iface);
      if (firstIp) {
        result = ipNum - firstIp;
      }
    }
  }

  return result;
}

