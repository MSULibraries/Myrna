/*
 *
 * Policies
 *
 */

import { List, ListItem } from 'material-ui/List';
import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-grid-system';
import Helmet from 'react-helmet';
import LeftNav from '../../components/LeftNav/LeftNav';

export class ProfilePage extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      itemsInCart: 0,
    };
  }

  componentDidMount() {
    Meteor.call('cart.count', undefined, (error, itemsInCart) => {
      this.setState({ itemsInCart });
    });
  }

  render() {
    return (
      <Container>
        <Helmet
          title="Profile"
          meta={[
            {
              name: 'description',
              content: 'Profile page for checking on cart, orders, or addresses',
            },
          ]}
        />
        <h1>Profile</h1>
        <Row>
          <Col sm={3}>
            <LeftNav />
          </Col>
          <Col sm={8}>
            <h2>Summary</h2>
            <p>
              <strong>Items in Cart:</strong> {this.state.itemsInCart}{' '}
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProfilePage;
