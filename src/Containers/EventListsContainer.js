
import { connect }              from "react-redux";
// import _                        from 'underscore';
import { Builder }              from '../Components/Builders/TimeSeriesCharts';
import {
  setEventListSource
}                               from '../Actions/Actions'
import {
  deref
}                               from 'sgsg/lite'

// var eventListsX = {
//   items: [{
//     chosen: ['logcat', 'WifiStateMachine'],
//     sources : {
//       events : sg.keyMirror('mwpUp,sentPacket'),
//       logcat : sg.keyMirror('WifiStateMachine,WifiConfigManager'),
//     },
//   }, {
//     chosen: ['events', 'mwpUp'],
//     sources : {
//       events : sg.keyMirror('mwpUp,sentPacket'),
//       logcat : sg.keyMirror('WifiStateMachine,WifiConfigManager'),
//     },
//   }]
// };

const mapStateToProps = (state, ownProps) => {
  // console.log(`mstp evlist`, {state, ownProps});

  var   msgList         = [];
  var   builder         = new Builder();
  var   appended        = [];

  const logcatEvents    = deref(state, 'logcat.events') || [];
  const addLcData       = mkAddLcData(logcatEvents, appended);

  const evListItems     = (deref(state, 'EventLists.items') || [])[0] || {};
  const chosen          = evListItems.chosen || [];

  if (chosen[0] === 'logcat' && chosen[1]) {
    let mod = (chosen[1] || '').toLowerCase();

    // var   mainEvents       = deref(state, 'events.events') || [];
    // mainEvents = mainEvents.filter(event => ('able' in event)).map(e => { return {...e, y: e.able ? 600 : 200}});
    // const addLcData = mkAddLcData(mainEvents, appended);

    // addLcData('one', 'y', event => event.eventType === 'fd_w2' && event.fd === 71);
    // addLcData('two', 'y', event => event.eventType === 'fd_w2' && event.fd === 70);

    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wifistatemachine');
    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wifinative-wlan0');
    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wpa_supplicant');
    addLcData('one', 'millis', event => event.mod.toLowerCase() === mod);
    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'netstats_wifi_sample');
    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'netstats_mobile_sample');
    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wifimonitor');
    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'ebprint.netview');
    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'mwpnetcore');
    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'activitymanager');
    // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wifihal');

    if (appended.length > 0) {
      builder.appendScatter('multi', appended, {min: 0, max: 1000});
    }

    // builder.addRow();

    // console.log(`sdfj`, {builder});

    let chart           = (builder.getCharts() || [])[0] || {};
    let seriesItem      = (chart.items || [])[0] || {};
    let items           = seriesItem.items || [];

    msgList = items.map(item => item.msg);
  }

  const props = {
    eventLists    : {
      ...state.EventLists,
      ...ownProps,
      msgList,
    },
    ipAcrossTime  : {
      mwpUpEvents   : deref(state, 'events.eventsByEventType.mwpUp') || [],
      controlEvents : deref(state, 'events.eventsByEventType.mwpUp') || [],
      charts        : builder.getCharts(),
    }
  }
  // console.log(`eventlistcontainer`, {props, tprops:props.ipAcrossTime});

  return props;
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSelected: (event) => {
      const value = event.target.value;
      const parts = value.split('.');
      const [
        indexStr, ...chosen ]  = parts;
      const index = +indexStr;
      dispatch(setEventListSource({index, chosen:chosen.join('.')}));
    }
  }
}

export const EventLists = connect(
  mapStateToProps,
  mapDispatchToProps
)(require('../Components/EventLists.jsx').EventLists);


function addLcData_(logcatEvents, appended, name, key, fn) {
  var   data = logcatEvents.filter(fn) || [];
  if (data.length > 0) {
    appended.push({name, data, key});
  }
}

function mkAddLcData(logcatEvents, appended) {

  return function(name, key, fn) {
    return addLcData_(logcatEvents, appended, name, key, fn);
  };
}

