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
import ItemDesc from './../../../api/ItemDesc';

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
  justifyContent: 'center',
};

class CartTable extends Component {
  constructor() {
    super();

    this.state = {
      itemDesc: {},
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.itemDesc !== this.props.itemDesc) {
      this.updateItemDescState(this.props.itemDesc);
    }
  }

  /**
   * Removes product from user's cart collection
   */
  removeProductFromCart = id => {
    Meteor.call('cart.remove', id);
  };

  /**
   * Updates the component state of itemDesc
   * takes in an array of products and sets state
   * to an object by productId
   * @param {Array} - newItemDesc
   */
  updateItemDescState = newItemDesc => {
    const itemDescById = {};
    newItemDesc.forEach(item => {
      itemDescById[item._id] = item;
    });
    this.setState({ itemDesc: itemDescById });
  };

  renderItemIcon = id => {
    const item = this.state.itemDesc[id];
    if (item) {
      return (
        <CartIcon
          productId={id}
          src={`images/clothing/${item.category.toLowerCase()}/${item.oldId}/small/${
            JSON.parse(item.description).picture_1
          }`}
          alt={`images/clothing/${item.category}/${item.oldId}/small/${
            JSON.parse(item.description).picture_1
          }`}
        />
      );
    }
  };

  render() {
    return (
      <div>
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={{ ...darkerTableHeaders, height: '80px', width: '80px' }} />
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
                <TableRowColumn style={{ height: '80px', width: '80px', padding: '24px' }}>
                  {this.renderItemIcon(item.productId)}
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

export default withTracker(({ cartItems }) => {
  Meteor.subscribe('cart');
  Meteor.subscribe('itemDesc');
  const cartProductIds = cartItems.map(({ productId }) => productId);

  return {
    cartItems: Cart.find({}).fetch(),
    itemDesc: ItemDesc.find({
      _id: { $in: cartProductIds },
    }).fetch(),
  };
})(CartTable);
