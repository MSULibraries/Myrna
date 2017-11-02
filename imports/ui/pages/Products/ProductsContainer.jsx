import findIndex from 'lodash/findIndex';
import Paper from 'material-ui/Paper';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import Helmet from 'react-helmet';
import StackGrid, { transitions } from 'react-stack-grid';
import styled from 'styled-components';

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
    this.getCurrentItems = this.getCurrentItems.bind(this);
    this.paginateBackwards = this.paginateBackwards.bind(this);
    this.paginateForwards = this.paginateForwards.bind(this);
  }

  componentDidMount() {
    this.getCurrentItems();
    // this.setState({ paginationOffset: this.state.paginationOffset + this.state.itemsPerPage });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.paginationOffset != prevState.paginationOffset) {
      this.getCurrentItems();
    }
  }

  getCurrentItems() {
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
  paginateBackwards() {
    if (this.state.paginationOffset > 0) {
      this.setState({ paginationOffset: this.state.paginationOffset - this.state.itemsPerPage });
    }
  }
  paginateForwards() {
    if (this.state.paginationOffset >= 0) {
      this.setState({ paginationOffset: this.state.paginationOffset + this.state.itemsPerPage });
    }
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
        <Row>
          <SideNav lg={2}>
            <Paper zDepth={3}>
              <h3>Search</h3>
              <button
                disabled={this.state.paginationOffset === 0}
                onClick={() => {
                  this.paginateBackwards();
                }}
              >
                {'<'}
              </button>
              <button
                disabled={this.state.currentProducts.length === 0}
                onClick={() => {
                  this.paginateForwards();
                }}
              >
                {'>'}
              </button>
            </Paper>
          </SideNav>
          <Col lg={10}>
            {/* <StackGrid
              columnWidth={200}
              duration={0}
              gutterWidth={20}
              gutterHeight={20}
              monitorImagesLoaded
              appear={fadeUp.appear}
              width="100%"
            > */}
            {this.state.currentProducts.length <= this.state.itemsPerPage ? (
              this.state.currentProducts.map(clothing => (
                <ProductCard
                  addProductToCart={this.addProductToCart}
                  isAuthed={Meteor.userId() !== null}
                  key={clothing._id}
                  {...clothing}
                />
              ))
            ) : (
              <p>No more product</p>
            )}
            {/* </StackGrid> */}
          </Col>
        </Row>
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

const SideNav = styled(Col)`
  padding: 10px;
  position: sticky !important;
  top: 10px;
`;
