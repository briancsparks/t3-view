
import React                  from 'react';
import {
  TimeSeries,
  TimeRange
}                             from 'pondjs';
// import {
//   allAxesInList, allChartsInList,
// }                             from './Builders/TimeSeriesCharts';
import _                      from 'underscore';
import sg, {
  isnt,
  // deref,
}                             from 'sgsg/lite';
import {
  invokeIt,
  drawEach,
}                             from '../utils';
import { cold }               from 'react-hot-loader';

import {
  // Resizable,
  ChartRow,
  ChartContainer,
  Brush,
  YAxis,
  LabelAxis,
  LineChart,
  ScatterChart,
  Charts,
  styler
}                             from 'react-timeseries-charts';

// const sg                      = require('sgsg/lite');
// const deref                   = sg.deref;

// Must 'cold' all modules from react-timeseries-charts. See https://www.npmjs.com/package/react-hot-loader
//    (look for the section on colding modules)
// cold(Resizable)
cold(ChartRow)
cold(ChartContainer)
cold(Brush)
cold(YAxis)
cold(LabelAxis)
cold(LineChart)
cold(ScatterChart)
cold(Charts)
cold(styler)

const chartStyle = {
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#DDD",
  paddingTop: 10,
  marginBottom: 10
};


const initialRange = new TimeRange([75 * 60 * 1000, 125 * 60 * 1000]);

const brushStyle = {
  boxShadow: "inset 0px 2px 5px -2px rgba(189, 189, 189, 0.75)",
  background: "#FEFEFE",
  paddingTop: 10
};

const style = styler([
  { key: "it.loopNum", color: "steelblue", width: 1, opacity: 0.5 }
]);


