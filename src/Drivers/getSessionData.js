
import {
  addRawTimeSeriesFeedData,
  addTimeSeriesData,
  addSessions,
  addClients,
}                                   from '../Actions/Actions'
import {
  setCurrentSession
}                                   from '../Actions/LoadSessionData'
import {
  config
}                                   from '../utils'
import {
  resetTimeSeriesData,
}                               from '../Actions/Actions';

const request               = require('superagent');
const _                     = require('underscore');
const sg                    = {...require('sgsg/lite'), ...require('sgsg/flow')}

const dataBootstrap = 'dataBootstrap';
const numSessions   = 18;

var dataCount = 0;
var feedRequestCount = 1;
function attachToFeed(store) {

  // Continually request the feed data
  return config.urlFor('feed', `feed?clientId=${config.getClientId()}&expectJson=1`, true, function(err, feedEndpoint) {
    return sg.until(function(again, last, count, elapsed) {
      return sg.__run3([function(next, enext, enag, ewarn) {

        // Make sure we wait at the beginning of each time throught the loop
        return sg.setTimeout(10, next);

      }, function(next, enext, enag, ewarn) {
        return request.get(feedEndpoint+`&count=${feedRequestCount}`).end(function(err, res) {
          feedRequestCount += 1;

          // If there is an HTTP error, report it and try again
          if (!sg.ok(err, res)) {
            console.error(err, `Failure getting ${feedEndpoint}`);
            return again(500);
          }

          // If we got an empty response, just wait a few and try again
          if (!res.body) { return again(750); }

          var payload = res.body;
          if (_.isString(payload)) {
            payload = sg.safeJSONParseQuiet(payload);
          }

          // We got data, dispatch it
          if (payload) {
            dataCount += crackPayload(payload, store);
          }

          return again();
        });
      }], function() {
        return last();
      });
    }, function() {
    });
  });

}

function crackPayload(payload_, store) {
  var payload__ = payload_ || {};

  if (!_.isArray(payload__)) {
    return crackPayload([payload__], store);
  }

  var itemCount = 0;

  const payloadList = payload__;
  _.each(payloadList, (payload) => {
    var prefix = '';    // eslint-disable-line no-unused-vars

    // Next is the requestId, if any
    if (payload.dataBootstrap) {
      payload = payload.dataBootstrap;
      prefix = `${prefix}dataBootstrap.`;

    // } else if (payload[sessionInfoRequestId]) {    /* other message names here */
    //   payload = payload[sessionInfoRequestId];
    //   prefix = `${prefix}${sessionInfoRequestId}.`;
    }

    // If it is raw data, the next index will be 'dataPoints'
    if (payload.dataPoints && payload.dataPoints.items) {
      store.dispatch(addRawTimeSeriesFeedData(payload));
      return;
    }

    // OK, we are at the real data
    _.each(payload, (aPayload, key) => {

      const tsm = aPayload.timeSeriesMap;
      if (tsm) {
        _.each(tsm, (ts, name) => {
          var tsItem = _.omit(aPayload, 'timeSeriesMap');
          tsItem.name = name;
          tsItem.timeSeries = ts;

          store.dispatch(addTimeSeriesData(tsItem));
        });

        ////////// store.dispatch(setCurrentSessionId(aPayload.sessionId));
        return;
      }

      // Count the nuber of items
      itemCount += arrayCount(aPayload) + arrayCount(aPayload.items);

      // We may eventually have intelligence here, but for now,
      // let the dynamic dispatcher handle it

      if (key === 'sessions') {
        store.dispatch(addSessions(aPayload.items));
      } else if (key === 'clients') {
        store.dispatch(addClients(aPayload.items));
      }
    });
  });


  return itemCount;
}




const xtime = new Date();
const goodSamples = _.map([{
  "sessionId" : "zIP0najQA74IImI51VE9eyu30furniBFmkdtwo7Dn2ymRhePp624kx6Prf9dmRBs-20180709051907753",
}, {
  "sessionId" : "A00CIOMLvczYMoUcdf0Vhy6SDuzlvwgWlXsqiu70vIOVttuC10gx0SojgN8faUHC-20180630174600154",
}, {
  "sessionId" : "A00CIOMLvczYMoUcdf0Vhy6SDuzlvwgWlXsqiu70vIOVttuC10gx0SojgN8faUHC-20180312124354509",
}, {
  "sessionId" : "A00CIOMLvczYMoUcdf0Vhy6SDuzlvwgWlXsqiu70vIOVttuC10gx0SojgN8faUHC-20180508184651460",
}, {
  "sessionId" : "mYagFRwcqeyX6E0ISpC7WV5sA1yVadIWowiADINqxHUG4ldh0rUcPmc4B0iKKVo0-20180601165717403",
}, {
  "sessionId" : "mYagFRwcqeyX6E0ISpC7WV5sA1yVadIWowiADINqxHUG4ldh0rUcPmc4B0iKKVo0-20180603220418569",
}, {
  "sessionId": "SPARKSB3-20180627204041067"
}], item => sg.extend({mtime:xtime, ctime:xtime, clientId:item.sessionId.split('-')[0]}, item));


export function getSessionData(store) {
  attachToFeed(store);

  // const firstSessionId = 'A00CIOMLvczYMoUcdf0Vhy6SDuzlvwgWlXsqiu70vIOVttuC10gx0SojgN8faUHC-20180312124354509'
  const firstSessionId = 'A00CIOMLvczYMoUcdf0Vhy6SDuzlvwgWlXsqiu70vIOVttuC10gx0SojgN8faUHC-20180701022645962'

  store.dispatch(addSessions(goodSamples));
  store.dispatch(resetTimeSeriesData());
  store.dispatch(setCurrentSession(firstSessionId));

  return config.urlFor('query', `querySessions?destKey=asdf&requestId=${dataBootstrap}&limit=${numSessions}&dataType=dbRecords`, true, function(err, queryEndpoint) {
    return sg.until(function(again, last, count, elapsed) {

      // Have we gotten any data yet?
      if (dataCount >= numSessions) {
        return last();
      }

      return request.get(queryEndpoint).end(function(err, res) {
        return again(1500);
      });
    }, function done() {
    });
  });
}





function arrayCount(arr) {
  if (!_.isArray(arr))  { return 0; }

  return arr.length;
}

