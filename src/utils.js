
/**
 *  Utilites that should be in other packages, but they are here for now.
 */
// import request                from 'superagent';
var   sg                      = {...require('sgsg/lite'), ...require('sgsg/flow')};
const _                       = require('underscore');
const urlLib                  = require('url');

// _.each(require('sgsg/flow'), (value, key) => { sg[key] = value; });

const deref                     = sg.deref;
const setOnn                    = sg.setOnn;

// This is what the server would return
// TODO: Fix this up for the server-side routing
const webTierColor = 'teal';
const ntlColor     = 'blue';

const startupConfig = {
  "upstreams": {
    "telemetry": `http://${webTierColor}-b47.mobilewebassist.net/ntl/api/v1/${ntlColor}`,
    "attrstream": `http://${webTierColor}-b47.mobilewebassist.net/ntl/api/v1/${ntlColor}`
  },
  "preference": {},
  "upstream": `http://${webTierColor}-b47.mobilewebassist.net/ntl/api/v1/${ntlColor}`
};

export class Config {

  constructor() {
    // const self          = this;
    this.startupConfig  = startupConfig;

    // const startClientUrl = `http://b47hq.mobilewebassist.net/ntl/clientStart?clientId=${this.getClientId()}`;
    // request.get(startClientUrl).end((err, res) => {

    //   // If we didn't get a good response, use the default
    //   if (!sg.ok(err, res) || !res.ok) {
    //     self.startupConfig = startupConfig;
    //     return;
    //   }

    //   self.startupConfig = res.body;
    // });
  }

  urlFor(sub, theRest, isProtectedRoute, callback) {
    const self = this;

    return sg.until((again, last) => {
      if (sg.isnt(self.startupConfig))    { return again(50); }

      /* otherwise */
      return last();
    }, () => {
      const root    = self.startupConfig.upstreams[sub] || self.startupConfig.upstream;
      const fullUrl = _.compact([root, theRest]).join('/');
      const url     = urlLib.parse(fullUrl);

      if (isProtectedRoute) {
        url.path =  url.path.replace('/api/', '/xapi/');
      }

      return callback(null, url.path);
    });
  }

  getClientId() {
    // TODO: compute from mac address or somethings

    // TODO: Must impelment cors or jsonp on the server
    // return process.env.REACT_APP_CLIENT_ID || 'asdf';
    return 'asdf';
  }
}

export let config = new Config();

export function invokeIt(fn /* ... */) {
  const rest = _.filter(_.rest(arguments), (arg) => !sg.isnt(arg));
  return fn(...rest);
}

export function _arry(x) {
  if (sg.isnt(x)) { return []; }
  return [x];
}

export function drawEach(list, name, fn) {
  return sg.reduce(list, [], (m, item, n) => {
    if (sg.isnt(item[name]))  { return m; }

    const items = [item[name]].map(x => {
      return fn(x, n);
    })

    return [...m, ...items];
  })
}

export function renderableArray(items, fn) {
  return sg.reduce(items, [], (m, value, n) => {
    if (sg.isnt(value)) { return m; }

    const it = fn(value, n, n);
    if (sg.isnt(it))    { return m; }

    return [...m, it];
  });
}

export function renderableObject(obj, fn) {
  var n = 0;
  return sg.reduce(obj, [], (m, value, key) => {
    if (sg.isnt(value)) { return m; }

    const it = fn(value, key, n++);
    if (sg.isnt(it))    { return m; }

    return [...m, it];
  });
}

export function renderable(x, fn) {
  if (_.isArray(x)) { return renderableArray(x, fn); }
  return renderableObject(x, fn);
}

export function displaySessionId(session) {
  const sessionId = session.sessionId || session;

  const m = /^([^-]+)-([0-9]+)$/.exec(sessionId);

  if (!m)             { return sessionId; }

  const m2  = /^(....)(..)(..)(..)(..)(..)(...)/.exec(m[2]);
  return `${m[1].substr(0,10)}- ${m2[1]}-${m2[2]}-${m2[3]} : ${m2[4]}-${m2[5]}-${m2[6]} . ${m2[7]}`;
}

export function displayClientId(client) {
  return client.username || client.clientId || client;
}

// eslint-disable-next-line no-unused-vars
export function cleanKey(key) {
  if (sg.isnt(key))   { return key; }

  return key.replace(/[^a-zA-Z0-9_]/ig, '_');
}

export function bestIp(event) {
  if (event.ip) { return ipStringNbo(event.ip); }
  if (event.IP) { return ipStringNbo(event.IP); }
  if (event.Ip) { return ipStringNbo(event.Ip); }

  return sg.reduce(event, null, (m, value, key) => {
    if (m !== null) { return m; }
    if (key.toLowerCase().endsWith('__ip') && value.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)) {
      return value;
    }
  });
}

/**
 * Returns the String IP (converts Numbers to String representation).
 *
 * @param {*} ip The input IP; already a String or a Number.
 */
