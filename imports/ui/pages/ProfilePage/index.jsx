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
          title="Policies"
          meta={[{ name: 'description', content: 'Description of Policies' }]}
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
