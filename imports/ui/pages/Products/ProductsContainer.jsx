import React, { Component } from "react";
import findIndex from "lodash/findIndex";
import { createContainer } from "meteor/react-meteor-data";
import StackGrid from "react-stack-grid";
import ProductCard from "./../../components/ProductCard/";

import { Dresses } from "./../../../api/dresses";
import { ItemDesc } from "./../../../api/itemDesc";

class ProductsContainer extends Component {
  constructor() {
    super();

    this.addProductToCart = this.addProductToCart.bind(this);
    this.getItemDesc = this.getItemDesc.bind(this);
  }

  addProductToCart() {
    console.log("asdf");
  }

  getItemDesc(item) {
    const itemDescIndex = findIndex(this.props.itemDesc, { oldId: item.oldId });
    const itemDesc = this.props.itemDesc[itemDescIndex];
    return { ...item, ...itemDesc };
  }

  render() {
    return (
      <div>
        <h1>Products Container</h1>
        <StackGrid
          columnWidth={320}
          gutterWidth={20}
          gutterHeight={20}
          monitorImagesLoaded
          width={"100%"}
        >
          {this.props.dresses &&
            this.props.dresses.slice(0, 19).map(dress => {
              const product = this.getItemDesc(dress);
              return (
                <ProductCard
                  addProductToCart={this.addProductToCart}
                  {...product}
                  key={dress._id}
                />
              );
            })}
        </StackGrid>
      </div>
    );
  }
}

export default (ProductsContainer = createContainer(() => {
  Meteor.subscribe("dresses");
  Meteor.subscribe("itemDesc");
  return {
    dresses: Dresses.find().fetch(),
    itemDesc: ItemDesc.find({ category: "Dress" }).fetch()
  };
}, ProductsContainer));
