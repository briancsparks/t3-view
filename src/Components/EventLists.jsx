
import React, { Component }   from 'react'
import {
  IpAcrossTimeComponent
}                             from '../Components/IpAcrossTimeComponent';
// }                             from '../Containers/IpAcrossTimeContainer'
import sg                     from 'sgsg/lite'
import {
  renderable
}                             from '../utils'
import {
  Form, FormControl, ControlLabel, FormGroup, HelpBlock,
}                             from 'react-bootstrap'

export class EventLists extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {

    const eventLists = this.props.eventLists;

    return (

      <div>
        <IpAcrossTimeComponent {...this.props.ipAcrossTime}></IpAcrossTimeComponent>
        {/* <IpAcrossTimeComponent></IpAcrossTimeComponent> */}

        {sg.reduce(eventLists.items, [], (m, eventList, eventListNum) => {
          const chosen    = eventList.chosen;

          return ([...m,
            <div className="row" id={eventListNum} key={eventListNum}>
              <div className="col-md-12">

                <Form inline>

                  {/* {---------- The Source Select ----------} */}
                  <ControlLabel>Source</ControlLabel>
                  <FormControl componentClass="select" placeholder="source" value={`${eventListNum}.${chosen[0]}`} onChange={this.props.onSelected}>
                    {/* <option value={`${eventListNum}.all`}>all</option> */}
                    {renderable(eventList.sources, (x_items, source, sourceNum) => {
                      return ([
                        // <option value={`${eventListNum}.${source}`} selected={source===chosen[0]}>{source}</option>
                        <option {...optionProps(`${eventListNum}.${source}`, source===chosen[0])}>{source}</option>
                      ])
                    })}
                  </FormControl>{' '}

                  {/* {---------- The Sub-Collection Select ----------} */}
                  <ControlLabel>Module</ControlLabel>
                  <FormControl componentClass="select" placeholder="module" value={chosen[1] ? `${eventListNum}.${chosen[0]}.${chosen[1]}` : `choose`} onChange={this.props.onSelected}>
                    {(chosen[1] !== null) ? null :
                      <option value="choose">choose</option>
                    }
                    {renderable(eventList.sources[chosen[0]], (x_items, name, n) => {
                      return ([
                        <option {...optionProps(`${eventListNum}.${chosen[0]}.${name}`, name===chosen[1])}>{name}</option>
                      ])
                    })}
                    <option value="all">all</option>
                  </FormControl>{' '}

                  {/* {---------- The RegEx Edit ----------} */}
                  <FieldGroup
                    id="re1"
                    type="text"
                    label="RegEx 1"
                    placeholder="/(...)/"
                  />{' '}

                </Form>

                <div style={{font:"400 16px courier", textAlign:"left"}}>
                  {chosen[0]}/{chosen[1]}<p/>
                  Mario<p/>
                  {chosen[0]}/{chosen[1]}<p/>
                </div>

              </div>
            </div>
          ])
        })}
      </div>

    )
  }
}

function optionProps(value, selected) {
  // const value = `${eventListNum}.${chosen[0]}.${name}`;

  return {
    key:  value,
    value,
    // selected
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
