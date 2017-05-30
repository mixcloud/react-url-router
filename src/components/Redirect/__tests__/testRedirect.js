/* @noflow */
import React from 'react';
import Redirect from '../';
import {shallow, mount} from 'enzyme';


describe('<Redirect>', () => {
    it('should redirect on mount', () => {
        const push = jest.fn();
        const replace = jest.fn();
        mount(<Redirect urlName="user:profile" params={{username: 'x'}} state={{statevar: 1}} />, {
            context: {
                router: {
                    location: {},
                    urls: {
                        getForLink({urlName, params}) {
                            expect(urlName).toEqual('user:profile');
                            expect(params).toEqual({username: 'x'});
                            return {pathname: "/u/x/"};
                        }
                    },
                    history: {
                        push,
                        replace
                    },
                    listen: () => () => {}
                }
            }
        });
        expect(replace).not.toBeCalled();
        expect(push).toBeCalledWith({pathname: '/u/x/'}, {statevar: 1});
    });

    it('should replace if instructed', () => {
        const push = jest.fn();
        const replace = jest.fn();
        mount(<Redirect urlName="user:profile" params={{username: 'x'}} state={{statevar: 1}} replace={true} />, {
            context: {
                router: {
                    location: {},
                    urls: {
                        getForLink({urlName, params}) {
                            expect(urlName).toEqual('user:profile');
                            expect(params).toEqual({username: 'x'});
                            return {pathname: "/u/x/"};
                        }
                    },
                    history: {
                        push,
                        replace
                    },
                    listen: () => () => {}
                }
            }
        });
        expect(push).not.toBeCalled();
        expect(replace).toBeCalledWith({pathname: '/u/x/'}, {statevar: 1});
    });

    it('should update serverResult if provided', () => {
        const push = jest.fn();
        const replace = jest.fn();
        const serverResult = {};
        const context = {
            router: {
                location: {},
                urls: {
                    getForLink({urlName, params, query}) {
                        expect(urlName).toEqual('user:profile');
                        expect(params).toEqual({username: 'x'});
                        expect(query).toEqual({a: 'b'});
                        return {pathname: "/u/x/", search: '?a=b'};
                    }
                },
                history: {
                    push,
                    replace
                },
                listen: () => () => {},
                serverResult
            }
        };
        const wrapper = shallow(<Redirect urlName="user:profile" params={{username: 'x'}} query={{a: 'b'}} state={{statevar: 1}} />, {context});
        // Shallow again because of withRouter decorator
        shallow(wrapper.node, {context});
        expect(replace).not.toBeCalled();
        expect(push).not.toBeCalled();
        expect(serverResult.redirect).toEqual('/u/x/?a=b');
    });
});
