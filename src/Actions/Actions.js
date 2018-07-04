
import {
  INCR_CURRENT_TEST_COUNT,
  ADD_RAW_TIMESERIES_FEED_DATA,
  ADD_TIMESERIES_DATA,
  ADD_SESSIONS,
  ADD_CLIENTS,
  RESET_TIMESERIES_DATA,
  SET_CURRENT_SESSION,
}                                   from './ActionTypes';
import { storifiedAction }          from './ActionUtilities';

export const addRawTimeSeriesFeedData     = storifiedAction(ADD_RAW_TIMESERIES_FEED_DATA);
export const addTimeSeriesData            = storifiedAction(ADD_TIMESERIES_DATA);
export const addSessions                  = storifiedAction(ADD_SESSIONS);
export const addClients                   = storifiedAction(ADD_CLIENTS);
export const resetTimeSeriesData          = storifiedAction(RESET_TIMESERIES_DATA);
export const setCurrentSession            = storifiedAction(SET_CURRENT_SESSION);

export const incrCurrentTestCount2        = storifiedAction(INCR_CURRENT_TEST_COUNT);

export function incrCurrentTestCount(data = 1) {
  return {
    type    : INCR_CURRENT_TEST_COUNT,
    payload : data
  }
}

export default {
  incrCurrentTestCount
};

