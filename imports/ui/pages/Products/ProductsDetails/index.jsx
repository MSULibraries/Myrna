import { capitalize, trim } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import ReactImageMagnify from 'react-image-magnify';
import Helmet from 'react-helmet';
import ItemDesc from './../../../../api/ItemDesc/index';
import { linear } from 'react-stack-grid/lib/animations/easings';

import styled from 'styled-components';

class ProductsDetails extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.product !== this.props.product && this.props.product !== undefined) {
      this.parseMeasurments();
    }
  }

  /**
   * The costume measurements are within a description (json)
   * The measuremnts are a string, but each measurment is seperated
   * by a semicolon.
   *
   * This parses the json and breaks up the measurments into an array of strings
   */
  parseMeasurments = () => {
    const { Measurements } = JSON.parse(this.props.product.description);
    const measurements = Measurements.split(';');
    this.setState({ measurements });
  };

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
        {this.props.product && (
          <div>
            <h1>Products Detail</h1>
            <ProductContainer>
              <ProductContainerChild>
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      src: `/images/clothing/${this.props.product.category.toLowerCase()}/${
                        this.props.product.oldId
                      }/large/${JSON.parse(this.props.product.description).picture_1}`,
                      alt: this.props.product.shortDescription,
                      isFluidWidth: true,
                    },
                    largeImage: {
                      src: `/images/clothing/${this.props.product.category.toLowerCase()}/${
                        this.props.product.oldId
                      }/large/${JSON.parse(this.props.product.description).picture_1}`,
                      alt: this.props.product.shortDescription,
                      width: '1500',
                      height: '2000',
                    },
                  }}
                />
              </ProductContainerChild>
              <ProductContainerChild>
                <h2>{this.props.product.shortDescription}</h2>
                <p>Quality: {this.props.product.itemStatus}</p>
                <p>Measurement</p>
                <ul>
                  {this.state.measurements &&
                    this.state.measurements
                      .filter(m => trim(m).length > 0)
                      .map(m => capitalize(m))
                      .map(measurement => <li key={measurement}>{measurement}</li>)}
                </ul>
              </ProductContainerChild>
            </ProductContainer>
          </div>
        )}
      </Container>
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
})(ProductsDetails);

const ProductContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const ProductContainerChild = styled.div`
  width: 50%;
  padding: 2%;
`;