export function ipString(ip) {
  if (sg.isnt(ip))      { return ip; }
  if (_.isString(ip))   { return ip; }
  if (!_.isNumber(ip))  { return /*undefined*/; }

  // Assumes network byte-order
  return `${((ip & 0xff000000) >> 24) & 0xff}.${((ip & 0xff0000) >> 16) & 0xff}.${((ip & 0xff00) >> 8) & 0xff}.${(ip & 0xff)}`;
}

/**
 * Returns the String IP (converts Numbers to String representation).
 *
 * @param {*} ip The input IP; already a String or a Number.
 */
export function ipStringNbo(ip) {
  if (sg.isnt(ip))      { return ip; }
  if (_.isString(ip))   { return ip; }
  if (!_.isNumber(ip))  { return /*undefined*/; }

  // Assumes network byte-order
  return `${(ip & 0xff)}.${((ip & 0xff00) >> 8) & 0xff}.${((ip & 0xff0000) >> 16) & 0xff}.${((ip & 0xff000000) >> 24) & 0xff}`;
}

export function ipNumber(ip_) {
  if (sg.isnt(ip_))      { return ip_; }
  if (_.isNumber(ip_))   { return ip_; }

  const ip = ip_.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!ip)  { return 0; }

  return (+ip[1]<<24) + (+ip[2]<<16) + (+ip[3]<<8) + (+ip[4]);
}

// export function ipMask(maskSize) {
//   return -1 << (32 - maskSize);
// }

export function subnetExtents(network) {
  var   result = {};

  var first, last;

  result = sg.kv(result, 'firstIp', first = firstIpFromNetmask(network));
  result = sg.kv(result, 'lastIp',  last  = lastIpFromNetmask(network));

  result = sg.kv(result, 'firstIpStr', ipString(first));
  result = sg.kv(result, 'lastIpStr',  ipString(last));

  if (first && last) {
    result = sg.kv(result, 'numNodes',  1+ last - first);
  }

  return result;
}

export function firstIpFromNetmask(ipOnSubnet_, netmask_) {
  if (_.isObject(arguments[0])) {
    if (arguments[0].address && arguments[0].netmask)  { return firstIpFromNetmask(arguments[0].address, arguments[0].netmask); }
    return /*undefined*/;
  }

  const ipOnSubnet = _.isString(ipOnSubnet_) ? ipNumber(ipOnSubnet_) : ipOnSubnet_;
  const netmask    = _.isString(netmask_)    ? ipNumber(netmask_)    : netmask_;

  return ipOnSubnet & netmask;
}

export function lastIpFromNetmask(ipOnSubnet_, netmask_) {
  if (_.isObject(arguments[0])) {
    if (arguments[0].address && arguments[0].netmask)  { return lastIpFromNetmask(arguments[0].address, arguments[0].netmask); }
    return /*undefined*/;
  }

  const ipOnSubnet = _.isString(ipOnSubnet_) ? ipNumber(ipOnSubnet_) : ipOnSubnet_;
  const netmask    = _.isString(netmask_)    ? ipNumber(netmask_)    : netmask_;

  return (ipOnSubnet & netmask) | ~netmask;
}

export function isOnSubnet(node, subnet) {
  const ipNum   = node.ipNum     || ipNumber(node.address);
  const firstIp = subnet.firstIp || firstIpFromNetmask(subnet);

  if (ipNum < firstIp)  { return false; }

  const lastIp  = subnet.lastIp  || lastIpFromNetmask(subnet);

  return ipNum <= lastIp;
}

export function _increment(obj, deepKey) {
  const value = deref(obj, deepKey) || 0;

  setOnn(obj, deepKey, value + 1);

  return obj;
}

// export function fixNodeNum(event, minIpNum) {
//   if (_.isArray(event)) {
//     return [event[0], fixNodeNum(event[1], minIpNum)];
//   }

//   if (sg.isnt(event) || sg.isnt(minIpNum)) { return event; }
//   if ('ipNum' in event) {
//     // event.nodeNum = event.ipNum - minIpNum;
//   }
//   return event;
// }

// export function nodeNumFixer(minIpNum) {
//   return function(event) {
//     return fixNodeNum(event, minIpNum);
//   }
// }

export function unpackPayload(payload) {
  if (sg.isnt(payload))   { return payload; }

  var   result = _.omit(payload, 'payload', 'items');

  result.items = payload.items || payload.payload || [];

  return sg.deepCopy(result);
}

const placeholderKeys = 'y,ip'.split(',');
export function placeholderTimeSeries(name, yValueList) {
  return {
    name,
    columns: ['time', 'it'],
    utc: true,
    points: (yValueList || [1]).map((item => {
      return sg.reduce(placeholderKeys, {}, (m, key) => {
        return sg.kv(m, key, item);
      })
    }))
  }
}

export function placeholderSeries(name, yValueList) {
  var tick = yValueList.length;

  return yValueList.map(item => {
    tick *= 3;
    return {name, tick, ...sg.reduce(placeholderKeys, {}, (m, key) => {
      return sg.kv(m, key, item);
    })}
  })
}

export function _rename(obj, old, new_) {
  return {[new_]:obj[old], ..._.omit(obj, old)}
}

