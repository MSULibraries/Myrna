import CircularProgress from 'material-ui/CircularProgress';
import React from 'react';
import styled from 'styled-components';

const LoadingIcon = styled(CircularProgress)`
  display: block !important;
  position: static !important;
  margin: auto;
`;

export const Loader = () => <LoadingIcon color="#642F6C" />;

export default Loader;
