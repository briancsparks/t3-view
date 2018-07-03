import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import {
  Nav, Navbar, Grid,
  // NavDropdown,
  // MenuItem
}                             from 'react-bootstrap';

import './short.css'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar inverse fluid fixedTop>

          {/* Header and Brand */}
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Netlab Telemetry Viewer</a>
            </Navbar.Brand>

          </Navbar.Header>

          <Navbar.Collapse>

            <Nav>
              {/* <NavDropdown eventKey={1} title="Actions" id="action-dropdown">
                <MenuItem eventKey={1.1} onSelect={onSelectAction}>Show Data Types in Console</MenuItem>
              </NavDropdown> */}

              {/* <ItemList itemType="clients"  itemKeyName="clientId" />
              <ItemList itemType="sessions" itemKeyName="sessionId" /> */}

              <Navbar.Text pullRight>
              Luigi
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

export default hot(module)(App)
