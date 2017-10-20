import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const BreadCrumbs = ({ crumbs }) => (
  <div>
    {crumbs.map((crumb, index, crumbs) => (
      <span key={crumb}>
        {/* If it is not the current page add link and '>' */}
        {index !== crumbs.length - 1 ? (
          <Link style={{ textDecoration: 'none' }} to={crumb.toLowerCase()}>
            {crumb.replace('/', '')}
          </Link>
        ) : (
          crumb.replace('/', '')
        )}
        {index !== crumbs.length - 1 && ' > '}
      </span>
    ))}
  </div>
);

BreadCrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BreadCrumbs;
