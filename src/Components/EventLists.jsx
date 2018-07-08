
import React, { Component }   from 'react'
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
        {sg.reduce(eventLists.items, [], (m, eventList, eventListNum) => {
          const chosen    = eventList.chosen;

          return ([...m,
            <div className="row" id={eventListNum}>
              <div className="col-md-12">

                <Form inline>

                  {/* {---------- The Source Select ----------} */}
                  <ControlLabel>Source</ControlLabel>
                  <FormControl componentClass="select" placeholder="source" onChange={this.props.onSelected}>
                    {/* <option value={`${eventListNum}.all`}>all</option> */}
                    {renderable(eventList.sources, (x_items, source, sourceNum) => {
                      return ([
                        <option value={`${eventListNum}.${source}`} selected={source===chosen[0]}>{source}</option>
                      ])
                    })}
                  </FormControl>{' '}

                  {/* {---------- The Sub-Collection Select ----------} */}
                  <ControlLabel>Module</ControlLabel>
                  <FormControl componentClass="select" placeholder="module" onChange={this.props.onSelected}>
                    {(chosen[1] !== null) ? null :
                      <option value="choose" selected={true}>choose</option>
                    }
                    {renderable(eventList.sources[chosen[0]], (x_items, name, n) => {
                      return ([
                        <option value={`${eventListNum}.${chosen[0]}.${name}`} selected={name===chosen[1]}>{name}</option>
                      ])
                    })}
                    <option value="all">all</option>
                  </FormControl>{' '}
                  {chosen[0]}/{chosen[1]}

                  {/* {---------- The RegEx Edit ----------} */}
                  <FieldGroup
                    id="re1"
                    type="text"
                    label="RegEx 1"
                    placeholder="/(...)/"
                  />{' '}

                </Form>

              </div>
            </div>
          ])
        })}
      </div>

    )
  }
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
