
/**
 *
 */
// import { format }             from 'd3-format';
import {
  TimeSeries,
  // TimeRange
}                             from 'pondjs';
import { cold }               from 'react-hot-loader';
import { invokeIt }           from '../../utils';

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
// const columns=['time', 'it'];
function columns(...names) {
  return ['time', ...names];
}


export class Builder {

  constructor() {
    this.rows     = [{items:[]}];
    this.axisIds  = {};
  }

  getCharts() {
    return this.rows;
  }

  addRow() {
    this.rows.push({items:[]})
  }

  addScatter(name, data, key, options_) {
    var   seriesItem      = {};
    const options         = options_          || {};
    const axisId          = options.axisId    || `${name}AxisId`;
    const label           = options.label     || key;

    const deepKey         = options.deepKey   || `${name}.y`;

    var tsData = data.map(item => {
      return [item.tick, {y: item[key], ...item}];
    })

    tsData = _.sortBy(tsData, x => x[0])

    const timeSeries  = new TimeSeries({name, utc, columns:columns(name), points:tsData});

    seriesItem.scatterChart = {
      series      : timeSeries,
      columns     : [deepKey],
      style       : scatterStyle(deepKey),
      axis        : axisId,
    };

    if (!this.axisIds[axisId]) {
      seriesItem.yAxis = {
        id          : axisId,
        label       : label,
        min         : timeSeries.min(deepKey),
        max         : timeSeries.max(deepKey),
        type        : 'linear',
        format      : ',.1f',
        width       : 70,
      };
      this.axisIds[axisId] = seriesItem.yAxis;
    }

    var seriesList = this.rows.pop();
    seriesList.items.unshift(seriesItem);
    this.rows.push(seriesList);

    return axisId;
  }

  appendScatter(bigName, dataList, options_) {
    const options         = options_          || {};
    var   seriesItem      = {};

    const axisId          = options.axisId    || `${bigName}AxisId`;
    const deepKey         = options.deepKey   || `${bigName}.y`;
    var   label           = options.label;
    var   tsData = [];
    var   items  = [];

    dataList.forEach(dataItem => {
      const { /* name, */ data, key } = dataItem;

      label = label || key;

      const newItems = data.map(item => ({y: +item[key], ...item}));

      items   = [...items, ...newItems];
      tsData  = [...tsData, ...newItems.map(item => {
        return [item.tick, item];
      })]

      tsData = _.sortBy(tsData, x => x[0])

    });

    const timeSeries  = new TimeSeries({bigName, utc, columns: ['time', bigName], points:tsData});

    seriesItem.items        = items;
    seriesItem.scatterChart = {
      series      : timeSeries,
      columns     : [deepKey],
      style_      : scatterStyle(_.pluck(dataList, 'name')),
      axis        : axisId,
    };

    seriesItem.scatterChart.style = (function() {
      const sStyle = scatterStyle([..._.pluck(dataList, 'name'), 'other'].map(s => s.toLowerCase()));
      return function(column, event) {
        var   name  = event.get(`${bigName}.mod`).toLowerCase();
        const style = sStyle[name];

        return style || sStyle.other;
      };
    }());


    seriesItem.yAxis = {
      id          : axisId,
      label       : label,
      min         : invokeIt(Math.min, timeSeries.min(deepKey), options.min),
      max         : invokeIt(Math.max, timeSeries.max(deepKey), options.max),
      type        : 'linear',
      format      : ',.1f',
      width       : 70,
    };

    var seriesList = this.rows.pop();
    seriesList.items.unshift(seriesItem);
    this.rows.push(seriesList);

    return axisId;
  }


  // The below actually works as intended (merging the lists), but is
  // not handled right by the charting lib

  // appendScatter(dataList, options_) {
  //   const options         = options_          || {};

  //   var   seriesItem      = {
  //     scatterChart  : { columns: [], tsData: [] },
  //     yAxis         : { min: null, max: null },
  //   };

  //   var axisIdOut;
  //   dataList.forEach(dataItem => {
  //     const { name, data, key } = dataItem;
  //     var   sc                  = seriesItem.scatterChart;
  //     var   yx                  = seriesItem.yAxis;

  //     const axisId          = yx.id       || options.axisId    || `${name}AxisId`;
  //     const label           = yx.label    || options.label     || key;

  //     const deepKey         = options.deepKey   || `${name}.${key}`;

  //     var space = sc.columns.map(x => null);

  //     // Add a new column to the old data
  //     sc.tsData = sc.tsData.map(data => {
  //       return [...data, null];
  //     });

  //     const origLen = sc.tsData.length;
  //     sc.tsData = sg.reduce(data, sc.tsData || [], (m, item) => {
  //       const index = matchingTick(m, item.tick, origLen);
  //       if (!(key in item)) {
  //         console.log(`missing key ${key} in`, {item});
  //       }

  //       if (!sg.isnt(index)) {
  //         m[index].pop();
  //         m[index].push({y: item[key], ...item});
  //       } else {
  //         m = [...m, [item.tick, ...space, {y: item[key], ...item}]];
  //       }

  //       return m;
  //     });

  //     sc.tsData = _.sortBy(sc.tsData, x => x[0]);

  //     sc.columns.push(deepKey);
  //     sc.tscolumns = sc.columns.map(x => x.split('.')[0]);
  //     sc.series = new TimeSeries({name, utc, columns: ['time', ...sc.tscolumns], points: sc.tsData});
  //     sc.style  = scatterStyle(sc.columns);
  //     sc.axis   = axisId;

  //     yx.id           = axisId;
  //     yx.label        = label;
  //     yx.type         = 'linear';
  //     yx.format       = ',.1f';
  //     yx.width        = 70;

  //     yx.actualMin    = invokeIt(Math.min, yx.actualMin, sc.series.min(deepKey)) || null;
  //     yx.actualMax    = invokeIt(Math.max, yx.actualMax, sc.series.max(deepKey)) || null;

  //     const range     = yx.actualMax - yx.actualMin;

  //     yx.min          = yx.actualMin - (range*0.10);
  //     yx.max          = yx.actualMax + (range*0.10);

  //     axisIdOut = axisId;
  //   });


  //   var seriesList = this.rows.pop();
  //   seriesList.items.unshift(seriesItem);
  //   this.rows.push(seriesList);

  //   return axisIdOut;
  // }

}

// function matchingTick(list, tick, origLen) {
//   for (var i = 0; i < origLen; ++i) {
//     if (list[i][0] === tick) {
//       return i;
//     }
//   }
//   return null;
// }

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


const colors_ = 'steelblue,red,salmon,blue,cadetblue,springgreen'.split(',');
function pickColor(n) {
  return colors_[n%colors_.length];
}

function scatterStyle(deepKeys) {
  if (!_.isArray(deepKeys)) { return scatterStyle([deepKeys]); }

  return sg.reduce(deepKeys, {}, (m, deepKey, n) => {
    return  {
      ...m,
      [deepKey]: {
        normal: {
          fill: pickColor(n),
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
  });
}

// function _vor(x, def) {
//   if (sg.isnt(def))   { return x; }
//   if (sg.isnt(x))     { return def; }
//   return x;
// }

export function allAxesInList(seriesList) {
  return sg.reduce(seriesList, [], (m, seriesItem) => {
    const axis = seriesItem.yAxis || seriesItem.labelAxis || seriesItem.valueAxis;
    if (!axis)  { return m; }
    return sg.ap(m, axis);
  })
}

export function allChartsInList(seriesList) {
  return seriesList.map((seriesItem) => {
    return seriesItem.scatterChart;
  });
}
