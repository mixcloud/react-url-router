/* @flow */
import React, {Children, PropTypes} from 'react';
import {Listeners} from '../../utils';
import type Urls from '../../urls';
import type {LinkProps, LinkMiddleware, Match, History, Location, ServerResult, Navigate} from '../../types';


export type RouterContextType = {|
    serverResult?: ServerResult,
    history: History,
    urls: Urls,
    match: Match | null,
    location: Location,
    listen: (callback: () => void) => () => void,
    linkMiddleware: LinkMiddleware[],
    navigate: Navigate
|};

export const RouterContextPropType = PropTypes.shape({
    serverResult: PropTypes.object,
    history: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired,
    match: PropTypes.object,
    location: PropTypes.object.isRequired,
    listen: PropTypes.func.isRequired,
    linkMiddleware: PropTypes.arrayOf(PropTypes.func).isRequired,
    navigate: PropTypes.func.isRequired
}).isRequired;


type RouterProps = {
    history: History,
    urls: Urls,
    serverResult?: ServerResult,
    linkMiddleware: LinkMiddleware[],
    children?: ?any
};


export default class Router extends React.Component {
    static displayName = 'Router';
    props: RouterProps;
    static defaultProps = {
        linkMiddleware: []
    };

    _listeners = new Listeners();
    _unlisten: ?() => void;

    static childContextTypes = {router: RouterContextPropType};
    getChildContext = (): {router: RouterContextType} => ({router: this.routerContext});
    routerContext = {
        serverResult: this.props.serverResult,
        history: this.props.history,
        urls: this.props.urls,
        location: this.props.history.location,
        match: null,
        listen: this._listeners.listen,
        linkMiddleware: this.props.linkMiddleware,
        navigate: (props: LinkProps, replace: ?boolean = false) => {
            const location = this.routerContext.urls.makeLocation(props);
            if (replace) {
                this.routerContext.history.replace(location);
            } else {
                this.routerContext.history.push(location);
            }
        }
    };

    _updateLocation = location => {
        this.routerContext.location = location;
        this._listeners.notify();
    };

    componentDidMount() {
        const {history} = this.props;
        this._unlisten = history.listen(this._updateLocation);

        // To catch early redirects
        if (history.location !== this.routerContext.location) {
            this._updateLocation(history.location);
        }
    }

    componentWillUnmount() {
        if (this._unlisten) {
            this._unlisten();
        }
    }

    render() {
        return Children.only(this.props.children);
    }
}
