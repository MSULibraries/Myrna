import React from 'react';
import { media } from './../../breakpoints';
import styled from 'styled-components';

const HeroSection = () => (
  <HeroContainer>
    <HeroImageContainer>
      <HeroImage src="http://via.placeholder.com/750x300" alt="" />
      <HeroRightImage src="http://via.placeholder.com/400x300" alt="" />
    </HeroImageContainer>
  </HeroContainer>
);

const HeroImageContainer = styled.div`
  ${media.desktop`
`};

  background-color: #bca6ca;
  display: flex;
  flex-direction: row;
  justify-content: center;

  padding: 1%;
`;

const HeroContainer = styled.div`
  background-color: #cbbbd6;
  display: flex;
  justify-content: center;
`;

const HeroImage = styled.img`
  ${media.giant`
  margin-right: auto;
`};
  height: 100%;
  margin-right: 2vw;
  width: 100%;
`;

const HeroRightImage = styled.img`
  ${media.giant`
  display: none;
`};
  display: flex;
  height: 100%;
  width: 100%;
`;

export default HeroSection;
