/* @noflow */
import React from 'react';
import Link from '../';
import {mount} from 'enzyme';


describe('<Link>', () => {
    var context, push, replace;

    beforeEach(() => {
        push = jest.fn();
        replace = jest.fn();
        context = {
            router: {
                location: {},
                urls: {
                    getForLink({urlName, params, query}) {
                        expect(urlName).toEqual('user:profile');
                        expect(params).toEqual({username: 'x'});
                        expect(query).toEqual({a: 'b'});
                        return {pathname: "/u/x/", search: '?a=b'};
                    },
                    match() {
                        return {};
                    }
                },
                history: {
                    push,
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
        expect(replace).not.toBeCalled();
        expect(push).toBeCalledWith({pathname: "/u/x/", search: "?a=b"}, {statevar: 1});
    });

    it('should replace if instructed', () => {
        const wrapper = mount(
            <Link className="testclass" urlName="user:profile" params={{username: 'x'}} query={{a: 'b'}} state={{statevar: 1}} replace={true} />,
            {context}
        );
        wrapper.simulate('click', {button: 0});
        expect(push).not.toBeCalled();
        expect(replace).toBeCalledWith({pathname: "/u/x/", search: "?a=b"}, {statevar: 1});
    });

    it('should have active styles when appropriate', () => {
        const wrapper = mount(
            <Link activeClassName="another" className="testclass" urlName="user:profile" params={{username: 'x'}} query={{a: 'b'}} />,
            {context}
        );
        const a = wrapper.find('a');
        expect(a.length).toEqual(1);
        expect(a.props()).toEqual({
            children: undefined,
            href: "/u/x/?a=b",
            onClick: jasmine.any(Function),
            className: 'testclass another'
        });
    });
});
