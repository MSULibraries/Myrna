import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from './../../breakpoints';

const CategoriesSection = () => (
  <Container>
    <CategoryLinkContainer to="/products?categories=Dress">
      <p>Dresses</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Shirt">
      <p>Shirts</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Pants">
      <p>Pants</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Cape">
      <p>Capes</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Jacket">
      <p>Jackets</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Jumpsuit">
      <p>Jumpsuits</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Shawl">
      <p>Shawls</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Robe">
      <p>Robe</p>
    </CategoryLinkContainer>
  </Container>
);

export default CategoriesSection;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const CategoryLinkContainer = styled(Link)`
  ${media.giant`
    width: 23%;
  `};
  ${media.desktop`
    width: 40%;
  `};
  ${media.phone`
    width: 40%;
  `};

  color: black;
  margin: 1vw;
  text-align: center;
  text-decoration: none;
  width: 23%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px;
`;
