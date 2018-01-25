import React from 'react';
import styled from 'styled-components';

const CartIcon = ({ src, alt }) => <StyledImg src={src} alt={alt} />;

const StyledImg = styled.img`
  border-radius: 50%;
`;

export default CartIcon;
