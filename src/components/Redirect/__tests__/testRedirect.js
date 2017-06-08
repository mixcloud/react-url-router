/* @noflow */
import React from 'react';
import Redirect from '../';
import {shallow, mount} from 'enzyme';


describe('<Redirect>', () => {
    var context, navigate, serverResult;

    beforeEach(() => {
        serverResult = {};
        navigate = jest.fn();
        context = {
            router: {
                linkMiddleware: [],
                location: {},
                urls: {
                    makeLocation({urlName, params}) {
                        expect(urlName).toEqual('user:profile');
                        expect(params).toEqual({username: 'x'});
                        return {pathname: "/u/x/", search: '?a=b'};
                    },
                    match() {
                        return {};
                    }
                },
                navigate,
                history: {
                    createHref(location) {
                        expect(location).toEqual({pathname: "/u/x/", search: "?a=b"});
                        return "/u/x/?a=b";
                    }
                },
                listen: () => () => {},
                serverResult
            }
        };
    });

    it('should redirect on mount', () => {
        mount(<Redirect urlName="user:profile" params={{username: 'x'}} state={{statevar: 1}} />, {context});
        expect(navigate).toBeCalledWith(jasmine.objectContaining({urlName: "user:profile", params: {username: 'x'}, state: {statevar: 1}}), false);
    });

    it('should replace if instructed', () => {
        mount(<Redirect urlName="user:profile" params={{username: 'x'}} state={{statevar: 1}} replace={true} />, {context});
        expect(navigate).toBeCalledWith(jasmine.objectContaining({urlName: "user:profile", params: {username: 'x'}, state: {statevar: 1}}), true);
    });

    it('should update serverResult if provided', () => {
        const wrapper = shallow(<Redirect urlName="user:profile" params={{username: 'x'}} query={{a: 'b'}} state={{statevar: 1}} />, {context});
        // Shallow again because of withRouter decorator
        shallow(wrapper.node, {context});
        expect(navigate).not.toBeCalled();
        expect(serverResult.redirect).toEqual('/u/x/?a=b');
    });
});
