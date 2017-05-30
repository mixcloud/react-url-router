/* @flow */
import React, {Children} from 'react';
import RouteRenderer from '../RouteRenderer';
import Route from '../Route';


export default class Switch extends React.PureComponent {
    static displayName = 'Switch';

    render() {
        if (process.env.NODE_ENV !== 'production') {
            Children.forEach(this.props.children, child => {
                if (child.type !== Route) {
                    throw Error(`Switch should only have <Route> components as children - received ${child.type.toString()} instead`);
                }
            });
        }
        return <RouteRenderer routes={Children.map(this.props.children, route => route.props)} />;
    }
}
