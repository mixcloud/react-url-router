/* @flow */
import React, {Children} from 'react';
import {Listeners} from '../../utils';
import {RouterContextPropType} from '../Router';
import type {Match, Location} from '../../types';
import type {RouterContextType} from '../Router';


type RouteContextProps = {
    location: Location,
    match: Match | null,
    children?: any
};

export default class RouteContext extends React.PureComponent {
    props: RouteContextProps;
    context: {router: RouterContextType};

    _listeners = new Listeners();

    static contextTypes = {router: RouterContextPropType};
    static childContextTypes = {router: RouterContextPropType};
    getChildContext = () => ({router: this.routerContext});
    routerContext = {
        ...this.context.router,
        location: this.props.location,
        match: this.props.match,
        listen: this._listeners.listen
    };

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps: RouteContextProps) {
        if (nextProps.match !== this.props.match || nextProps.location !== this.props.location) {
            this.routerContext.match = nextProps.match;
            this.routerContext.location = nextProps.location;
            this._listeners.notify();
        }
    }

    render() {
        return Children.only(this.props.children);
    }
}
