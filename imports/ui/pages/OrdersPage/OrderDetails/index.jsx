import Chip from 'material-ui/Chip';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Loader from './../../../components/Loader/index';
import { Order } from './../../../../api/order/order';
import { getProductsInfo } from './../../../../api/ItemDesc/methods/getProductsInfo/index';
import { isMaintainer } from './../../../../../lib/roles';
import { media } from './../../../breakpoints';

class OrderDetails extends Component {
  constructor() {
    super();

    this.state = {
      expanded: false,
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

  handleExpandChange = (id, expanded) => {
    this.setState({ expanded: { ...this.state.expanded, id: expanded } });
  };

  handleToggle = (event, toggle) => {
    this.setState({ expanded: toggle });
  };

  handleExpand = () => {
    this.setState({ expanded: true });
  };

  handleReduce = () => {
    this.setState({ expanded: false });
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

  renderReviewCart = product => {};

  render() {
    // if (!isMaintainer()) {
    //   return <Redirect to="/restricted" push />;
    // }

    return (
      <Container>
        <h1> Order Details</h1>
        {this.state.orderIdValid && this.state.itemDescLoaded ? (
          <div>
            <p>Order Status: {this.props.order.status}</p>
            <div>
              <CardsWrapper>
                {this.props.order.productIds.map(id => (
                  <CardStyle
                    key={id}
                    expanded={this.state.expanded}
                    onExpandChange={this.handleExpandChange}
                  >
                    <CardHeader
                      title={id}
                      subtitle={this.state.itemDesc[id].shortDescription}
                      avatar={`${document.location.origin}/images/clothing/${this.state.itemDesc[
                        id
                      ].category.toLowerCase()}/${this.state.itemDesc[id].oldId}/small/${JSON.parse(
                        this.state.itemDesc[id].description,
                      ).picture_1}`}
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText>
                      <ChipWrapper>
                        <Chip>Condition: {this.state.itemDesc[id].itemStatus}</Chip>
                        <Chip>Type: {this.state.itemDesc[id].category}</Chip>
                      </ChipWrapper>
                      <Toggle
                        toggled={this.state.expanded}
                        onToggle={this.handleToggle}
                        labelPosition="right"
                        label="Full Image View"
                      />
                    </CardText>
                    <CardMedia expandable={true}>
                      <img
                        src={`${document.location.origin}/images/clothing/${this.state.itemDesc[
                          id
                        ].category.toLowerCase()}/${this.state.itemDesc[id]
                          .oldId}/small/${JSON.parse(this.state.itemDesc[id].description)
                          .picture_1}`}
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
  display: flex;
  flex-wrap: wrap;
`;

const CardStyle = styled(Card)`
  margin: 10px;
  ${media.desktop`width: calc(50% - 3%)`} ${media.tablet`width: 100%`} width: calc(33% - 3%);
`;
