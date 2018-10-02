
/**
 *  @file
 *
 *  Shows a list of lines from a line-oriented log file like logcat.
 *
 *  Starts with a select control to select the source of lines (like "logcat"), followed by a sub-catgory
 *  ("module" in the UI), a RegExp control, and the lines themselves.
 *
 *  * Holds the time-series charts, which are implemented in TimeCharts.jsx
 *
 */

import React, { Component }   from 'react'
// import {
//   IpAcrossTimeComponent
// }                             from '../Components/IpAcrossTimeComponent';
// }                             from '../Containers/IpAcrossTimeContainer'
import sg, {
  deref
}                             from 'sgsg/lite'
import _                      from 'underscore'
import {
  renderable
}                             from '../utils'
import {
  Form, FormControl, ControlLabel, FormGroup, HelpBlock,
}                             from 'react-bootstrap'

import {
  TimeCharts,
}                             from './TimeCharts';
// import {
//   TimeSeries,
//   TimeRange
// }                             from 'pondjs';
// import { cold }               from 'react-hot-loader';
// cold(TimeCharts)
// cold(TimeRange)

// const initialRange = new TimeRange([75 * 60 * 1000, 125 * 60 * 1000]);

export class EventLists extends Component {

  constructor(props) {
    super(props);
    this.state = {
      brushrange  : null,
      tracker     : null,
      widths      : {},
      re          : '.',
    };
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this._handleResize();
    });
    this._handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => {
    });
  }

  _handleResize() {
    const sizingDiv = document.getElementById('mysizingdiv');
    if (sizingDiv) {
      const width = sizingDiv.offsetWidth - 100;
      // const width = sizingDiv.clientWidth;
      this.setState({widths: {...this.state.widths, mysizingdiv: width}});
      // console.log(`found mysizingdiv ${width}`, {sizingDiv});
    }
  }

  _handleChange(e) {
    this.setState({re: e.target.value});
  }

  render() {
    // console.log(`EventLists.render`, {props: this.props});

    const eventLists = this.props.eventLists;

    const tcProps = {
      ...this.props.ipAcrossTime,
      brushrange  : this.state.brushrange,
      tracker     : this.state.tracker,

      // eslint-disable-next-line no-mixed-operators
      width       : this.state.widths && this.state.widths.mysizingdiv || 1100,

      onTimeRangeChanged    : this._handleTimeRangeChanged.bind(this),
      onTrackerChanged      : this._handleTrackerChanged.bind(this),
      onChartResize         : this._handleChartResize.bind(this),
    };

    const msgList   = deref(this.props, 'eventLists.msgList') || [];

    // console.log(`renderwidths`, {w:this.state.widths});

    return (

      <div>
        {/* <IpAcrossTimeComponent {...this.props.ipAcrossTime}></IpAcrossTimeComponent> */}
        {/* <IpAcrossTimeComponent></IpAcrossTimeComponent> */}

        <TimeCharts {...tcProps}></TimeCharts>

        {sg.reduce(eventLists.items, [], (m, eventList, eventListNum) => {
          const chosen    = eventList.chosen;

          return ([...m,
            <div className="row" id={eventListNum} key={eventListNum}>
              <div className="col-md-12">

                <Form inline>

                  {/* {---------- The Source Select ----------} */}
                  <FormGroup controlId={`${eventListNum}-source`}>
                    <ControlLabel>Source</ControlLabel>
                    <FormControl componentClass="select" placeholder="source" value={`${eventListNum}.${chosen[0]}`} onChange={this.props.onSelected}>
                      {/* <option value={`${eventListNum}.all`}>all</option> */}
                      {renderable(eventList.sources, (x_items, source, sourceNum) => {
                        return ([
                          // <option value={`${eventListNum}.${source}`} selected={source===chosen[0]}>{source}</option>
                          <option {...optionProps(`${eventListNum}.${source}`, source===chosen[0])}>{source}</option>
                        ])
                      })}
                    </FormControl>
                  </FormGroup>{' '}

                  {/* {---------- The Sub-Collection ("module" in UI) Select ----------} */}
                  <FormGroup controlId={`${eventListNum}-mod`}>
                    <ControlLabel>Module</ControlLabel>
                    <FormControl componentClass="select" placeholder="module" value={chosen[1] ? `${eventListNum}.${chosen[0]}.${chosen[1]}` : `choose`} onChange={this.props.onSelected}>
                      {(chosen[1] !== null) ? null :
                        <option value="choose">choose</option>
                      }
                      {(() => {
                        const items = eventList.sources[chosen[0]];
                        var    keys  = _.sortBy(_.keys(items), key => items[key].count);
                        keys.reverse();
                        // var    keys  = _.sortBy(_.keys(items), key => key.toLowerCase());
                        return (
                          renderable(keys, (name, n) => {
                            const item = items[name];
                            // const display = `${name}-${item.count}`;
                            const display = `${item.count}-${name}`;
                            return ([
                              <option {...optionProps(`${eventListNum}.${chosen[0]}.${name}`, name===chosen[1])}>{display}</option>
                            ])
                          })
                        )
                      })()}
                      <option value="all">all</option>
                    </FormControl>
                  </FormGroup>{' '}

                  {/* {---------- The RegEx Edit ----------} */}
                  <FieldGroup
                    id="re1"
                    type="text"
                    label="RegEx 1"
                    onChange={this._handleChange.bind(this)}
                    placeholder="/(...)/"
                  />{' '}

                </Form>

                {/* {---------- The List of Lines ----------} */}
                <div style={{font:"400 10px courier", textAlign:"left"}}>

                  {msgList.map(str => {
                    var re;
                    try {
                      re = new RegExp(this.state.re || '.');
                    } catch(e) {
                      return (
                        <p>
                          Invalid RegExp
                        </p>
                      )
                    }

                    const m = re.exec(str);
                    if (!m) {
                      return (
                        <div>
                          <span style={{whiteSpace:"nowrap", textOverflow:"ellipsis"}}>{str}</span>
                        </div>
                      )
                    }

                    const left    = str.substr(0, m.index);
                    const middle  = m[0];
                    const right   = str.substr(m.index + middle.length)

                    return (
                      <div>
                        <span style={{font:"400 14px courier", whiteSpace:"nowrap"}}>{left}</span>
                        <span style={{font:"400 16px courier", backgroundColor:"cyan", whiteSpace:"nowrap"}}>{middle}</span>
                        <span style={{font:"400 14px courier", whiteSpace:"nowrap"}}>{right}</span>
                      </div>
                    )
                  })}
                </div>

              </div>
            </div>
          ])
        })}
      </div>

    )
  }

  _handleTrackerChanged(tracker) {
    var state = {tracker};
    this.setState(state);
  }

  _handleTimeRangeChanged(timerange) {
    if (timerange) {
      this.setState({ brushrange: timerange });
    }
  }

  _handleChartResize(width) {
    this.setState({ width });
  }

  _handleChartItemChosen(eventKey, event) {
  }

  _handleChartMouseNear(stats) {
    if (sg.isnt(stats)) { return; }

    // const {column, event} = stats;
    // console.log(column, event.toJSON());
  }

}

function optionProps(value, selected) {
  return {
    key:  value,
    value,
  };
}


function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}
