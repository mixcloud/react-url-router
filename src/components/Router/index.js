/* @flow */
import React, {Children, PropTypes} from 'react';
import {Listeners} from '../../utils';
import type Urls from '../../urls';
import type {Match, History, Location, ServerResult} from '../../types';


export type RouterContextType = {|
    serverResult?: ServerResult,
    history: History,
    urls: Urls,
    match: Match | null,
    location: Location,
    listen: (callback: () => void) => () => void
|};

export const RouterContextPropType = PropTypes.shape({
    serverResult: PropTypes.object,
    history: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired,
    match: PropTypes.object,
    location: PropTypes.object.isRequired,
    listen: PropTypes.func.isRequired
}).isRequired;


type RouterProps = {
    history: History,
    urls: Urls,
    serverResult?: ServerResult,
    children?: ?any
};


export default class Router extends React.Component {
    static displayName = 'Router';
    props: RouterProps;

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
        listen: this._listeners.listen
    };

    componentDidMount() {
        const {history} = this.props;
        this._unlisten = history.listen(location => {
            this.routerContext.location = location;
            this._listeners.notify();
        });
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
