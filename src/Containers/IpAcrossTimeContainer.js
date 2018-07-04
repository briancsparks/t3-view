
import { connect }              from "react-redux";
// import { reselect }             from 'reselect';
import { Builder }              from '../Components/Builders/TimeSeriesCharts';
import {
  deref
}                               from 'sgsg/lite';


const mapStateToProps = (state, ownProps) => {

  var builder = new Builder();

  var   axisId;

  const sentPackets = deref(state, 'events.eventsByEventType.sentPacket') || [];
  if (sentPackets.length > 0) {
    axisId = builder.addScatter('sentPackets', sentPackets, 'nodeNum');
  }

  const recvPackets = deref(state, 'events.eventsByEventType.recvPacket') || [];
  if (recvPackets.length > 0) {
    builder.addScatter('recvPackets', recvPackets, 'nodeNum', axisId);
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

