import React, { Component } from 'react';
import { Col, Container, Row } from 'react-grid-system';

import NewUserForm from './NewUserForm';
import LeftNav from './../../../components/LeftNav/index';

class NewUserPage extends Component {
  render() {
    return (
      <Container>
        <h1>New User</h1>
        <Col sm={3}>
          <LeftNav />
        </Col>
        <Col sm={8}>
          <NewUserForm />
        </Col>
      </Container>
    );
  }
}

export default NewUserPage;
