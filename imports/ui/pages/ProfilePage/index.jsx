/*
 *
 * Policies
 *
 */

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
        <ul>
          <li>
            <Link to="/orders">My Orders</Link>
          </li>
          <li>
            <Link to="/cart">My Cart</Link>
          </li>
        </ul>
      </Container>
    );
  }
}

export default ProfilePage;
