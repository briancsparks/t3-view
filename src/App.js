import React, { Component } from 'react';
import {
  Nav, Navbar, Grid,
  // NavDropdown,
  // MenuItem
}                             from 'react-bootstrap';
import {
  ItemList
}                             from './Containers/ItemListContainer';

import './short.css'
import './App.css';

class App extends Component {
  render() {
    const onClick = () => {
      this.props.incrCurrentTestCount();
      // console.log('click');
    }

    return (
      <div className="App">
        <Navbar inverse fluid fixedTop>

          {/* Header and Brand */}
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Luigi {this.props.current.testCount} Telemetry Viewer</a>
            </Navbar.Brand>

          </Navbar.Header>

          <Navbar.Collapse>

            <Nav>
              {/* <NavDropdown eventKey={1} title="Actions" id="action-dropdown">
                <MenuItem eventKey={1.1} onSelect={onSelectAction}>Show Data Types in Console</MenuItem>
              </NavDropdown> */}

              <ItemList itemType="clients"  itemKeyName="clientId" />
              <ItemList itemType="sessions" itemKeyName="sessionId" />

              <Navbar.Text pullRight onClick={onClick}>
                {/* {`${displaySessionId(sessionId)}`} */}
              </Navbar.Text>
            </Nav>

            {/* <Nav pullRight>
              <NetworkActivity />
            </Nav> */}
          </Navbar.Collapse>
        </Navbar>

        {/* Main Content Area */}
        <div>
          <Grid fluid={true}>
            {/* <TopTabs>
            </TopTabs> */}

            Mario

          </Grid>
        </div>

      </div>
    );
  }
}

export default App;
