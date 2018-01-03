import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from './../../breakpoints';

const TriInfo = () => (
  <Container>
    <div>
      <WhiteLink to="/about">
        <img src="http://via.placeholder.com/200x200" alt="" />
        <p>Learn</p>{' '}
      </WhiteLink>
    </div>
    <div>
      <WhiteLink to="/policies">
        <img src="http://via.placeholder.com/200x200" alt="" />
        <p>Policies</p>
      </WhiteLink>
    </div>
    <div>
      <WhiteLink to="/products">
        <img src="http://via.placeholder.com/200x200" alt="" />
        <p>Collection</p>
      </WhiteLink>
    </div>
  </Container>
);

export default TriInfo;

const Container = styled.div`
  ${media.desktop`
    display: none;
  `};

  align-items: center;
  background-color: #9e52c7;
  color: white;
  display: flex;
  flex-direction: row;
  font-weight: bold;
  height: 300px;
  justify-content: space-around;
  margin-bottom: 20px;
  padding-left: 10%;
  padding-right: 10%;
`;
const WhiteLink = styled(Link)`
  color: white;
  text-decoration: none;
  text-align: center;
`;
