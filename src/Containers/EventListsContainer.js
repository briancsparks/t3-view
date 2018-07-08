
import { connect }              from "react-redux";
import _                        from 'underscore';
import {
  setEventListSource
}                               from '../Actions/Actions'

var eventLists = {
  items: [{
    chosenSource: 'events',
    chosen: ['events', 'mwpUp'],
    sources : {
      events : 'mwpUp,sentPacket'.split(','),
      logcat : 'WifiStateMachine,WifiConfigManager'.split(','),
    },
  }, {
    chosenSource: 'logcat',
    chosen: ['logcat', 'WifiStateMachine'],
    sources : {
      events : 'mwpUp,sentPacket'.split(','),
      logcat : 'WifiStateMachine,WifiConfigManager'.split(','),
    },
  }]
};

// eventLists.items = [eventLists.items[0]];

var count = 0;
const mapStateToProps = (state, ownProps) => {
  // const { itemType, itemKeyName } = ownProps;

  // const items       = [...(state[itemType] || [])];
  // const displayId   = displayFn[itemType]     || _.identity;

  const chosen = eventLists.items[0].chosen[0];



  const changed = eventLists.items[0].sources[chosen][0] + +(2*count++);
  const origSources = eventLists.items[0].sources

  const sources = {...origSources, [chosen]: [changed, ..._.rest(origSources[chosen])]};
  const items   = [{...eventLists.items[0], sources}, ..._.rest(eventLists.items)];


  var   result = {...eventLists, items};
  // var   result = {...eventLists};
  return {eventLists: result};

  // return {eventLists};

  // eventLists.items[0].sources[chosen][0] += +count;

  // return {
  //   ...eventLists,
  //   items: []
  // };

  // return { ...state, ...ownProps
  //   items,
  //   itemType,
  //   itemKeyName,
  //   displayId
  // }
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
    // onItemSelected: (id) => {
    //   dispatch(resetTimeSeriesData());
    //   dispatch(setCurrentSession(id));
    // }
  }
}

export const EventLists = connect(
  mapStateToProps,
  mapDispatchToProps
)(require('../Components/EventLists.jsx').EventLists);


