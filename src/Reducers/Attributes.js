
import {
  ADD_RAW_ATTRIBUTE_DATA
}                             from '../Actions/ActionTypes.js';
import {
  unpackPayload,
  subnetExtents
}                             from '../utils';
const sg                    = require('sgsg/lite');
const _                     = require('underscore');

const { deref }             = sg;

const initialState = {
  entities  : {}
};

export function attributes(state = {...initialState}, action) {

  const { type } = action;

  switch (type) {
    case ADD_RAW_ATTRIBUTE_DATA:
      return handleRawAttributesData(state, action);

    default:
      return state;
  }
}

var   handlers = {};

function handleRawAttributesData(state, action) {
  const { payload }   = action;
  const attributes    = unpackPayload(payload)

  var   entities = mergeEntities(state.entities, attributes.items);

  entities = _.groupBy(entities, 'type');
  entities = sg.reduce(entities, {}, (m, value, key) => {
    const fn = handlers[key] || _.identity;
    return sg.kv(m, key, value.map(fn));
  })

  // Sub-group by id
  entities = sg.reduce(entities, {}, (m, list, key) => {
    return {...m, [key]: _.groupBy(list, 'id')}
  })

  return {...state, entities};
}

handlers.interface = function(iface) {
  return {...iface, ...subnetExtents(iface)}
}

function mergeEntities(current, newItems) {
  const newEntities = _.map(newItems, (attrList) => {
    return sg.reduce(attrList, {}, (m, attr) => {

      var result = {...m, who: attr.who, when: attr.when, type: attr.type, id: attr.id, [attr.key]: attr.value};
      if (attr.type === 'ip') {
        result = {...result, ip: attr.id};
      }

      return result;
    })
  })

  return [...current, ...newEntities];
}

export function enumEntity(state, name, fn_) {
  const fn      = _.isFunction(fn_) ? fn_ : _.identity;
  var   result  = [];

  const entityList = deref(state, `attributes.entities.${name}`);
  _.each(entityList, (entitySet, name) => {
    const item = _.sortBy(entitySet, 'when')[0] || {};
    sg.ap(result, fn(item));
  })

  return result;
}


