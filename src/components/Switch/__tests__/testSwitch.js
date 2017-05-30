/* @noflow */
import React from 'react';
import {shallow, mount} from 'enzyme';
import Switch from '../';
import Route from '../../Route';
import Router from '../../Router';
import RouteRenderer from '../../RouteRenderer';
import Urls from '../../../urls';


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

    it('should handle falsy children', () => {
        const wrapper = shallow(
            <Switch>
                <Route prop1="test" />
                {false && <Route prop3="test3" />}
                <Route prop2="test2" />
                {null && <Route prop3="test3" />}
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

    it('should allow overriding of location', () => {
        const TestComponent1 = jest.fn(() => null);
        const urls = new Urls({'home': '/', 'user:profile': '/u/:username/'});
        const history = {
            location: {
                pathname: '/u/x/'
            },
            listen: () => () => {}
        };

        mount(
            <Router history={history} urls={urls}>
                <Switch location={{pathname: '/'}}>
                    <Route urlName="home" exact={true} component={TestComponent1} />
                </Switch>
            </Router>
        );

        expect(TestComponent1).toBeCalled();
    });
});
