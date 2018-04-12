import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import CrudForm from './../CrudForm';
import ItemDesc from './../../../../../api/ItemDesc/index';

class UpdateItem extends Component {
  handleSubmit = e => {
    console.log(e);
  };

  render() {
    return (
      <div>
        <h1>Update Item </h1>
        {this.props.product && (
          <CrudForm
            description={this.props.product.shortDescription}
            measurements={JSON.parse(this.props.product.description).Measurements}
            quality={this.props.product.quality}
            handleSubmit={this.handleSubmit}
          />
        )}
      </div>
    );
  }
}

export default withTracker(({ match: { params: { productId } } }) => {
  Meteor.subscribe('itemDesc');
  return {
    product: ItemDesc.findOne({
      _id: productId,
    }),
  };
})(UpdateItem);
