
import {
  INCR_CURRENT_TEST_COUNT,
  ADD_RAW_TIMESERIES_FEED_DATA,
  ADD_TIMESERIES_DATA,
  ADD_SESSIONS,
  ADD_CLIENTS,
  RESET_TIMESERIES_DATA,
  SET_CURRENT_SESSION,
  ADD_RAW_LOGCAT_DATA,
  ADD_RAW_TIMESTAMPED_DATA,
  ADD_RAW_TIMESERIES_DATA,
  ADD_RAW_ATTRIBUTE_DATA,
  SET_EVENT_LIST_SOURCE,
  INCR_HOT_RELOAD_COUNT,
}                                   from './ActionTypes';
import {
  storifiedAction, plainAction
}                                   from './ActionUtilities';

var   Actions = {};

export const addRawTimeSeriesFeedData     = storifiedAction(ADD_RAW_TIMESERIES_FEED_DATA);  Actions = {...Actions, addRawTimeSeriesFeedData};
export const addRawTimeSeriesData         = storifiedAction(ADD_RAW_TIMESERIES_DATA);
export const addTimeSeriesData            = storifiedAction(ADD_TIMESERIES_DATA);
export const addSessions                  = storifiedAction(ADD_SESSIONS);
export const addClients                   = storifiedAction(ADD_CLIENTS);
export const resetTimeSeriesData          = storifiedAction(RESET_TIMESERIES_DATA);
export const setCurrentSession            = storifiedAction(SET_CURRENT_SESSION);
export const addRawLogcatData             = storifiedAction(ADD_RAW_LOGCAT_DATA);
export const addRawTimeStampedData        = storifiedAction(ADD_RAW_TIMESTAMPED_DATA);
export const addRawAttributeData          = storifiedAction(ADD_RAW_ATTRIBUTE_DATA);
export const setEventListSource           = storifiedAction(SET_EVENT_LIST_SOURCE);

export const incrCurrentTestCount2        = storifiedAction(INCR_CURRENT_TEST_COUNT);

export const incrHotReloadCount           = plainAction(INCR_HOT_RELOAD_COUNT);             Actions = {...Actions, incrHotReloadCount};

export function incrCurrentTestCount(data = 1) {
  return {
    type    : INCR_CURRENT_TEST_COUNT,
    payload : data
  }
}

Actions = {...Actions, incrCurrentTestCount};

export default Actions;

