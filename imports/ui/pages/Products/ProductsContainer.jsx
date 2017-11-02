import { remove } from 'lodash';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
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
import Dress from './../../../api/dresses';
import ItemDesc from './../../../api/itemDesc';

const { fadeUp } = transitions;

class ProductsContainer extends Component {
  constructor() {
    super();
    this.state = {
      currentProducts: [],
      activeFilters: {
        apron: false,
        cape: false,
        dancewear: false,
        dress: false,
        jacket: false,
        jumpsuit: false,
        nightwear: false,
        pants: false,
        robe: false,
        shawl: false,
        shirt: false,
        shorts: false,
        skirt: false,
        suit: false,
        sweater: false,
        vest: false,
      },
      itemsPerPage: 20,
      paginationOffset: 0,
    };

    this.addProductToCart = this.addProductToCart.bind(this);
    this.capFirstLetter = this.capFirstLetter.bind(this);
    this.getCurrentItems = this.getCurrentItems.bind(this);
    this.paginateBackwards = this.paginateBackwards.bind(this);
    this.paginateForwards = this.paginateForwards.bind(this);
  }

  componentDidMount() {
    this.getCurrentItems();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      // If the next/prev was clicked
      this.state.paginationOffset != prevState.paginationOffset
    ) {
      this.getCurrentItems();
    }
    if (
      // If there is a new filter
      this.state.activeFilters !== prevState.activeFilters
    ) {
      this.setState({ paginationOffset: 0 });
      this.getCurrentItems();
    }
  }

  /**
   * Adds item to cart in DB
   * @param {String} productId
   */
  addProductToCart({ _str: productId }) {
    Meteor.call('cart.insert', productId);
  }

  /**
   * Capitalizes and returns a word
   * @param {String} word
   */
  capFirstLetter(word) {
    return word[0].toUpperCase() + word.slice(1);
  }

  /**
   * Fetches product based on the components state
   * such as offset, filters, and search query
   */
  getCurrentItems() {
    const { activeFilters } = this.state;
    const activeFiltersArray = Object.keys(activeFilters)
      .filter(f => activeFilters[f] === true)
      .map(key => this.capFirstLetter(key));
    Meteor.call(
      'itemDesc.paginate',
      this.state.paginationOffset,
      this.state.itemsPerPage,
      activeFiltersArray,
      (err, currentProducts) => {
        this.setState({ currentProducts });
      },
    );
  }

  /**
   * Decrements the  pagination offset by current states itemsPerPage
   */
  paginateBackwards() {
    if (this.state.paginationOffset > 0) {
      this.setState({ paginationOffset: this.state.paginationOffset - this.state.itemsPerPage });
    }
  }

  /**
   * Decrements the  pagination offset by current states itemsPerPage
   */
  paginateForwards() {
    if (this.state.paginationOffset >= 0) {
      this.setState({ paginationOffset: this.state.paginationOffset + this.state.itemsPerPage });
    }
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
              {Object.keys(this.state.activeFilters).map(category => (
                <Checkbox
                  checked={this.state.activeFilters[category]}
                  key={category}
                  label={this.capFirstLetter(category)}
                  onCheck={() =>
                    this.setState({
                      activeFilters: {
                        ...this.state.activeFilters,
                        [category]: !this.state.activeFilters[category],
                      },
                    })}
                />
              ))}

              <div>
                <RaisedButton
                  disabled={this.state.paginationOffset === 0}
                  label="<"
                  style={{ display: 'inline' }}
                  onClick={() => {
                    this.paginateBackwards();
                  }}
                />
                <RaisedButton
                  disabled={this.state.currentProducts.length === 0}
                  label=">"
                  style={{ display: 'inline' }}
                  onClick={() => {
                    this.paginateForwards();
                  }}
                />
              </div>
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

export default ProductsContainer;

const SideNav = styled(Col)`
  padding: 10px;
  position: sticky !important;
  top: 10px;
`;
