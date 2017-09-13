import React, { Component } from "react";
import findIndex from "lodash/findIndex";
import { createContainer } from "meteor/react-meteor-data";

import { Dresses } from "./../../../api/dresses";
import { ItemDesc } from "./../../../api/itemDesc";

class ProductsContainer extends Component {
  constructor() {
    super();

    this.getItemDesc = this.getItemDesc.bind(this);
  }

  getItemDesc(item) {
    const itemDescIndex = findIndex(this.props.itemDesc, { oldId: item.oldId });
    const itemDesc = this.props.itemDesc[itemDescIndex];
    console.log({ ...item, ...itemDesc });
    return { ...item, ...itemDesc };
  }

  render() {
    return (
      <div>
        <h1>Products Container</h1>
        {this.props.dresses &&
          this.props.dresses.map(dress => {
            const product = this.getItemDesc(dress);
            return <p key={dress._id}>{product.shortDescription}</p>;
          })}
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
