
import { connect }              from "react-redux";
// import _                        from 'underscore';
import {
  setEventListSource
}                               from '../Actions/Actions'

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

  return {eventLists: { ...state.EventLists, ...ownProps }}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSelected: (event) => {
      const value = event.target.value;
      const parts = value.split('.');
      const [
        index, ...chosen ]  = parts;
      dispatch(setEventListSource({value, parts, index, chosen:chosen.join('.')}));
    }
  }
}

export const EventLists = connect(
  mapStateToProps,
  mapDispatchToProps
)(require('../Components/EventLists.jsx').EventLists);


