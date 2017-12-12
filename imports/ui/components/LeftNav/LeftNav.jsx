import { List, ListItem } from 'material-ui/List';
import React from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LeftNav = () => (
  <List>
    <Link style={LinkStyle} to="/addresses">
      <LinkText primaryText="Addresses" to="/addresses" />
    </Link>

    <Link style={LinkStyle} to="/orders">
      <LinkText primaryText="Orders" to="/orders" />
    </Link>

    <Link style={LinkStyle} to="/cart">
      <LinkText primaryText="Cart" to="/cart" />
    </Link>
  </List>
);

export default LeftNav;

const LinkStyle = {
  textDecoration: 'none',
};

const LinkText = styled(ListItem)`
  background-color: ${props =>
    (window.location.href.includes(props.to) ? '#9E52C7' : 'auto')} !important;
`;
