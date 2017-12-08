import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from './../../breakpoints';

const CategoriesSection = () => (
  <Container>
    <CategoryLinkContainer to="/products?categories=Dresses">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Dresses</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Shirts">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Shirts</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Pants">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Pants</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Capes">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Capes</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Dresses">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Dresses</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Shirts">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Shirts</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Pants">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Pants</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer to="/products?categories=Capes">
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Capes</p>
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
