// components/NotFound.js
import React from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';

import Cart from './../../../api/cart';

export const NotFound = () => (
  <Container>
    <Helmet
      title="404 Page Not Found"
      meta={[
        {
          name: 'description',
          content: 'Page not found',
        },
      ]}
    />
    <h3>404 page not found</h3>
    <p>We are sorry but the page you are looking for does not exist.</p>
  </Container>
);

export default NotFound;
