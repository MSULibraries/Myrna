import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from './../../breakpoints';

const TriInfo = () => (
  <Container>
    <WhiteLink to="/about">
      <p>About Myrna Colley Lee</p>{' '}
    </WhiteLink>
    <WhiteLink to="/policies">
      <p>Our Policies</p>
    </WhiteLink>
    <WhiteLink to="/products">
      <p>Costume Collection</p>
    </WhiteLink>
  </Container>
);

export default TriInfo;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  ${media.desktop`
  display: none;
`};

  align-items: center;
  background-color: #9e52c7;
  color: white;
  font-weight: bold;
`;

const WhiteLink = styled(Link)`
  color: white;
  text-decoration: none;
  text-align: center;
`;
