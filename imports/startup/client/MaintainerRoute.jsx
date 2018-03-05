/**
 * Creates a React Router route that only 'Maintainers' can visit
 */

import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isMaintainer } from './../../../lib/roles';

export const MaintainerRoute = ({ component: Component, ...rest }) =>
  isMaintainer !== undefined && (
    <Route
      {...rest}
      render={props =>
        (isMaintainer() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/restricted',
              state: { from: props.location },
            }}
          />
        ))
      }
    />
  );

export default withTracker(() => ({
  isMaintainer,
}))(MaintainerRoute);
