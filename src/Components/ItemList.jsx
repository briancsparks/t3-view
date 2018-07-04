
import React                  from 'react';
import {
  NavDropdown,
  MenuItem,
}                             from 'react-bootstrap';

import '../short.css';

export class ItemList extends React.Component {

  render() {

    const { itemType, items, onItemSelected, displayId } = this.props;

    return (
      <NavDropdown
          title={`${itemType} (${items.length})`}
          eventKey={1}
          id={`${itemType}-choice-button`}
      >
      {
        items.map((item, i) => (
          <MenuItem eventKey={i} key={i} onSelect={() => onItemSelected(item)} >{displayId(item)}</MenuItem>
        ))
      }
      </NavDropdown>
    )
  }

}

