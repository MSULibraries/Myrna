import React from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';

import CategoriesSection from './CategoriesSection';
import HeroSection from './HeroSection';
import Search from './Search';
import TriInfo from './TriInfo';

export const HomePage = () => (
  <div>
    <Helmet
      title="Welcome"
      meta={[
        {
          name: 'description',
          content: 'Welcome page for the Myrna Colley-Lee rental site',
        },
      ]}
    />
    <Container>
      <h1>Welcome</h1>
    </Container>

    <HeroSection />

    <Container>
      <Search />
    </Container>

    <Container>
      <h2>Search By Category</h2>
      <CategoriesSection />
    </Container>
  </div>
);

export default HomePage;
