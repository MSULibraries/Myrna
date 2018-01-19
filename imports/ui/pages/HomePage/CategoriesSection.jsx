import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from './../../breakpoints';

const CategoriesSection = () => (
  <Container>
    <CategoryLinkContainer to="/products?categories=Dress">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Dresses</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Shirt">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Shirts</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Pants">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Pants</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Cape">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Capes</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Jacket">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Jackets</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Jumpsuit">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Jumpsuits</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Shawl">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Shawls</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Robe">
      <img src="http://via.placeholder.com/150x150" alt="" />
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

const CategoryLinkContainer = styled(Link) `
  ${media.giant`
    width: 25%;
  `};
  ${media.desktop`
    width: 50%;
  `};
  ${media.phone`
    width: 100%;
  `};

  color: black;
  text-align: center;
  text-decoration: none;
  width: 25%;
`;
