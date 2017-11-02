import findIndex from 'lodash/findIndex';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';
import StackGrid, { transitions } from 'react-stack-grid';
import ProductCard from './../../components/ProductCard/index';

import Cart from './../../../api/cart';
import Dresses from './../../../api/dresses';
import ItemDesc from './../../../api/itemDesc';

const { fadeUp } = transitions;

class ProductsContainer extends Component {
  constructor() {
    super();

    this.state = {
      currentProducts: [],
      itemsPerPage: 20,
      paginationOffset: 0,
    };
    this.addProductToCart = this.addProductToCart.bind(this);
    this.incrementPagination = this.incrementPagination.bind(this);
  }

  incrementPagination() {
    Meteor.call(
      'itemDesc.paginate',
      this.state.paginationOffset,
      this.state.itemsPerPage,
      'Dress',
      (err, currentProducts) => {
        this.setState({ currentProducts });
      },
    );
  }

  addProductToCart({ _str: id }) {
    Meteor.call('cart.insert', id);
  }

  render() {
    return (
      <Container>
        <Helmet
          title="Products"
          meta={[
            {
              name: 'description',
              content: 'Search for various costumes and collections pieces',
            },
          ]}
        />
        <h1>Products</h1>
        <button
          onClick={() => {
            this.incrementPagination();
          }}
        >
          Click
        </button>
        {this.props.itemDesc.length === 20 && (
          <StackGrid
            columnWidth={200}
            duration={0}
            gutterWidth={20}
            gutterHeight={20}
            monitorImagesLoaded
            appear={fadeUp.appear}
            width="100%"
          >
            {this.state.currentProducts.map(clothing => (
              <ProductCard
                addProductToCart={this.addProductToCart}
                isAuthed={Meteor.userId() !== null}
                key={clothing._id}
                {...clothing}
              />
            ))}
          </StackGrid>
        )}
      </Container>
    );
  }
}

ProductsContainer.defaultProps = {
  itemDesc: {},
};

ProductsContainer.proptypes = {
  itemDesc: PropTypes.object,
};

export default (ProductsContainer = createContainer(() => {
  Meteor.subscribe('itemDesc');

  return {
    itemDesc: ItemDesc.find({ category: 'Dress' }, { limit: 20 }).fetch(),
  };
}, ProductsContainer));
