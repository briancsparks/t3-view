
import React                  from 'react';
import {
  TimeSeries,
  TimeRange
}                             from 'pondjs';
import _                      from 'underscore';
import sg, {
  isnt
}                             from 'sgsg/lite';
import {
  invokeIt
}                             from '../utils';
import { cold }               from 'react-hot-loader';

import {
  Resizable,
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
cold(Resizable)
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
      brushrange  : null
    };
  }

  componentDidMount() {
  }

  render() {

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
      return sg.reduce(seriesList, m0, (m, seriesItem) => {
        return [...m, seriesItem.scatterChart.timeSeries];
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
    const brushrange        = new TimeRange([firstMwpUpTick, lastMwpUpTick]);


    // console.log(`mwpup size: ${mwpTimeSeries.size()}`);

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
            <Resizable>
              <ChartContainer
                  timeRange={fullTimeRange}
                  format="relative"
                  trackerPosition={this.state.tracker}
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

            </Resizable>
          </div>
        </div>


      </div>
    )
  }

  renderChartRow(timerange, seriesList, n) {

    const infoValues = () => {
      return [{
        label: "Fooadfafasf",
        value: `${n}-Barsdaafasdfs`
      }];
    };

    return (

      <div className="row" id={n}>
        <div className="col-md-12" style={chartStyle}>
          <Resizable>

            <ChartContainer timeRange={timerange}
              format="relative"
              trackerPosition={this.state.tracker}
              onTrackerChanged={this._handleTrackerChanged.bind(this)}
              onTimeRangeChanged={this._handleTimeRangeChange.bind(this)}
              onChartResize={this._handleChartResize.bind(this)}
            >

              <ChartRow height="100" debug={false}
                visible={true}
                trackerInfoValues={infoValues()}
                trackerInfoHeight={40}
                trackerInfoWidth={110}
                trackerInfoStyle={{
                  fill: 'black',
                  color: '#DDD'
                }}
              >

                {sg.reduce(seriesList, [], (m, seriesItem, n) => {
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

                {sg.reduce(seriesList, [], (m, seriesItem, n) => {
                  const { yAxis } = seriesItem;
                  if (!yAxis) {
                    return m;
                  }
                  return sg.ap(m,
                    <YAxis id={yAxis.axisId}
                      label={yAxis.label || 'label'}
                      key={n}
                      min={yAxis.seriesMin || 0}
                      max={yAxis.seriesMax || 256}
                      width={70}
                      type="linear"
                      format=",.1f" />
                  )
                })}

                <Charts>

                  {sg.reduce(seriesList, [], (m, seriesItem, n) => {
                    const { scatterChart }    = seriesItem;
                    return sg.ap(m,
                      <ScatterChart axis={scatterChart.axisId} key={n}
                        series={scatterChart.timeSeries}
                        columns={[scatterChart.deepKey]}
                        style={scatterChart.style}
                        onMouseNear={this._handleMouseNear.bind(this)}
                        info={infoValues()}
                        infoHeight={40}
                        infoWidth={110}
                        infoStyle={{
                          fill: 'black',
                          color: '#DDD'
                        }}
                      />
                    )
                  })}


                </Charts>

                {sg.reduce(seriesList, [], (m, seriesItem, n) => {
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

                {sg.reduce(seriesList, [], (m, seriesItem, n) => {
                  const yAxis     = seriesItem.yAxis2;
                  if (!yAxis) {
                    return m;
                  }
                  return sg.ap(m,
                    <YAxis id={yAxis.axisId}
                      label={yAxis.label || 'label'}
                      key={n}
                      min={yAxis.seriesMin || 0}
                      max={yAxis.seriesMax || 256}
                      width={140}
                      type="linear"
                      format=",.1f" />
                  )
                })}

              </ChartRow>
            </ChartContainer>
          </Resizable>
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

    // const {column, event} = stats;
    // console.log(column, event.toJSON());
  }


}




