import React from 'react';
import { Container } from 'react-grid-system';

const RestrictedPage = () => (
  <Container>
    <h1>Restricted</h1>
    <p>You do not have access to the page that you were trying to visit</p>
    <p>Maintainer: {Roles.userIsInRole(Meteor.user(), ['maintainers'])}</p>
  </Container>
);

export default RestrictedPage;
