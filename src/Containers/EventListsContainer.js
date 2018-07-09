
import { connect }              from "react-redux";
// import _                        from 'underscore';
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

  const props = {
    eventLists    : {
      ...state.EventLists,
      ...ownProps
    },
    ipAcrossTime  : {
      mwpUpEvents : deref(state, 'events.eventsByEventType.mwpUp') || [],
      charts      : [],
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


