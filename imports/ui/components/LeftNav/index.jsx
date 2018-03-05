import { List, ListItem } from 'material-ui/List';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { isMaintainer } from './../../../../lib/roles';

const LeftNav = ({ isMaintainer }) => (
  <List>
    <Link style={LinkStyle} to="/addresses">
      <LinkText primaryText="Addresses" />
    </Link>

    <Link style={LinkStyle} to="/orders">
      <LinkText primaryText="Orders" />
    </Link>

    <Link style={LinkStyle} to="/cart">
      <LinkText primaryText="Cart" />
    </Link>

    {isMaintainer() && (
      <Link style={LinkStyle} to="/user/new">
        <LinkText primaryText="New User" />
      </Link>
    )}
  </List>
);

const LinkStyle = {
  textDecoration: 'none',
};

const LinkText = styled(ListItem)`
  background-color: ${props =>
    (window.location.href.includes(props.to) ? 'gainsboro' : 'auto')} !important;
`;

export default withTracker(() => ({
  isMaintainer,
}))(LeftNav);
