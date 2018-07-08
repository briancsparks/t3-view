
import React                  from 'react';

import {
  Tabs, Tab
}                             from 'react-bootstrap';
import {
  IpAcrossTimeComponent
}                             from '../Containers/IpAcrossTimeContainer'
import {
  EventLists
}                             from '../Containers/EventListsContainer'

import '../short.css';

export class TopTabs extends React.Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div>
        <Tabs id="top-tabs">
          <Tab eventKey={2} title="IPs Across Time">
            <IpAcrossTimeComponent></IpAcrossTimeComponent>
          </Tab>
          <Tab eventKey={1} title="Event Lists">
            <EventLists></EventLists>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default TopTabs;



