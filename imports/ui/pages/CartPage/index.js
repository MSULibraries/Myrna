import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container } from "react-grid-system";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import { createContainer } from "meteor/react-meteor-data";

import { Cart } from "./../../../api/cart";

const darkerTableHeaders = {
  color: "#575757"
};

class CartPage extends Component {
  render() {
    return (
      <Container>
        <h1>Cart</h1>

        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={darkerTableHeaders}>
                Product ID
              </TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>
                User ID
              </TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>
                Added On{" "}
              </TableHeaderColumn>

              <TableHeaderColumn style={darkerTableHeaders}>
                Remove
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.cartItems.map(item => {
              return (
                <TableRow key={item._id}>
                  <TableRowColumn>{item.productId}</TableRowColumn>
                  <TableRowColumn>{item.userId}</TableRowColumn>
                  <TableRowColumn>{item.dateAdded}</TableRowColumn>
                  <TableRowColumn>
                    <button>Delete</button>
                  </TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Container>
    );
  }
}

CartPage.defaultProps = {
  cartItems: []
};

CartPage.proptypes = {
  cartItems: PropTypes.array
};

export default (CartPage = createContainer(() => {
  Meteor.subscribe("cart");
  return {
    cartItems: Cart.find({}).fetch()
  };
}, CartPage));
