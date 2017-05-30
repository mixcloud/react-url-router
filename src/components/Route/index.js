/* @flow */
import React from 'react';
import RouteRenderer from '../RouteRenderer';
import type {WrappedComponent} from '../../utils';
import type {Location} from '../../types';


export type RouteProps = {
    urlName?: string,
    exact?: boolean,
    strict?: boolean,
    component?: WrappedComponent,
    render?: (props: *) => React.Element<*>,
    location?: ?Location
};


export default class Route extends React.PureComponent {
    static displayName = 'Route';
    props: RouteProps;

    render() {
        return <RouteRenderer location={this.props.location} routes={[this.props]} />;
    }
}
