import React, { Component } from 'react';
import { media } from './../../breakpoints';
import styled from 'styled-components';

class HeroSection extends Component {
  constructor() {
    super();

    this.state = {
      twitterFeedLoading: true,
    };
  }

  componentWillMount() {
    const script = document.createElement('script');

    script.src = 'https://platform.twitter.com/widgets.js';

    document.body.appendChild(script);
  }

  render() {
    return (
      <HeroContainer>
        <HeroImageContainer>
          <HeroImage src="images/hero.png" alt="Man with spear looks as person dressed as ram." />
          <HeroRight id="heroRight">
            <a
              className="twitter-timeline"
              data-width="400"
              data-height="343"
              data-theme="light"
              href="https://twitter.com/TheatreMSU?ref_src=twsrc%5Etfw"
            />
          </HeroRight>
        </HeroImageContainer>
      </HeroContainer>
    );
  }
}

const HeroImageContainer = styled.div`
  ${media.desktop`
`};

  background-color: #7b4a82;
  display: flex;
  flex-direction: row;
  justify-content: center;

  padding: 1vw;
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

const HeroRight = styled.div`
  ${media.giant`
  display: none;
`};
  background-color: white;
  display: flex;
  height: 100%;
  width: 400px;
`;

export default HeroSection;
