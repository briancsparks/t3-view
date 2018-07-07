
import {
  ADD_RAW_LOGCAT_DATA
}                             from '../Actions/ActionTypes.js';
import {
  unpackPayload,
  // cleanKey,
  // invokeIt,
  // bestIp,
  // ipNumber,
  // _increment,
  // isOnSubnet,
  // firstIpFromNetmask,
}                             from '../utils';
import _                      from 'underscore';
import sg                     from 'sgsg/lite';
const initialState = {
  events  : []
};

var   nextId = 5;
const zereos = ['0000000000', '000000000', '00000000', '000000', '00000', '0000', '000', '00', '0', '', '', '', '', '', '', '', ''];

function genId() {
  const numStr  = ''+nextId++;
  const len     = numStr.length;

  return `lc:${zereos[len]}${numStr}`;
}


export function logcat(state = {...initialState}, action) {

  const { type } = action;

  switch (type) {
    case ADD_RAW_LOGCAT_DATA:
      return handleRawLogcatData(state, action);

    default:
      return state;
  }
}

function handleRawLogcatData(state, action) {
  const { payload }   = action;
  var   eventList  = unpackPayload(payload)

  var   newEventList = eventList.items.map(event => {
    const mod = chompColon(event.mod || event.module || '');
    return {...event, mod, module:mod, __id:genId()}
  })

  var   events  = [...state.events, ...newEventList];
  const skew    = calcClockSkew(events);

  if (skew && skew.delta) {
    events = events.map(event => {

      return {tick: event.time - skew.delta, ...event}
    })
  }

  events = events.map(event => { return {...event, millis: (Math.abs(event.tick) || 0) % 1000}});

  // 'events' is the main data, but we will add other indexes
  events = _.sortBy(events, 'tick');

  const eventsByModule = _.groupBy(events, 'mod');

  return {...state, events, eventsByModule}
}

function calcClockSkew(events) {

  var match;

  // Find sync__ item that is closest to tick0
  return sg.reduce(events, {}, (m, event) => {
    if (!('time' in event))   { return m; }

    if ((event.mod || event.module).startsWith('MwpNetCore')) {
      if (!/sync__tick/i.exec(event.msg))   { return m; }

      if ((match = /loop_start :- ([0-9]+)/i.exec(event.msg))) {
        const tick = sg.smartValue(match[1]);

        // Is the current one better than ours?
        if (m && m.tick < tick) {
          return m;
        }

        // This is the best one so far
        return {tick, time: event.time, delta: event.time - tick};
      }
    }

    return m;
  })

}


function chompColon(str_) {
  var str = str_;
  while (str[str.length-1] === ':') {
    str = str.substr(0, str.length-1)
  }
  return str;
}
