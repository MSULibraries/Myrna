/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import insertOrderCost from './../../../../api/order/bridges/orderCost/methods/insertOrderCost/index';
import insertParcelDimensions from './../../../../api/order/bridges/orderParcelDimensions/methods/insertParcelDimensions/index';

import { OrdersPage } from './../index';

configure({ adapter: new Adapter() });

describe('<OrdersPage/>', () => {
  const mockProps = { crumbs: ['a', 'b'] };
  it('should render', () => {
    const component = shallow(<OrdersPage />);
    assert(component);
  });

  describe('approveOrder()', () => {
    let insertOrderCostStub;
    let orderApproveStub;
    let orderId;

    beforeEach(() => {
      insertOrderCostStub = sinon.stub(insertOrderCost, 'call');
      insertParcelDimensionsStub = sinon.stub(insertParcelDimensions, 'call');
      orderApproveStub = sinon.stub(Meteor, 'call');
      orderId = Random.id();
    });

    afterEach(() => {
      insertOrderCostStub.restore();
      insertParcelDimensionsStub.restore();
      orderApproveStub.restore();
    });

    it('calls insertOrderCost', () => {
      const wrapper = shallow(<OrdersPage />);
      wrapper.instance().approveOrder();

      assert.isTrue(insertOrderCostStub.called);
    });
    it('calls order.approve', () => {
      const wrapper = shallow(<OrdersPage />);
      wrapper.instance().approveOrder();

      assert.isTrue(orderApproveStub.calledWith('order.approve'));
    });
    it('calls insertParcelDimensions with dimensions from state', () => {
      const wrapper = shallow(<OrdersPage />);

      const packageHeight = 10;
      const packageLength = 10;
      const packageWeight = 10;
      const packageWidth = 10;

      const state = {
        orderId,
        packageHeight,
        packageLength,
        packageWeight,
        packageWidth,
      };

      // Renaming
      const {
        packageHeight: height,
        packageLength: length,
        packageWeight: weight,
        packageWidth: width,
      } = state;

      wrapper.setState(state);
      wrapper.instance().approveOrder();

      assert.isTrue(insertParcelDimensionsStub.calledWith({
        orderId,
        height,
        length,
        weight,
        width,
      }));
    });
  });
});
