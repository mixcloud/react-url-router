/* @flow */
import React from 'react';
import RouteRenderer from '../RouteRenderer';
import type {WrappedComponent} from '../../utils';


export type RouteProps = {
    urlName?: string,
    exact?: boolean,
    strict?: boolean,
    component?: WrappedComponent,
    render?: (props: *) => React.Element<*>
};


export default class Route extends React.PureComponent {
    static displayName = 'Route';
    props: RouteProps;

    render() {
        return <RouteRenderer routes={[this.props]} />;
    }
}
