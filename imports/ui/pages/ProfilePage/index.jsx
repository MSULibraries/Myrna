/*
 *
 * Policies
 *
 */

import { List, ListItem } from 'material-ui/List';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';

export class ProfilePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
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
      </Container>
    );
  }
}

export default ProfilePage;
