
import React                  from 'react';
import {
  TimeSeries,
  TimeRange
}                             from 'pondjs';
import _                      from 'underscore';
import {
  isnt
}                             from 'sgsg/lite';
import { cold }               from 'react-hot-loader';

import {
  Resizable,
  ChartRow,
  ChartContainer,
  Brush,
  YAxis,
  // LabelAxis,
  LineChart,
  // ScatterChart,
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
// cold(LabelAxis)
cold(LineChart)
// cold(ScatterChart)
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

    var   props_timeSeries = { ...this.props.timeSeries };

    // const tsData = {name: eventType, columns:['time', 'it'], utc:true, points: eventList.map((event) => [event.tick, event])};





    // const {
    //   firstTick,
    //   lastTick
    // }                       = props_timeSeries;

    // const firstTick         = 0;
    // const lastTick          = 8000;
    const firstTick         = mwpTimeSeries.range().begin();
    const lastTick          = mwpTimeSeries.range().end();

    // const loopNumMax        = 10000;
    const loopNumMax        = mwpTimeSeries ? mwpTimeSeries.max('it.loopNum') : 100;
    const fullTimeRange     = new TimeRange([firstTick, lastTick]);
    const brushrange        = this.state.brushrange || fullTimeRange;


    console.log(`mwpup size: ${mwpTimeSeries.size()}`);

    return (
      <div>

        {/* {this.renderScatterEzChart(brushrange, ezChartData)}
        {this.renderScatterChart(brushrange, 'recvPacket.nodeNum')}
        {this.renderScatterChart(brushrange, 'sentPacket')} */}

        <div className="row">
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




