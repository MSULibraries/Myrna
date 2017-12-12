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
    console.log(toggle);
    console.log(id);
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
    return (
      <Container>
        <h1> Order Details</h1>
        {this.state.orderIdValid && this.state.itemDescLoaded ? (
          <div>
            <p>Order Status: {this.props.order.status}</p>
            <FlatButton
              disabled={this.props.order.status !== 'Delivered'}
              label="Check In"
              onClick={() => this.checkInOrder(this.props.order._id)}
            />
            <div>
              <CardsWrapper>
                {this.props.order.productIds.map(id => (
                  <CardStyle key={id} expanded={this.state.expanded[id]}>
                    <CardHeader
                      title={id}
                      subtitle={this.state.itemDesc[id].shortDescription}
                      avatar={`${document.location.origin}/images/clothing/${this.state.itemDesc[
                        id
                      ].category.toLowerCase()}/${this.state.itemDesc[id].oldId}/small/${
                        JSON.parse(this.state.itemDesc[id].description).picture_1
                      }`}
                      showExpandableButton
                      onClick={() => this.handleToggle(!this.expanded[id], id)}
                    />
                    <CardText>
                      <ChipWrapper>
                        <Chip>Condition: {this.state.itemDesc[id].itemStatus}</Chip>
                        <Chip>Type: {this.state.itemDesc[id].category}</Chip>
                      </ChipWrapper>
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
                  </CardStyle>
                ))}
              </CardsWrapper>
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
  Meteor.subscribe('orders');
  Meteor.subscribe('itemDesc');

  return {
    order: Order.findOne({ _id: orderId }),
  };
})(OrderDetails);

const ChipWrapper = styled.div`
  display: flex;
  flexwrap: 'wrap';
`;

const CardsWrapper = styled.div`
  // display: flex;
  // flex-wrap: wrap;
`;

const CardStyle = styled(Card)`
  margin: 10px;
  ${media.desktop`width: calc(50% - 3%)`} ${media.tablet`width: 100%`} width: calc(33% - 3%);
`;
