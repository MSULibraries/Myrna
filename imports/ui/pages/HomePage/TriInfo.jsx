import React from 'react';
import styled from 'styled-components';

const TriInfo = () => (
  <Container>
    <div>
      <img src="http://via.placeholder.com/200x200" alt="" />
      <p>Learn</p>{' '}
    </div>
    <div>
      <img src="http://via.placeholder.com/200x200" alt="" />
      <p>Policies</p>
    </div>
    <div>
      <img src="http://via.placeholder.com/200x200" alt="" />
      <p>Collection</p>
    </div>
  </Container>
);

export default TriInfo;

const Container = styled.div`
  background-color: #9e52c7;
  color: white;
  display: flex;
  flex-direction: row;
  font-weight: bold;
  height: 240px;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 10px;
  text-align: center;
`;
