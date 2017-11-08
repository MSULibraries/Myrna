/**
 * Can be supplied an array of address and will display them
 */

import { List, ListItem } from 'material-ui/List';
import PropTypes from 'prop-types';
import React from 'react';

export const AddressList = ({ addresses }) => (
  <List>
    {addresses.map(address => (
      <ListItem disabled key={address.street1}>
        <p>{address.company}</p>
        <p>{address.name}</p>
        <p>
          {address.street1}
          {address.city}, {address.state} {address.zip}
        </p>
      </ListItem>
    ))}
  </List>
);

AddressList.proptypes = {
  addresses: PropTypes.array.isRequired,
};

export default AddressList;
