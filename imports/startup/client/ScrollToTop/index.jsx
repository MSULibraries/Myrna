import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class ScrollToTop extends Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.arrayOf(React.PropTypes.node), PropTypes.node]),
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return <div> {this.props.children}</div>;
  }
}

export default withRouter(ScrollToTop);
