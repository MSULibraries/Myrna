import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

class CartIcon extends Component {
  constructor() {
    super();

    this.state = {
      imageLoaded: false,
    };
  }

  render() {
    const { src, alt, productId } = this.props;
    return (
      <Link to={`/products/details/${productId}`}>
        <StyledImg src={src} alt={alt} />
      </Link>
    );
  }
}

const StyledImg = styled.img`
  border-radius: 50%;
  box-shadow: 0px 7px 18px 2px rgba(0, 0, 0, 0.75);
  height: 100%;
  width: 100%;
`;

export default CartIcon;
