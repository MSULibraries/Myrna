import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import { Redirect } from 'react-router-dom';

import { Order } from './../../../../api/order/order';
import { getProductsInfo } from './../../../../api/ItemDesc/methods/getProductsInfo/index';
import { isMaintainer } from './../../../../../lib/roles';

class OrdersCheckIn extends Component {
  constructor() {
    super();

    this.state = {
      itemDesc: {},
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.order !== this.props.order) {
      this.getProductsDesc(this.props.order);
    }
  }

  getProductsDesc = ({ productIds }) => {
    getProductsInfo.call({ productIds }, (error, result) => {
      let itemDesc = {};
      result.forEach(item => (itemDesc[item._id] = { ...item }));
      this.setState({
        itemDesc,
      });
    });
  };

  render() {
    // if (!isMaintainer()) {
    //   return <Redirect to="/restricted" push />;
    // }

    return (
      <Container>
        <h1>Check In Order</h1>
        {this.props.order ? (
          <div>
            <p>Order Number: {this.props.match.params.orderId}</p>
            <ul>
              {this.props.order.productIds.map(id => (
                <li key={id}>
                  {id} - {this.state.itemDesc[id] && this.state.itemDesc[id].shortDescription}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Invalid Order Number</p>
        )}
      </Container>
    );
  }
}

export default withTracker(({ match: { params: { orderId } } }) => {
  Meteor.subscribe('orders');
  Meteor.subscribe('itemDesc');

  return {
    order: Order.findOne({ _id: orderId }),
  };
})(OrdersCheckIn);
