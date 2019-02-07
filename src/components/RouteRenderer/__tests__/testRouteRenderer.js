/* @noflow */
import React from 'react';
import RouteRenderer from '../';
import {mount} from 'enzyme';
import Urls from '../../../urls';
import RouteContext from '../../RouteContext';


const urls = new Urls({'home': '/', 'user:profile': '/u/:username/'});
const context = {
    router: {
        history: {},
        location: {},
        urls,
        listen: () => () => {},
        linkMiddleware: [],
        navigate: () => {}
    }
};

const TestComponent = () => null;
const TestComponent2 = () => null;


describe('<RouteRenderer>', () => {
    it('should render a component', () => {
        const wrapper = mount(
            <RouteRenderer
                location={{pathname: '/'}}
                routes={[
                    {urlName: 'user:profile', render: () => <TestComponent2 />, exact: true, strict: true},
                    {urlName: 'home', component: TestComponent, exact: true, strict: true}
                ]}
            />,
            {context}
        );
        expect(wrapper.find(TestComponent).length).toEqual(1);
    });

    it('should render with a render function', () => {
        const wrapper = mount(
            <RouteRenderer
                location={{pathname: '/'}}
                routes={[
                    {urlName: 'home', render: () => <TestComponent />, exact: true, strict: true}
                ]}
            />,
            {context}
        );
        expect(wrapper.find(TestComponent).length).toEqual(1);
    });

    it('should render null on no match', () => {
        const wrapper = mount(
            <RouteRenderer
                location={{pathname: '/'}}
                routes={[
                    {urlName: 'user:profile', render: () => <TestComponent />, exact: true, strict: true}
                ]}
            />,
            {context}
        );
        expect(wrapper.find(TestComponent).length).toEqual(0);
        expect(wrapper.find(RouteContext).length).toEqual(0);
    });

    it('should render non-exact routes', () => {
        const wrapper = mount(
            <RouteRenderer
                location={{pathname: '/u/x/'}}
                routes={[
                    {urlName: 'home', component: TestComponent, exact: false, strict: true}
                ]}
            />,
            {context}
        );
        expect(wrapper.find(TestComponent).length).toEqual(1);
    });

    it('should render just the first match', () => {
        const wrapper = mount(
            <RouteRenderer
                location={{pathname: '/u/x/'}}
                routes={[
                    {urlName: 'home', component: TestComponent, exact: false, strict: true},
                    {urlName: 'user:profile', render: () => <TestComponent2 />, exact: true, strict: true}
                ]}
            />,
            {context}
        );
        expect(wrapper.find(TestComponent).length).toEqual(1);
        expect(wrapper.find(TestComponent2).length).toEqual(0);
    });

    it('should match a blank urlName every time', () => {
        var wrapper = mount(
            <RouteRenderer
                location={{pathname: '/u/x/'}}
                routes={[
                    {urlName: 'home', component: TestComponent, exact: true, strict: true},
                    {render: () => <TestComponent2 />}
                ]}
            />,
            {context}
        );
        expect(wrapper.find(TestComponent).length).toEqual(0);
        expect(wrapper.find(TestComponent2).length).toEqual(1);

        wrapper = mount(
            <RouteRenderer
                location={{pathname: '/u/x/'}}
                routes={[
                    {render: () => <TestComponent2 />},
                    {urlName: 'home', component: TestComponent, exact: true, strict: true}
                ]}
            />,
            {context}
        );
        expect(wrapper.find(TestComponent).length).toEqual(0);
        expect(wrapper.find(TestComponent2).length).toEqual(1);
    });

    it('should set serverResult.hasMatched', () => {});

    it('should wrap in a match in a <RouteContext>', () => {
        const wrapper = mount(
            <RouteRenderer
                location={{pathname: '/'}}
                routes={[
                    {urlName: 'home', render: () => <TestComponent />, exact: true, strict: true}
                ]}
            />,
            {context}
        );
        expect(wrapper.find(RouteContext).length).toEqual(1);
    });

    it('should call onNavigate upon render', () => {
        const onNavigate = jest.fn();
        const location = {pathname: '/'};
        const wrapper = mount(
            <RouteRenderer
                location={location}
                routes={[
                    {urlName: 'home', component: TestComponent, exact: true, strict: true}
                ]}
                onNavigate={onNavigate}
            />,
            {context}
        );
        expect(onNavigate).toHaveBeenCalledWith({location, match: {urlName: 'home', params: {}}})
    });
});
