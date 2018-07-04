
import { connect }              from "react-redux";
// import { reselect }             from 'reselect';
import {
  deref
}                               from 'sgsg/lite';


const mapStateToProps = (state, ownProps) => {

  return {
    mwpUpEvents : deref(state, 'events.eventsByEventType.mwpUp') || []
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

