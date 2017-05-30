/* @noflow */
import React from 'react';
import {shallow} from 'enzyme';
import Switch from '../';
import Route from '../../Route';
import RouteRenderer from '../../RouteRenderer';


describe('<Switch />', () => {
    it('should render a <RouteRenderer />', () => {
        const wrapper = shallow(
            <Switch>
                <Route prop1="test" />
                <Route prop2="test2" />
            </Switch>
        );
        expect(wrapper.node.type).toBe(RouteRenderer);
        expect(wrapper.node.props).toEqual({
            routes: [
                {prop1: 'test'},
                {prop2: 'test2'}
            ]
        });
    });

    it('should complain about invalid children', () => {
        expect(() => {
            shallow(
                <Switch>
                    <div />
                </Switch>
            );
        }).toThrow("Switch should only have <Route> components as children - received div instead");
    });
});
