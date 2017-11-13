import { List, ListItem } from 'material-ui/List';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-grid-system';
import Helmet from 'react-helmet';

export class LeftNav extends React.PureComponent {
  render() {
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
export default LeftNav;
