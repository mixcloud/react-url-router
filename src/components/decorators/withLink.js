/* @flow */
import React from 'react';
import withRouter from '../decorators/withRouter';
import {wraps} from '../../utils';
import type Urls from '../../urls';
import type {Params, Query, Location, History} from '../../types';
import type {WrappedComponent} from '../../utils';


export default (Component: WrappedComponent) => wraps(Component, withRouter(class extends React.PureComponent {
    props: {
        location: Location,
        urls: Urls,
        history: History,
        urlName: string,
        params: Params,
        query?: ?Query,
        state: Object,
        replace: boolean,
        exact?: boolean,
        strict?: boolean,
        isActive?: () => boolean,
        children?: any
    };
    static defaultProps = {
        state: {},
        params: {},
        replace: false
    };

    navigate = () => {
        const {urls, history, replace, state} = this.props;

        if (replace) {
            history.replace(urls.getForLink(this.props), state);
        } else {
            history.push(urls.getForLink(this.props), state);
        }
    };

    isActive = () => {
        const {urls, location, urlName, exact, strict, isActive} = this.props;

        const match = urls.match(location.pathname, urlName, {exact, strict});

        if (isActive) {
            return isActive(match, location);
        }

        return !!match;
    };

    render() {
        return <Component {...this.props} navigate={this.navigate} isActive={this.isActive} />;
    }
}));
