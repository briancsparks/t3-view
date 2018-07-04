
/**
 *
 */
// import { format }             from 'd3-format';
import {
  TimeSeries,
  // TimeRange
}                             from 'pondjs';
import { cold }               from 'react-hot-loader';

const sg                      = require('sgsg/lite');
const _                       = require('underscore');

cold(TimeSeries)

// const ARGV                    = sg.ARGV();
// const argvGet                 = sg.argvGet;
// const argvExtract             = sg.argvExtract;
// const setOnn                  = sg.setOnn;
// const deref                   = sg.deref;

// const axisLabelFormat     = format(".1f");
// const byteCountFormat     = format(".1f");                // eslint-disable-line no-unused-vars

const utc=true;
const columns=['time', 'it'];



export class Builder {

  constructor() {
    this.rows     = [[]];
    this.axisIds  = {};
  }

  getCharts() {
    return this.rows;
  }

  addScatter(name, data, key, axisId_) {
    var   item      = {};
    const axisId    = axisId_ || `${name}AxisId`;

    const deepKey = `it.${key}`;

    var tsData = data.map(item => {
      return [item.tick, {...item, y: item[key]}];
    })

    tsData = _.sortBy(tsData, x => x[0])

    const timeSeries  = new TimeSeries({name, utc, columns, points:tsData});

    item.scatterChart = {
      timeSeries,
      deepKey,
      style       : scatterStyle(deepKey),
      axisId      : axisId,
    };

    if (!this.axisIds[axisId]) {
      let axis = {
        axisId,
        label       : `${key}`,
        seriesMin   : timeSeries.min(deepKey),
        seriesMax   : timeSeries.max(deepKey),
      };

      item.yAxis = axis;
      this.axisIds[axisId] = axis;
    }

    var x = this.rows.pop();
    x.push(item);
    this.rows.push(x);

    return axisId;
  }

}



// function mkDefTimeSeries(name, deepKey_) {
//   const deepKey   = deepKey_                      || 'it.y';
//   const key       = _.last(deepKey.split('.'))    || 'y';

//   return {
//     deepKey,
//     axisId: `${name}AxisId`,
//     myStyle: scatterStyle(deepKey),
//     timeSeries: new TimeSeries({
//       name: 'TIMESERIES',
//       columns: ['time', 'it'],
//       utc: true,
//       points: [[1, {[key]:42}]]
//     })
//   };
// };

// const mkDefaultLabelAxis = function(deepKey_) {
//   const deepKey = deepKey_ || 'it.y';
//   return {
//     seriesSummaryValues: [{
//       label: "MAX", value: axisLabelFormat(mkDefTimeSeries().timeSeries.max(deepKey))
//     }, {
//       label: "MIN", value: axisLabelFormat(mkDefTimeSeries().timeSeries.min(deepKey))
//     }]
//   };
// };



function scatterStyle(deepKey) {
  return  {
    [deepKey]: {
      normal: {
        fill: "steelblue",
        opacity: 0.8,
      },
      highlighted: {
        fill: "#a7c4dd",
        opacity: 1.0,
      },
      selected: {
        fill: "orange",
        opacity: 1.0,
      },
      muted: {
        fill: "grey",
        opacity: 0.5
      }
    }
  };
}

// function _vor(x, def) {
//   if (sg.isnt(def))   { return x; }
//   if (sg.isnt(x))     { return def; }
//   return x;
// }
