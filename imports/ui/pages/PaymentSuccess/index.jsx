import React from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';

const PaymentSuccess = () => (
  <Container>
    <Helmet
      title="Success | Payment"
      meta={[
        {
          name: 'description',
          content: 'Payment Success Page',
        },
      ]}
    />
    <h1>Payment Success</h1>
  </Container>
);

export default PaymentSuccess;
