/* @noflow */
import React from 'react';
import {shallow, mount} from 'enzyme';
import Route from '../';
import Router from '../../Router';
import RouteRenderer from '../../RouteRenderer';
import Urls from '../../../urls';


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
                <Route location={{pathname: '/'}} urlName="home" exact={true} component={TestComponent1} />
            </Router>
        );

        expect(TestComponent1).toBeCalled();
    });
});
