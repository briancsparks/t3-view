
import { connect }              from "react-redux";
// import { reselect }             from 'reselect';
import { Builder }              from '../Components/Builders/TimeSeriesCharts';
import {
  deref
}                               from 'sgsg/lite';

// const sg                      = require('sgsg/lite');
// const _                       = require('underscore');

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

const mapStateToProps = (state, ownProps) => {

  var builder = new Builder();

  var   axisId;

  var   appended         = [];

  const logcatEvents     = deref(state, 'logcat.events') || [];
  const addLcData = mkAddLcData(logcatEvents, appended);

  // var   mainEvents       = deref(state, 'events.events') || [];
  // mainEvents = mainEvents.filter(event => ('able' in event)).map(e => { return {...e, y: e.able ? 600 : 200}});
  // const addLcData = mkAddLcData(mainEvents, appended);

  // addLcData('one', 'y', event => event.eventType === 'fd_w2' && event.fd === 71);
  addLcData('two', 'y', event => event.eventType === 'fd_w2' && event.fd === 70);

  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wifistatemachine');
  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wifinative-wlan0');
  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wpa_supplicant');
  addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wificonfigmanager');
  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'netstats_wifi_sample');
  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'netstats_mobile_sample');
  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wifimonitor');
  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'ebprint.netview');
  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'mwpnetcore');
  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'activitymanager');
  // addLcData('one', 'millis', event => event.mod.toLowerCase() === 'wifihal');

  // var   wifiStateMachine = logcatEvents.filter(event => event.mod.toLowerCase() === 'wifistatemachine') || [];
  // var   wifiNativeWlan0  = logcatEvents.filter(event => event.mod.toLowerCase() === 'wifinative-wlan0') || [];

  if (appended.length > 0) {

    // appended.push({name:'wifiStateMachine', data: wifiStateMachine, key: 'hashpjw'});
    // appended.push({name:'wifiNativeWlan0',  data: wifiNativeWlan0,  key: 'hashpjw'});

    builder.appendScatter('multi', appended);
  }

  builder.addRow();

  // wifiStateMachine = logcatEvents.filter(event => {
  //   return true;
  //   // return event.mod.toLowerCase() === 'wifistatemachine';
  // }).map(event => {
  //   return {millis: +_.last(event.Hms.split('.')), ...event}
  // })
  // if (wifiStateMachine.length > 0) {
  //   builder.addScatter('wifiStateMachine', wifiStateMachine, 'millis');
  // }

  // builder.addRow();

  const sentPackets = deref(state, 'events.eventsByEventType.sentPacket') || [];
  if (sentPackets.length > 0) {
    axisId = builder.addScatter('sentPackets', sentPackets, 'nodeNum');
  }

  const recvPackets = deref(state, 'events.eventsByEventType.recvPacket') || [];
  if (recvPackets.length > 0) {
    builder.addScatter('recvPackets', recvPackets, 'nodeNum', {axisId});
  }


  return {
    mwpUpEvents : deref(state, 'events.eventsByEventType.mwpUp') || [],
    charts      : builder.getCharts(),
  };

  // return {...ownProps, store:state};
}




const mapDispatchToProps = (dispatch) => {
  var   props = {dispatch};

  return props;
}


export const IpAcrossTimeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(require('../Components/IpAcrossTimeComponent.jsx').IpAcrossTimeComponent);

