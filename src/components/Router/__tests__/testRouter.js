/* @noflow */
import React from 'react';
import Router from '..';
import {mount} from 'enzyme';
import withRouter from '../../decorators/withRouter';
import Urls from '../../../urls';

const URLCONF = {
    home: '/',
    noslash: '/this/has/no/slash',
    hasslash: '/this/has/a/slash/'
};


const TestComponent = withRouter(({location, cb}) => {
    cb(location);
    return null;
});



describe('<Router />', () => {
    var location;

    beforeEach(() => {
        location = null;
    });

    it('should redirect and add a slash', () => {
        var listener;

        const history = {
            location: {
                pathname: '/test',
                search: '?hello=1'
            },
            replace: jest.fn(),
            listen: _listener => { listener = _listener; }
        };

        mount(
            <Router
                urls={new Urls(URLCONF)}
                history={history}
                addSlashes={true}
            >
                <TestComponent cb={_location => { location = _location; }} />
            </Router>
        );

        expect(history.replace).toBeCalledWith({pathname: '/test/', search: '?hello=1'});
        expect(location).toEqual({pathname: '/test/', search: '?hello=1'});

        history.replace.mockClear();
        listener({pathname: '/another/url', state: {a: 1}});
        expect(history.replace).toBeCalledWith({pathname: '/another/url/', state: {a: 1}});
        expect(location).toEqual({pathname: '/another/url/', state: {a: 1}});
    });

    it('should not redirect and add a slash if addSlashes=false', () => {
        var listener;

        const history = {
            location: {
                pathname: '/test',
                search: '?hello=1'
            },
            replace: jest.fn(),
            listen: _listener => { listener = _listener; }
        };

        mount(
            <Router
                urls={new Urls(URLCONF)}
                history={history}
            >
                <TestComponent cb={_location => { location = _location; }} />
            </Router>
        );

        expect(history.replace).not.toBeCalled();
        expect(location).toEqual({pathname: '/test', search: '?hello=1'});

        history.replace.mockClear();
        listener({pathname: '/another/url', state: {a: 1}});
        expect(history.replace).not.toBeCalled();
        expect(location).toEqual({pathname: '/another/url', state: {a: 1}});
    });

    it('should not redirect and add a slash if it is a valid url', () => {
        const history = {
            location: {
                pathname: '/this/has/no/slash'
            },
            replace: jest.fn(),
            listen() {}
        };

        mount(
            <Router
                urls={new Urls(URLCONF)}
                history={history}
                addSlashes={true}
            >
                <TestComponent cb={_location => { location = _location; }} />
            </Router>
        );

        expect(history.replace).not.toBeCalled();
        expect(location).toEqual({pathname: '/this/has/no/slash'});
    });
});
