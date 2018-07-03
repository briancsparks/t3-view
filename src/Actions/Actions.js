
import {
  INCR_CURRENT_TEST_COUNT,
}                                   from './ActionTypes';
import { storifiedAction }          from './ActionUtilities';

export const incrCurrentTestCount2   = storifiedAction(INCR_CURRENT_TEST_COUNT);

export function incrCurrentTestCount(data = 1) {
  return {
    type    : INCR_CURRENT_TEST_COUNT,
    payload : data
  }
}

export default {
  incrCurrentTestCount
};

