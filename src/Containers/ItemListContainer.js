import { connect }              from "react-redux";
import _                        from 'underscore';
import {
  setCurrentSession,
}                               from '../Actions/LoadSessionData';
import {
  resetTimeSeriesData,
}                               from '../Actions/Actions';
import {
  displayClientId,
  displaySessionId
}                             from '../utils';

const displayFn = {
  clients    : displayClientId,
  sessions   : displaySessionId
};


const mapStateToProps = (state, ownProps) => {
  const { itemType, itemKeyName } = ownProps;

  const items       = [...(state[itemType] || [])];
  const displayId   = displayFn[itemType]     || _.identity;

  return {
    items,
    itemType,
    itemKeyName,
    displayId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onItemSelected: (id) => {
      dispatch(resetTimeSeriesData());
      dispatch(setCurrentSession(id));
    }
  }
}

export const ItemList = connect(
  mapStateToProps,
  mapDispatchToProps
)(require('../Components/ItemList.jsx').ItemList);

