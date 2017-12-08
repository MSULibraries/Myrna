import React from 'react';
import styled from 'styled-components';

const TriInfo = () => (
  <Container>
    <div>Learn </div>
    <div> Policies</div>
    <div> Collectoin</div>
  </Container>
);

export default TriInfo;

const Container = styled.div`
  background-color: #9e52c7;
  color: white;
  display: flex;
  height: 175px;
  justify-content: space-around;
  flex-direction: row;
`;
