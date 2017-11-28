import { List, ListItem } from 'material-ui/List';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-grid-system';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';

const Button = styled.button`
/* Adapt the colours based on primary prop */
background: ${props => props.primary ? 'palevioletred' : '#9E52C7'};
color: ${props => props.primary ? '#9E52C7' : 'palevioletred'};
padding-right: 237px;
border: 0px;
padding-up: 10%;

`;

const Button2 = styled.button`
/* Adapt the colours based on primary prop */
background: ${props => props.primary ? 'palevioletred' : '#9E52C7'};
color: ${props => props.primary ? '#9E52C7' : 'palevioletred'};
padding-right: 265px;
border: 0px;
padding-up: 10%;

`;

const Button3 = styled.button`
/* Adapt the colours based on primary prop */
background: ${props => props.primary ? 'palevioletred' : '#9E52C7'};
color: ${props => props.primary ? '#9E52C7' : 'palevioletred'};
padding-right: 282px;
border: 0px;
padding-up: 10%;

`;

export class LeftNav extends React.PureComponent {

  render() {
    if (window.location.pathname === "/addresses") {
      return (
        <Col sm={4}>
          <List>
            <Button><Link style={{ textDecoration: 'none' }} to="/addresses">
              <ListItem primaryText="Addresses" />
            </Link></Button>

            <Link style={{ textDecoration: 'none' }} to="/orders">
              <ListItem primaryText="Orders" />
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/cart">
              <ListItem primaryText="Cart" />
            </Link>
          </List>
        </Col>
      );
    }
    else if (window.location.pathname === "/orders") {
      return (
        <Col sm={4}>
          <List>
            <Link style={{ textDecoration: 'none' }} to="/addresses">
              <ListItem primaryText="Addresses" />
            </Link>

            <Button2><Link style={{ textDecoration: 'none' }} to="/orders">
              <ListItem primaryText="Orders" />
            </Link></Button2>

            <Link style={{ textDecoration: 'none' }} to="/cart">
              <ListItem primaryText="Cart" />
            </Link>
          </List>
        </Col>
      );
    }
    else if (window.location.pathname === "/cart") {
      return (
        <Col sm={4}>
          <List>
            <Link style={{ textDecoration: 'none' }} to="/addresses">
              <ListItem primaryText="Addresses" />
            </Link>

            <Link style={{ textDecoration: 'none' }} to="/orders">
              <ListItem primaryText="Orders" />
            </Link>

            <Button3><Link style={{ textDecoration: 'none' }} to="/cart">
              <ListItem primaryText="Cart" />
            </Link></Button3>
          </List>
        </Col>
      );
    }

    else {
      return (
        <Col sm={4}>
          <List>
            <Link style={{ textDecoration: 'none' }} to="/addresses">
              <ListItem primaryText="Addresses" />
            </Link>

            <Link style={{ textDecoration: 'none' }} to="/orders">
              <ListItem primaryText="Orders" />
            </Link>

            <Link style={{ textDecoration: 'none' }} to="/cart">
              <ListItem primaryText="Cart" />
            </Link>
          </List>
        </Col>
      );
    }
  }
}
export default LeftNav;
