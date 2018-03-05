import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';
import { Redirect } from 'react-router-dom';

import AccountsUIWrapper from './../../components/AccountsUIWrapper/index';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {
  state = {
    redirectToReferrer: false,
  };

  redirectBack = () => {
    this.setState({ redirectToReferrer: true });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/home' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <Container>
        <Helmet
          title="Login Page"
          meta={[
            {
              name: 'description',
              content: 'Login Page',
            },
          ]}
        />
        <h1>Login Page</h1>
        {this.props.user && Meteor.userId() ? (
          <div>
            <p>Currently Signed in as: {this.props.user.emails[0].address}</p>
            <RaisedButton label="logout" onClick={() => Meteor.logout()} />
          </div>
        ) : (
          <LoginForm />
        )}
        <br />
        <FlatButton onClick={this.redirectBack} label={`Go Back to ${from.pathname}`} />
      </Container>
    );
  }
}

export default withTracker(() => ({
  user: Meteor.user(),
}))(LoginPage);
