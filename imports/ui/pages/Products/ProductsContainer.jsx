import findIndex from "lodash/findIndex";
import CircularProgress from "material-ui/CircularProgress";
import { createContainer } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Container } from "react-grid-system";
import StackGrid from "react-stack-grid";
import ProductCard from "./../../components/ProductCard/";

import { Cart } from "./../../../api/cart";
import { Dresses } from "./../../../api/dresses";
import { ItemDesc } from "./../../../api/itemDesc";

class ProductsContainer extends Component {
  constructor() {
    super();
    this.state = { clothing: [] };
    this.addProductToCart = this.addProductToCart.bind(this);
    this.getAllProductInfo = this.getAllProductInfo.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.dresses !== prevProps.dresses) {
      this.setState({ clothing: this.props.dresses });
    }
  }

  addProductToCart({ _str: id }) {
    console.log("id: " + id);
    Meteor.call("cart.insert", id);    
  }

  getAllProductInfo(item) {
    const itemDescIndex = findIndex(this.props.itemDesc, { oldId: item.oldId });
    const itemDesc = this.props.itemDesc[itemDescIndex];
    return { ...item, ...itemDesc };
  }

  render() {
    return (
      <Container>
        <h1>Products Container</h1>
        <StackGrid
          columnWidth={200}
          gutterWidth={20}
          gutterHeight={20}
          monitorImagesLoaded
          width={"100%"}
        >
          {this.state.clothing.slice(0, 19).map(clothing => {
            const product = this.getAllProductInfo(clothing);
            return (
              <ProductCard
                addProductToCart={this.addProductToCart}
                isAuthed={Meteor.user()}
                {...product}
                key={clothing._id}
              />
            );
          })}
        </StackGrid>
      </Container>
    );
  }
}

ProductsContainer.defaultProps = {
  dresses: [],
  itemDesc: {}
};

ProductsContainer.proptypes = {
  dresses: PropTypes.array,
  itemDesc: PropTypes.object
};

export default (ProductsContainer = createContainer(() => {
  Meteor.subscribe("dresses");
  Meteor.subscribe("itemDesc");
  Meteor.subscribe("cart");

  return {
    cart: Dresses.find({ customerId: Meteor.userId() }).fetch(),
    dresses: Dresses.find().fetch(),
    itemDesc: ItemDesc.find({ category: "Dress" }).fetch()
  };
}, ProductsContainer));
