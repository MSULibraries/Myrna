import Snackbar from 'material-ui/Snackbar';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export const Toast = (message, closeToast) => (
  <Snackbar open message={message} autoHideDuration={4000} onRequestClose={() => closeToast()} />
);

Toast.prototypes = {
  closeToast: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
};

export default Toast;
