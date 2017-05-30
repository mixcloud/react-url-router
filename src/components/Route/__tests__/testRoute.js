/* @noflow */
import React from 'react';
import {shallow} from 'enzyme';
import Route from '../../Route';
import RouteRenderer from '../../RouteRenderer';


describe('<Route />', () => {
    it('should render a <RouteRenderer />', () => {
        const wrapper = shallow(
            <Route prop1="test" />
        );
        expect(wrapper.node.type).toBe(RouteRenderer);
        expect(wrapper.node.props).toEqual({
            routes: [
                {prop1: 'test'}
            ]
        });
    });
});
