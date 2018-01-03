import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';
import ItemDesc from './../../../api/ItemDesc/index';

class ProductsDetails extends Component {
  componentDidMount() {
    return 0;
  }

  render() {
    return (
      <Container>
        <Helmet
          title="Products Details"
          meta={[
            {
              name: 'description',
              content: 'Specific information about a specific costume.',
            },
          ]}
        />
        <h1>Products Detail</h1>
      </Container>
    );
  }
}

export default withTracker(({ match: { params: { productId } } }) => ({
  product: ItemDesc.findOne({ _id: productId }) || 'Not Found',
}))(ProductsDetails);
