import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import styled from 'styled-components';

import CartIcon from './components/CartIcon';
import { media } from './../../breakpoints';
import Cart from './../../../api/cart';

// Adjusted contrast to help with a11y
const darkerTableHeaders = {
  color: '#575757',
};

const alignCenter = {
  textAlign: 'center',
};

const centerColumn = {
  display: 'flex',
  alignItems: 'center',
};

class CartTable extends Component {
  /**
   * Removes product from user's cart collection
   */
  removeProductFromCart = id => {
    Meteor.call('cart.remove', id);
  };

  render() {
    return (
      <div>
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={{ ...darkerTableHeaders, width: '50px' }} />
              <MobileHiddenColumn style={darkerTableHeaders}>Id</MobileHiddenColumn>
              <TableHeaderColumn style={darkerTableHeaders}>Status</TableHeaderColumn>
              {/* <TableHeaderColumn style={darkerTableHeaders}>Added On </TableHeaderColumn> */}

              <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                Remove
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.cartItems.map(item => (
              <TableRow key={item._id}>
                <TableRowColumn style={{ width: '50px' }}>
                  <CartIcon src="http://via.placeholder.com/50x50" />
                </TableRowColumn>
                <MobileHiddenColumn>{item._id}</MobileHiddenColumn>
                <TableRowColumn>
                  {this.props.itemsAvailible && this.props.itemsAvailible[item.productId] ? (
                    <span> Availible</span>
                  ) : (
                    <span> Un-Availible</span>
                  )}
                </TableRowColumn>
                {/* <TableRowColumn>
                   {new Date(item.dateAdded).toLocaleDateString('en-US')}
                 </TableRowColumn> */}
                <TableRowColumn style={centerColumn}>
                  <FlatButton
                    onClick={() => this.removeProductFromCart(item._id)}
                    secondary
                    style={{ margin: 'auto' }}
                    label="X"
                  />
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

const MobileHiddenColumn = styled(TableRowColumn)`
  ${media.desktop`display: none !important;`} display: table-cell !important;
`;

export default withTracker(props => {
  Meteor.subscribe('cart');

  return {
    cartItems: Cart.find({}).fetch(),
  };
})(CartTable);
