import React from 'react';
import styled from 'styled-components';

const CategoriesSection = () => (
  <Container>
    <CategoryLinkContainer>
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Dresses</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer>
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Shirts</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer>
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Pants</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer>
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Capes</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer>
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Dresses</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer>
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Shirts</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer>
      <img src="http://via.placeholder.com/150x150" alt="" />
      <p>Pants</p>
    </CategoryLinkContainer>
    <CategoryLinkContainer>
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

const CategoryLinkContainer = styled.div`
  width: 25%;
  text-align: center;
`;
