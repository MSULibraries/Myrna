import { List, ListItem } from 'material-ui/List';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-grid-system';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';

const LinkText = styled(ListItem) `
background-color:${props => window.location.href.includes(props.to) ? '#9E52C7' : "auto"} !important;

`;




export class LeftNav extends React.PureComponent {

  render() {
    return (
      <Col sm={3}>
        <List>
          <Link style={{ textDecoration: 'none' }} to="/addresses">
            <LinkText primaryText="Addresses" to="/addresses" />
          </Link>

          <Link style={{ textDecoration: 'none' }} to="/orders">
            <LinkText primaryText="Orders" to="/orders" />
          </Link>

          <Link style={{ textDecoration: 'none' }} to="/cart">
            <LinkText primaryText="Cart" to="/cart" />
          </Link>
        </List>
      </Col>
    );
  }
}
export default LeftNav;
