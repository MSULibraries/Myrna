import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import Helmet from 'react-helmet';
import StackGrid, { transitions } from 'react-stack-grid';
import styled from 'styled-components';
import { parse } from 'query-string';
import ProductCard from './../../components/ProductCard/index';
import Cart from './../../../api/cart';
import Dress from './../../../api/dresses';
import ItemDesc from './../../../api/itemDesc';

const { fadeUp } = transitions;

class ProductsContainer extends Component {
  constructor() {
    super();

    this.defaultState = {
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
      currentProducts: [],
      itemsPerPage: 20,
      loading: false,
      paginationOffset: 0,
      searchQuery: '',
      urlParams: parse(location.search),
    };

    this.state = this.defaultState;

    this.addProductToCart = this.addProductToCart.bind(this);
    this.capFirstLetter = this.capFirstLetter.bind(this);
    this.checkUrlParams = this.checkUrlParams.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.getCurrentItems = this.getCurrentItems.bind(this);
    this.paginateBackwards = this.paginateBackwards.bind(this);
    this.paginateForwards = this.paginateForwards.bind(this);
    this.renderCategoryFilters = this.renderCategoryFilters.bind(this);
  }

  componentDidMount() {
    this.checkUrlParams();
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
   * Parses the url search string and updates state
   * so that one could link to page with filters or searches
   * already made
   */
  checkUrlParams() {
    if (this.state.urlParams.searchQuery) {
      this.setState({ searchQuery: this.state.urlParams.searchQuery });
    }

    if (this.state.urlParams.paginationOffset) {
      this.setState({ paginationOffset: +this.state.urlParams.paginationOffset });
    }

    if (this.state.urlParams.activeFilters) {
      this.setState({ activeFilters: this.state.urlParams.activeFilters });
    }
  }

  clearFilters() {
    this.setState(this.defaultState);
    this.getCurrentItems();
  }

  /**
   * Fetches product based on the components state
   * such as offset, filters, and search query
   */
  getCurrentItems() {
    this.setState({ loading: true });
    const { activeFilters } = this.state;

    /**
       * The data for the collection is from a legacy project
       * All the categories start  with a capital letter
       * @example: 'dress' would be 'Dress' in the category field
       */
    const activeFiltersArray = Object.keys(activeFilters)
      .filter(category => activeFilters[category] === true)
      .map(category => this.capFirstLetter(category));

    Meteor.call(
      'itemDesc.paginate',
      this.state.paginationOffset,
      this.state.itemsPerPage,
      activeFiltersArray,
      this.state.searchQuery,
      (err, currentProducts) => {
        this.setState({ currentProducts, loading: false });
      },
    );
  }

  handleNewSearch(searchQuery) {
    this.setState({ searchQuery });
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

  renderCategoryFilters() {
    return Object.keys(this.state.activeFilters).map(category => (
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
    ));
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
            <div style={{ padding: '20px' }}>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  this.getCurrentItems();
                }}
              >
                <TextField
                  onChange={({ target: { value: newQuery } }) => this.handleNewSearch(newQuery)}
                  hintText="Search"
                  style={{ width: '100%', marginBottom: '10px' }}
                  value={this.state.searchQuery}
                />
                <br />
              </form>
              {this.renderCategoryFilters()}

              <RaisedButton
                label="RESET"
                onClick={() => {
                  this.clearFilters();
                }}
              />

              <div>
                <RaisedButton
                  disabled={this.state.paginationOffset === 0}
                  fullWidth
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
            </div>
            {this.state.loading && <p>Loading</p>}
          </SideNav>
          <Col lg={10}>
            <StackGrid
              columnWidth={200}
              duration={0}
              gutterWidth={20}
              gutterHeight={20}
              monitorImagesLoaded
              appear={fadeUp.appear}
              width="100%"
            >
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
            </StackGrid>
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
  position: sticky !important;
  top: 10px;
`;
