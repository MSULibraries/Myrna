import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

import { Show } from './../../../api/show';

export class PullShowPrompt extends Component {
  constructor() {
    super();

    this.state = { selectedShowId: undefined };
    this.addShowToCart = this.addShowToCart.bind(this);
    this.handleShowChange = this.handleShowChange.bind(this);
  }

  /**
   * Updates currently selected show id in state
   */
  handleShowChange = (event, index, value) => this.setState({ selectedShowId: value });

  /**
   * Clears cart and adds the products from a show
   * to the user's cart
   */
  addShowToCart = showId => {
    // Clearing Cart
    Meteor.call('cart.clear');

    // Pulling show's product
    Meteor.call('show.read', showId, (error, { productIds }) => {
      // Adding show product to cart
      Meteor.call('cart.insert.productIds', productIds);

      // closing modal
      this.props.close();
    });
  };

  render() {
    return (
      <div>
        {this.props.shows.length > 0 ? (
          <div>
            <p>
              <em>This will clear your cart and add in all the products from the chosen show</em>
            </p>
            <SelectField
              floatingLabelText="Shows"
              value={this.state.selectedShowId}
              onChange={this.handleShowChange}
            >
              {this.props.shows.map((show, index) => (
                <MenuItem key={show.name} value={show._id} primaryText={show.name} />
              ))}
            </SelectField>
            <br />
            <FlatButton
              disabled={this.state.selectedShowId === undefined}
              label="Submit"
              onClick={() => this.addShowToCart(this.state.selectedShowId)}
            />
          </div>
        ) : (
          <p> No shows created </p>
        )}
      </div>
    );
  }
}

export default withTracker(props => {
  return {
    shows: Show.find({ ownerId: Meteor.userId() }).fetch(),
  };
})(PullShowPrompt);
