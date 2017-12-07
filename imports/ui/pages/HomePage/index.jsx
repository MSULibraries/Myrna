import React from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';

import HeroSection from './HeroSection';

export const HomePage = () => (
  <div>
    <Helmet
      title="Welcome"
      meta={[
        {
          name: 'description',
          content: 'Welcome page for the Myrna Colley Lee rental site',
        },
      ]}
    />
    <Container>
      <h1>Welcome</h1>
    </Container>

    <HeroSection />
  </div>
);

export default HomePage;