export class IpAcrossTimeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timerange   : initialRange,
      brushrange  : null,
      seriesListData  : {}
    };
  }

  componentDidMount() {
  }

  render() {

    // console.log(`ipacrosstimecomponent`, {props:this.props});
    const mwpUpEvents       = this.props.mwpUpEvents;

    if (!mwpUpEvents || mwpUpEvents.length <= 0) {
      return (
        <span>
          No mwpUp Events
        </span>
      );
    }

    const mwpPoints = _.sortBy(mwpUpEvents.map((event) => [event.tick, event]), x => x[0])
    const mwpTimeSeries = new TimeSeries({name:'mwpUp', utc:true, columns:['time', 'it'], points:mwpPoints})

    const allTimeseries = sg.reduce(this.props.charts, [mwpTimeSeries], (m0, seriesList) => {
      return sg.reduce(seriesList.items, m0, (m, seriesItem) => {
        return [...m, seriesItem.scatterChart.series];
      })
    })

    var   firstMwpUpTick    = mwpTimeSeries.range().begin().getTime();
    var   lastMwpUpTick     = mwpTimeSeries.range().end().getTime();
    const mwpUpRange        = lastMwpUpTick - firstMwpUpTick;
    const extra             = mwpUpRange * 0.05;

    const firstTick         = sg.reduce(allTimeseries, firstMwpUpTick, (m, ts) => invokeIt(Math.min, ts.range().begin(), m));
    const lastTick          = sg.reduce(allTimeseries, lastMwpUpTick,  (m, ts) => invokeIt(Math.max, ts.range().end(),   m));

    firstMwpUpTick         -= extra;
    lastMwpUpTick          += extra;

    const loopNumMax        = mwpTimeSeries ? mwpTimeSeries.max('it.loopNum') : 100;
    const fullTimeRange     = new TimeRange([firstTick, lastTick]);
    const brushrange        = this.state.brushrange || new TimeRange([firstMwpUpTick, lastMwpUpTick]);

    return (
      <div>

        {this.props.charts.map((seriesList, n) => {
          return this.renderChartRow(brushrange, seriesList, n+1)
        })}

        {/* {this.renderScatterEzChart(brushrange, ezChartData)}
        {this.renderScatterChart(brushrange, 'recvPacket.nodeNum')}
        {this.renderScatterChart(brushrange, 'sentPacket')} */}

        <div className="row" id={0}>
          <div className="col-md-12" style={brushStyle}>
            {/* <Resizable> */}
              <ChartContainer
                  timeRange={fullTimeRange}
                  format="relative"
                  trackerPosition={this.state.tracker}
                  width={this.state.width || 1100}
                >
                <ChartRow height="100" debug={false}>
                  <Brush
                    timeRange={brushrange}
                    allowSelectionClear
                    onTimeRangeChanged={this._handleTimeRangeChange.bind(this)}
                  />
                  <YAxis
                    id="axis1"
                    label="Loop Number"
                    min={0}
                    max={loopNumMax}
                    width={70}
                    type="linear"
                    format="d"
                  />
                  <Charts>
                    <LineChart axis="axis1"
                      series={mwpTimeSeries}
                      columns={["it.loopNum"]}
                      style={style}
                      breakLine={false}
                    />
                  </Charts>
                </ChartRow>
              </ChartContainer>

            {/* </Resizable> */}
          </div>
        </div>


      </div>
    )
  }

  renderChartRow(timerange, seriesList, n) {
    // console.log({seriesList.items, n})

    var handled = false;
    if (!handled) {
      seriesList.info = seriesList.info || [{
        label: "Foo",
        value: `${n}-Barsdaafasdfs`
      }];

      seriesList.items.forEach((seriesItem, n) => {
        // var itemData = {};

        if (seriesItem.scatterChart) {

          // console.log({seriesItem, name:seriesItem.scatterChart.series.name(), columns:seriesItem.scatterChart.series.columns(), n})
          seriesItem.scatterChart.itemData = seriesItem.scatterChart.itemData || {};
          seriesItem.scatterChart.onMouseNear = function(stats) {
            if (isnt(stats)) { return; }

            const {column, event} = stats;
            const eventName = column.split('.')[0] || 'it';

            seriesItem.scatterChart.itemData.highlight = event.get(`${eventName}.__id`);

            seriesList.info = [{
              label: 'msg', value: event.get(`${eventName}.msg`)
            }, {
              label: 'mod', value: event.get(`${eventName}.mod`)
            }];

            // console.log(`mouse ${event.get('it.__id')} ${n}`, {column, seriesItem, itemData:seriesItem.scatterChart.itemData}, event.toJSON());
          };

          seriesItem.scatterChart.radius = function(event, column) {
            const eventName = column.split('.')[0] || 'it';
            if (event.get(`${eventName}.__id`) === seriesItem.scatterChart.itemData.highlight) {
              // console.log(`radius ${event.get('it.__id')} === ${seriesItem.scatterChart.itemData.highlight}`, {event, column, itemData:seriesItem.scatterChart.itemData});
              return 10.0;
            }
            return 3.0;
          };
        }

      })
    }

    const infoValues = () => {
      return seriesList.info;
    };


    return (

      <div className="row" key={n} id={n}>
        <div className="col-md-12" style={chartStyle}>
          {/* <Resizable> */}

            <ChartContainer timeRange={timerange}
              format="relative"
              trackerPosition={this.state.tracker}
              onTrackerChanged={this._handleTrackerChanged.bind(this)}
              onTimeRangeChanged={this._handleTimeRangeChange.bind(this)}
              onChartResize={this._handleChartResize.bind(this)}
              width={this.state.width || 1100}
              >

              <ChartRow height="100" debug={false}
                visible={true}
                trackerInfoValues={infoValues()}
                trackerInfoHeight={40}
                trackerInfoWidth={150}
                trackerInfoStyle={{
                  fill: 'black',
                  color: '#DDD'
                }}
              >

                {sg.reduce(seriesList.items, [], (m, seriesItem, n) => {
                  const { labelAxis } = seriesItem;
                  if (!labelAxis) {
                    return m;
                  }
                  return sg.ap(m,
                    <LabelAxis id={labelAxis.axisId}
                      label={labelAxis.label || 'label'}
                      values={labelAxis.seriesSummaryValues}
                      key={n}
                      min={labelAxis.seriesMin || 0}
                      max={labelAxis.seriesMax || 256}
                      width={70}
                      type="linear"
                      format=",.1f" />
                  )
                })}

                {drawEach(seriesList.items, 'yAxis', (yAxis, n) => (
                  <YAxis {...yAxis} key={n} />
                ))}

                <Charts>

                  {sg.reduce(seriesList.items, [], (m, seriesItem, n) => {
                    const { scatterChart }    = seriesItem;
                    return sg.ap(m,
                      <ScatterChart {...scatterChart} key={n}
                        // onMouseNear={this._handleMouseNear.bind(this)}
                        // onMouseNear={onMouseNear}
                        // info={infoValues()}
                        // infoHeight={40}
                        // infoWidth={110}
                        // infoStyle={{
                        //   fill: 'black',
                        //   color: '#DDD'
                        // }}
                      />
                    )
                  })}


                </Charts>

                {sg.reduce(seriesList.items, [], (m, seriesItem, n) => {
                  const labelAxis     = seriesItem.labelAxis2;
                  if (!labelAxis) {
                    return m;
                  }
                  return sg.ap(m,
                    <LabelAxis id={labelAxis.axisId}
                      label={labelAxis.label || 'label'}
                      values={labelAxis.seriesSummaryValues}
                      key={n}
                      min={labelAxis.seriesMin || 0}
                      max={labelAxis.seriesMax || 256}
                      width={140}
                      type="linear"
                      format=",.1f" />
                  )
                })}

                {drawEach(seriesList.items, 'yAxis2', (yAxis, n) => (
                  <YAxis {...yAxis} key={n} />
                ))}

              </ChartRow>
            </ChartContainer>
          {/* </Resizable> */}
        </div>
      </div>
    )
  }

  _handleTrackerChanged(tracker) {
    var state = {tracker};
    this.setState(state);
  }

  _handleTimeRangeChange(timerange) {
    if (timerange) {
      this.setState({ timerange, brushrange: timerange });
    }
  }

  _handleChartResize(width) {
    this.setState({ width });
  }

  _onItemChosen(eventKey, event) {
  }

  _handleMouseNear(stats) {
    if (isnt(stats)) { return; }

    const {column, event} = stats;
    console.log(column, event.toJSON());
  }


}




