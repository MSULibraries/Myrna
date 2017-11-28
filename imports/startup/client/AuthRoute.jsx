import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const AuthRoute = ({ userLoggedIn = '', component: Component, ...rest }) =>
  userLoggedIn !== '' && (
    <Route
      {...rest}
      render={props =>
        (userLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        ))}
    />
  );

export default AuthRoute;
