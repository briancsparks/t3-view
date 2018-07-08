
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

    // var eventLists = {
    //   items: [{
    //     chosenSource: 'logcat',
    //     sources : {
    //       events : 'mwpUp,sentPacket'.split(','),
    //       logcat : 'WifiStateMachine,WifiConfigManager'.split(','),
    //     },
    //   }, {
    //     chosenSource: 'events',
    //     sources : {
    //       events : 'mwpUp,sentPacket'.split(','),
    //       logcat : 'WifiStateMachine,WifiConfigManager'.split(','),
    //     },
    //   }]
    // };

    const eventLists = this.props.eventLists;

    // function onChange(event) {
    //   alert('foobar'+event.target.value);
    // }

    // const n=1;
    return (

      <div>
        {sg.reduce(eventLists.items, [], (m, eventList, eventListNum) => {
          const chosenSource = eventList.chosen[0];
          var   nameB = '';
          return ([...m,
            <div className="row" id={eventListNum}>
              <div className="col-md-12">

                <Form inline>
                  <ControlLabel>Source</ControlLabel>
                  <FormControl componentClass="select" placeholder="source" onChange={this.props.onSelected}>
                    <option value={`${eventListNum}.all`}>all</option>
                    {renderable(eventList.sources, (m, x_items, source, sourceNum) => {
                      return ([
                        <option value={`${eventListNum}.${source}`} selected={sourceNum===eventListNum}>{source}</option>
                      ])
                    })}
                  </FormControl>{' '}

                  <ControlLabel>Module</ControlLabel>
                  <FormControl componentClass="select" placeholder="module" onChange={this.props.onSelected}>
                    <option value="all">all</option>
                    {renderable(eventList.sources[chosenSource], (m, name, n) => {
                      nameB = nameB || name;
                      var props = {value:`${eventListNum}.${chosenSource}.${name}`, selected: (n===0)};
                      return ([
                        <option {...props}>{name}</option>
                      ])
                    })}
                  </FormControl>{' '}
                  {chosenSource}/{nameB}

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
