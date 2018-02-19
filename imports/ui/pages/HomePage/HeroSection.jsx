import React from 'react';
import { media } from './../../breakpoints';
import styled from 'styled-components';

const HeroSection = () => (
  <HeroContainer>
    <HeroImageContainer>
      <HeroImage src="images/hero.png" alt="Man with spear looks as person dressed as ram." />
      <HeroRightImage>
        <a
          className="twitter-timeline"
          data-width="400"
          data-height="300"
          data-theme="light"
          href="https://twitter.com/TheatreMSU?ref_src=twsrc%5Etfw"
        >
          Tweets by TheatreMSU
        </a>{' '}
      </HeroRightImage>
    </HeroImageContainer>
  </HeroContainer>
);

const HeroImageContainer = styled.div`
  ${media.desktop`
`};

  background-color: #7b4a82;
  display: flex;
  flex-direction: row;
  justify-content: center;

  padding: 1%;
`;

const HeroContainer = styled.div`
  background-color: #99729e;
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

const HeroRightImage = styled.div`
  ${media.giant`
  display: none;
`};
  display: flex;
  height: 100%;
  width: 100%;
`;

export default HeroSection;
