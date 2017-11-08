import React from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';

export const HomePage = () => (
  <Container>
    <Helmet
      title="Welcome"
      meta={[
        {
          name: 'description',
          content: 'Landing page for the Myrna Colley Lee rental site',
        },
      ]}
    />
    <h1>Welcome</h1>
  </Container>
);

export default HomePage;
