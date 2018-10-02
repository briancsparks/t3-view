
import request                      from 'superagent';
import {
  // RESET_TIMESERIES_DATA,
  SET_CURRENT_SESSION_ID,
}                                   from './ActionTypes';
import {
  addRawLogcatData,
  addRawTimeStampedData,
  addRawTimeSeriesData,
  addRawAttributeData
}                                   from './Actions';
import { config }                   from '../utils';

const sg                          = {...require('sgsg/lite'), ...require('sgsg/flow')};
const _                           = require('underscore');

var   urlRoot = 'https://pjyf263s1b.execute-api.us-east-1.amazonaws.com/dev';

// /**
//  * Clears the data
//  */
// export function resetTimeSeriesData() {
//   return {
//     type    : RESET_TIMESERIES_DATA
//   }
// }

/**
 * Just sets the sessionId in the store.
 *
 * @param {*} session The chosen session (sessionId or an object that has a sessionId.)
 */
export function setCurrentSessionId(session) {
  var sessionId = session.sessionId || session;

  return {
    type    : SET_CURRENT_SESSION_ID,
    payload : sessionId
  }
}

var allSessions;
const getSession = function(sessionId, callback) {
  if (allSessions) {
    return callback(null, allSessions[sessionId]);
  } else {
    return request
          .get(`${urlRoot}/newsessions`)
          .set(`x-api-key`, `5j0IDUlvWJ8bQmCwJ8JphLEF9msILPzazFboNrWj`)
          .end(function(err, res) {
            if (sg.ok(err, res)) {
              allSessions = sg.reduce(res.body.items, {}, (m,v) => {
                return sg.kv(m, v.sessionId, v);
              });
              return callback(null, allSessions[sessionId]);
            }
          });
  }
};
export function setCurrentSession(session_) {
  const sessionId = session_.sessionId || session_;

  return function(dispatch) {
    return getSession(sessionId, function(err, session) {
      if (sg.ok(err, session) && session.telemetry) {
        // var   list = [...session.telemetry];
        var   list = session.telemetry.filter(item => item.dataType === 'attrstream');
        list = [...list, ...session.telemetry.filter(item => item.dataType !== 'attrstream')];

        return sg.until(function(again, last) {
          if (list.length === 0) { return last(); }

          const current = list.shift();
          return request.get(`${urlRoot}/telemetryblob?Key=${current.Key}`)
                        .set(`x-api-key`, `5j0IDUlvWJ8bQmCwJ8JphLEF9msILPzazFboNrWj`)
                        .end(function(err, res)
          {
            if (sg.ok(err, res) && res.ok) {
              const typename = (res.body || {}).dataType || '';
              dispatchByType(dispatch, typename, res.body);
              return again();
            }
          });
        }, function() {
        });
      }
    });
  };
}

/**
 * Indicates that the user has chosen this session.
 *
 * Will fetch the session telemetry data.
 *
 * @param {*} session The chosen session (sessionId or an object that has a sessionId.)
 */
export function setCurrentSession_X(session) {
  const sessionId = session.sessionId || session;

  return function(dispatch) {

    dispatch(setCurrentSessionId(sessionId));

    return config.urlFor('query', `getS3Keys?sessionId=${sessionId}`, true, function(err, queryEndpoint) {

      // Dispatch the next HXR request
      return request.get(queryEndpoint).end(function(err, res) {
        if (!sg.ok(err, res) || !res.ok) { return; }

        var   items = _.map(res.body.Contents, item => {
          if (item.LastModified) {
            item = sg.kv(item, 'LastModified', new Date(item.LastModified).getTime());
          }
          return {...item, typename: dataType(item)};
        });

        // Load the data files chronologically...
        items = _.sortBy(items, 'LastModified');

        // ...but put the attributes first
        const attributeList     = _.filter(items,      item => item.typename === 'attrstream');
        var   theNotList        = _.filter(items,      item => item.typename !== 'attrstream');
        const telemetryList     = _.filter(theNotList, item => item.typename === 'telemetry');
              theNotList        = _.filter(theNotList, item => item.typename !== 'telemetry');
        const logcatList        = _.filter(theNotList, item => item.typename === 'logcat');
              theNotList        = _.filter(theNotList, item => item.typename !== 'logcat');

        items = [...attributeList, ...telemetryList, ...logcatList, ...theNotList];
        // items = [...attributeList, ...telemetryList, ...theNotList];

        // Loop over and load all the data files
        return sg.until((again, last, count) => {
          if (items.length === 0) { return last(); }

          var item = items.shift();
          const typename = dataType(item);
          if (!typename)  { return again(); }

          return config.urlFor('query', `getS3?key=${item.Key}`, true, function(err, queryEndpoint2) {
            request.get(queryEndpoint2).end(function(err, res) {
              if (!sg.ok(err, res) || !res.ok)  { return again(); }

              // Must send the payload to the right action
              dispatchByType(dispatch, typename, res.body);

              // Fetch the next one
              return again();
            });
          });

        }, function() {

        });

      });
    });
  }
}

/**
 * Determine the right action for the data type
 */
const actionFnsByType = {
  logcat      : addRawLogcatData,
  telemetry   : addRawTimeSeriesData,
  event       : addRawTimeSeriesData,
  attrstream  : addRawAttributeData
};

function dispatchByType(dispatch, type, payload) {

  const fn = actionFnsByType[type];
  if (fn) {
    return dispatch(fn(payload));
  }
}

function dataType(item) {
  var   regExStr = _.keys(actionFnsByType).join('|');

  regExStr = `(${regExStr})`;
  regExStr = `[/]${regExStr}[/]`;
  const match = item.Key.match(new RegExp(regExStr));
  return match ? match[1] : null;
}
