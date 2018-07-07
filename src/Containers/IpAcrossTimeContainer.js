
import { connect }              from "react-redux";
// import { reselect }             from 'reselect';
import { Builder }              from '../Components/Builders/TimeSeriesCharts';
import {
  deref
}                               from 'sgsg/lite';

// const sg                      = require('sgsg/lite');
const _                       = require('underscore');


const mapStateToProps = (state, ownProps) => {

  var builder = new Builder();

  var   axisId;

  const logcatEvents     = deref(state, 'logcat.events') || [];

  var   wifiStateMachine = logcatEvents.filter(event => event.mod.toLowerCase() === 'wifistatemachine') || [];
  var   wifiNativeWlan0  = logcatEvents.filter(event => event.mod.toLowerCase() === 'wifinative-wlan0') || [];

  if (wifiStateMachine.length > 0 && wifiNativeWlan0.length > 0) {
    var   appended = [];

    appended.push({name:'wifiStateMachine', data: wifiStateMachine, key: 'millis'});
    appended.push({name:'wifiNativeWlan0',  data: wifiNativeWlan0,  key: 'millis'});

    builder.appendScatter(appended);
  }

  builder.addRow();

  wifiStateMachine = logcatEvents.filter(event => {
    return true;
    // return event.mod.toLowerCase() === 'wifistatemachine';
  }).map(event => {
    return {millis: +_.last(event.Hms.split('.')), ...event}
  })
  if (wifiStateMachine.length > 0) {
    builder.addScatter('wifiStateMachine', wifiStateMachine, 'millis');
  }

  builder.addRow();

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

