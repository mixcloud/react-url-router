/* @noflow */
import React from 'react';
import Link from '../';
import {mount} from 'enzyme';


describe('<Link>', () => {
    var context, navigate, replace;

    beforeEach(() => {
        replace = jest.fn();
        navigate = jest.fn();
        context = {
            router: {
                linkMiddleware: [],
                location: {
                    pathname: '/u/x/'
                },
                urls: {
                    makeLocation({urlName, params, query}) {
                        expect(urlName).toEqual('user:profile');
                        expect(params).toEqual({username: 'x'});
                        expect(query).toEqual({a: 'b'});
                        return {pathname: "/u/x/", search: '?a=b'};
                    },
                    match(pathname, urlName) {
                        expect(urlName).toEqual('user:profile');
                        return {params: {username: pathname.split("/")[2]}};
                    }
                },
                navigate,
                history: {
                    replace,
                    createHref(location) {
                        expect(location).toEqual({pathname: "/u/x/", search: "?a=b"});
                        return "/u/x/?a=b";
                    }
                },
                listen: () => () => {}
            }
        };
    });

    it('should render an anchor', () => {
        const wrapper = mount(
            <Link className="testclass" urlName="user:profile" params={{username: 'x'}} query={{a: 'b'}}>
                <div>Test</div>
            </Link>,
            {context}
        );
        const a = wrapper.find('a');
        expect(a.length).toEqual(1);
        expect(a.props()).toEqual({
            children: <div>Test</div>,
            href: "/u/x/?a=b",
            onClick: jasmine.any(Function),
            className: 'testclass'
        });
    });

    it('should navigate on click', () => {
        const wrapper = mount(
            <Link className="testclass" urlName="user:profile" params={{username: 'x'}} query={{a: 'b'}} state={{statevar: 1}} />,
            {context}
        );
        wrapper.simulate('click', {button: 0});
        expect(navigate).toBeCalledWith(jasmine.objectContaining({urlName: "user:profile", params: {username: 'x'}, query: {a: 'b'}, state: {statevar: 1}}), false);
    });

    it('should replace if instructed', () => {
        const wrapper = mount(
            <Link className="testclass" urlName="user:profile" params={{username: 'x'}} query={{a: 'b'}} state={{statevar: 1}} replace={true} />,
            {context}
        );
        wrapper.simulate('click', {button: 0});
        expect(navigate).toBeCalledWith(jasmine.objectContaining({urlName: "user:profile", params: {username: 'x'}, query: {a: 'b'}, state: {statevar: 1}}), true);
    });

    it('should have active styles when appropriate', () => {
        context.router.location.pathname = '/u/a/';
        let wrapper = mount(
            <Link activeClassName="another" className="testclass" urlName="user:profile" params={{username: 'x'}} query={{a: 'b'}} />,
            {context}
        );
        let a = wrapper.find('a');
        expect(a.length).toEqual(1);
        expect(a.props()).toEqual({
            children: undefined,
            href: "/u/x/?a=b",
            onClick: jasmine.any(Function),
            className: 'testclass'
        });

        context.router.location.pathname = '/u/x/';
        wrapper = mount(
            <Link activeClassName="another" className="testclass" urlName="user:profile" params={{username: 'x'}} query={{a: 'b'}} />,
            {context}
        );
        a = wrapper.find('a');
        expect(a.length).toEqual(1);
        expect(a.props()).toEqual({
            children: undefined,
            href: "/u/x/?a=b",
            onClick: jasmine.any(Function),
            className: 'testclass another'
        });
    });
});
