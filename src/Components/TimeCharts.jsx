

import React                  from 'react';
import sg                     from 'sgsg/lite';
import _                      from 'underscore';
import {
  invokeIt,
  drawEach,
}                             from '../utils';

import {
  TimeSeries,
  TimeRange
}                             from 'pondjs';
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
import { cold }               from 'react-hot-loader';

// Must 'cold' all modules from react-timeseries-charts. See https://www.npmjs.com/package/react-hot-loader
//    (look for the section on colding modules)
cold(_)
cold(TimeSeries)
cold(TimeRange)

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

const brushStyle = {
  boxShadow: "inset 0px 2px 5px -2px rgba(189, 189, 189, 0.75)",
  background: "#FEFEFE",
  paddingTop: 10
};

const style = styler([
  { key: "it.loopNum", color: "steelblue", width: 1, opacity: 0.5 }
]);

function errorReason(reason, props) {
  console.error(reason);
  console.log(`checkProps -- ${reason}`, {props});
  return (
    <span>
      {`${reason}`}
    </span>
  );
}

function checkProps(props, requiredKeys) {
  for (var i = 0; i < requiredKeys.length; ++i) {
    const key = requiredKeys[i];
    if (!(key in props)) {
      return errorReason(`${key} is required`);
    }
  }
}

export function TimeCharts({ help, ...props }) {
  // console.log(`ipacrosstimecomponent`, {props:this.props});

  var reason;
  const requiredKeys = 'controlEvents,charts,brushrange,tracker,onTimeRangeChanged,onTrackerChanged,onChartResize'.split(',');
  if ((reason = checkProps(props, requiredKeys))) {
    return reason;
  }

  const {
    controlEvents,
    charts,
    brushrange,
    tracker,
    onTimeRangeChanged,
    onTrackerChanged,
    onChartResize,
    width,
  }                   = props;

  if (!controlEvents || controlEvents.length <= 0)    { return errorReason(`No Control Events`, props); }

  const mwpPoints = _.sortBy(controlEvents.map((event) => [event.tick, event]), x => x[0])
  const mwpTimeSeries = new TimeSeries({name:'mwpUp', utc:true, columns:['time', 'it'], points:mwpPoints})

  const allTimeseries = sg.reduce(charts, [mwpTimeSeries], (m0, seriesList) => {
    return sg.reduce(seriesList.items, m0, (m, seriesItem) => {
      return [...m, seriesItem.scatterChart.series];
    })
  })

  var   firstMwpUpTick    = mwpTimeSeries.range().begin().getTime();
  var   lastMwpUpTick     = mwpTimeSeries.range().end().getTime();
  const mwpUpRange        = lastMwpUpTick - firstMwpUpTick;
  const extra             = mwpUpRange * 0.05;

  const firstTick         = Math.max(-(1000 * 60 * 5),
                                sg.reduce(allTimeseries, firstMwpUpTick, (m, ts) => invokeIt(Math.min, ts.range().begin(), m)));
  const lastTick          = Math.min(1000 * 60 * 5,
                                sg.reduce(allTimeseries, lastMwpUpTick,  (m, ts) => invokeIt(Math.max, ts.range().end(),   m)));

  firstMwpUpTick         -= extra;
  lastMwpUpTick          += extra;

  // These are used in the HTML
  const loopNumMax        = mwpTimeSeries ? mwpTimeSeries.max('it.loopNum') : 100;
  const fullTimeRange     = new TimeRange([firstTick, lastTick]);
  // const myBrushrange      = brushrange || new TimeRange([firstMwpUpTick, lastMwpUpTick]);
  const myBrushrange      = brushrange || fullTimeRange;

  return (
    <div>

    {charts.map((seriesList, n) => {
      // return this.renderChartRow(myBrushrange, seriesList, n+1)
      // renderChartRow(timerange, seriesList, n) {

        const infoValues = () => {
          return seriesList.info;
        };

        return (
        <div className="row" key={n} id={n}>
          <div className="col-md-12" style={chartStyle}>
            {/* <Resizable> */}

              <ChartContainer timeRange={myBrushrange}
                format="relative"
                trackerPosition={tracker}
                onTrackerChanged={onTrackerChanged}
                onTimeRangeChanged={onTimeRangeChanged}
                onChartResize={onChartResize}
                width={width || 1100}
              >

                <ChartRow height="150" debug={false}
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
                        <ScatterChart {...scatterChart} key={n}/>
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
    })}


    <div className="row">
      <div className="col-md-12" style={brushStyle} id="mysizingdiv">
        {/* <Resizable> */}
          <ChartContainer
              timeRange={fullTimeRange}
              format="relative"
              trackerPosition={tracker}
              width={width || 1100}
              >
            <ChartRow height="60" debug={false}>
              <Brush
                timeRange={myBrushrange}
                allowSelectionClear
                onTimeRangeChanged={onTimeRangeChanged}
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
                {/* {console.log({a:mwpTimeSeries.toJSON()})} */}
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
  // <FormGroup controlId={id}>
  //     <ControlLabel>{label}</ControlLabel>
  //     <FormControl {...props} />
  //     {help && <HelpBlock>{help}</HelpBlock>}
  //   </FormGroup>
  );
}

