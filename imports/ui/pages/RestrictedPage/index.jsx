import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-grid-system';

const RestrictedPage = ({ location }) => (
  <Container>
    <h1>Restricted</h1>
    <p>You do not have access to the page that you were trying to visit</p>

    <Link to={location.state.from}>Try Again?</Link>
  </Container>
);

export default RestrictedPage;
