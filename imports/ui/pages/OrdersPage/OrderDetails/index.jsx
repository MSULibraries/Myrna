import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Loader from './../../../components/Loader/index';
import { Order } from './../../../../api/order/order';
import { OrderTrackingId } from './../../../../api/order/bridges/orderTrackingId'
import OrderCost from './../../../../api/order/bridges/orderCost/'
import { checkIn } from './../../../../api/order/methods/checkIn/index';
import { getProductsInfo } from './../../../../api/ItemDesc/methods/getProductsInfo/index';
import { isMaintainer } from './../../../../../lib/roles';
import { media } from './../../../breakpoints';

class OrderDetails extends Component {
  constructor() {
    super();

    this.state = {
      expanded: {},
      itemDesc: {},
      itemDescLoaded: false,
      orderIdValid: false,
    };
  }

  componentDidMount() {
    if (this.props.order !== undefined) {
      this.setState({ orderIdValid: true });
      this.getProductsDesc(this.props.order);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.order !== this.props.order) {
      if (this.props.order !== undefined) {
        this.setState({ orderIdValid: true });
      }
      this.getProductsDesc(this.props.order);
    }
  }

  checkInOrder = orderId => {
    checkIn.call({ orderId });
  };

  handleToggle = (event, toggle, id) => {
    this.setState({ expanded: { ...this.state.expanded, [id]: toggle } });
  };

  getProductsDesc = ({ productIds }) => {
    getProductsInfo.call({ productIds }, (error, result) => {
      let itemDesc = {};
      result.forEach(item => (itemDesc[item._id] = { ...item }));
      this.setState({
        itemDesc,
        itemDescLoaded: true,
      });
    });
  };

  render() {
    let costumeCost = 0;
    let shippingCost = 0;
    let total = 0;
    if (this.props.orderCost && this.props.orderTracking.rate) {
      costumeCost = this.props.orderCost.costumeCost.toFixed(2)
      shippingCost = this.props.orderTracking.rate
      total = parseFloat(costumeCost) + parseFloat(shippingCost)
      total = total.toFixed(2)
    }

    return (
      <Container>
        <h1> Order Details</h1>
        {this.state.orderIdValid && this.state.itemDescLoaded ? (
          <div>
            <p>Status: {this.props.order.status}</p>
            {//Only show the cost of the order if it has a cost
              this.props.order.status !== "Un-Approved" &&
              <div>
                <br />
                <p>Costume Cost: ${costumeCost}</p>
                <p>Shipping Cost: ${shippingCost}</p>
                <p>Total: ${total}</p>
              </div>
            }
            <br />
            <p>Special Instructions: {this.props.order.specialInstr || <em>No Special Instructions</em>}</p>
            <p>Is Pick Up Order: {this.props.order.isPickUp ? "True" : "False"}</p>
            <br />
            <p>
              {// Only show shipping info it the order has any
                this.props.orderTracking && <a href={this.props.orderTracking.labelImageUrl} target="_blank" >Order Label</a>}
            </p>
            <FlatButton
              disabled={this.props.order.status !== 'Delivered'}
              label="Check In"
              onClick={() => this.checkInOrder(this.props.order._id)}
            />
            <div>
              <div>
                {this.props.order.productIds.map(id => (
                  <Card key={id} expanded={this.state.expanded[id]}>
                    <CardHeader
                      title={this.state.itemDesc[id].shortDescription}
                      avatar={`${document.location.origin}/images/clothing/${this.state.itemDesc[
                        id
                      ].category.toLowerCase()}/${this.state.itemDesc[id].oldId}/small/${
                        JSON.parse(this.state.itemDesc[id].description).picture_1
                        }`}
                      showExpandableButton
                      onClick={() => this.handleToggle(!this.expanded[id], id)}
                    />
                    <CardText>
                      <div>
                        <Chip>Condition: {this.state.itemDesc[id].itemStatus}</Chip>
                        <Chip>Type: {this.state.itemDesc[id].category}</Chip>
                      </div>
                    </CardText>
                    <CardMedia expandable={true}>
                      <img
                        src={`${document.location.origin}/images/clothing/${this.state.itemDesc[
                          id
                        ].category.toLowerCase()}/${this.state.itemDesc[id].oldId}/small/${
                          JSON.parse(this.state.itemDesc[id].description).picture_1
                          }`}
                        alt={this.state.itemDesc[id].shortDescription || ''}
                      />
                    </CardMedia>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
            <Loader />
          )}

        {!this.state.orderIdValid && this.state.itemDescLoaded && <p>Invalid Order Id</p>}
      </Container>
    );
  }
}

export default withTracker(({ match: { params: { orderId } } }) => {
  Meteor.subscribe('itemDesc');
  Meteor.subscribe('orders');
  Meteor.subscribe('order.cost');
  Meteor.subscribe('order.trackingId');

  return {
    order: Order.findOne({ _id: orderId }),
    orderTracking: OrderTrackingId.findOne({ orderId }),
    orderCost: OrderCost.findOne({ orderId })
  };
})(OrderDetails);
