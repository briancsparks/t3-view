
import React                  from 'react';

import {
  Tabs, Tab
}                             from 'react-bootstrap';
import {
  IpAcrossTimeComponent
}                             from '../Containers/IpAcrossTimeContainer';

import '../short.css';

export class TopTabs extends React.Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div>
        <Tabs id="top-tabs">
          <Tab eventKey={1} title="Scratch">
            A tab

            <IpAcrossTimeComponent></IpAcrossTimeComponent>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default TopTabs;



