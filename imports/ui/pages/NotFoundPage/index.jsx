// components/NotFound.js
import React from "react";
import { Container } from "react-grid-system";

import Cart from "./../../../api/cart";

const NotFound = () => (
  <Container>
    <h3>404 page not found</h3>
    <p>We are sorry but the page you are looking for does not exist.</p>
  </Container>
);

export default NotFound;
