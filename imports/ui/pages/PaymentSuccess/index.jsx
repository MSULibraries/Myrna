import { withTracker } from 'meteor/react-meteor-data';
import { parse } from 'query-string';
import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Loader from './../../components/Loader';

export class PaymentSuccess extends Component {
  constructor() {
    super();

    this.state = {
      urlParams: parse(location.search),
      isValidOrder: false,
      validationLoaded: false,
    };
  }

  componentWillMount() {
    const { urlParams: { transactionTotalAmount: amountDue } } = this.state;
    const { urlParams: { timestamp } } = this.state;
    const { urlParams: { orderNumber } } = this.state;
    const { urlParams: { hash } } = this.state;

    Meteor.call('order.check', orderNumber, timestamp, hash, (error, isValidOrder) => {
      this.setState({ validationLoaded: true });
      if (!error) {
        this.setState({ isValidOrder });
      }
    });
  }

  render() {
    return (
      <Container>
        {this.state.validationLoaded ? (
          <div>
            <Helmet
              title="Success | Payment"
              meta={[
                {
                  name: 'description',
                  content: 'Payment Success Page',
                },
              ]}
            />
            <h1>Payment {this.state.isValidOrder ? 'Success' : 'Failure'}</h1>
          </div>
        ) : (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        )}
      </Container>
    );
  }
}

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 7vh;
`;

export default PaymentSuccess;
