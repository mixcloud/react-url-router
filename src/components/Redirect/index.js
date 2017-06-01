/* @flow */
import React from 'react';
import withRouter from '../decorators/withRouter';
import {RouterContextPropType} from '../Router';
import type {RouterContextType} from '../Router';


class Redirect extends React.Component {
    static contextTypes = {router: RouterContextPropType};
    context: {router: RouterContextType};
    static defaultProps = {
        replace: false
    };

    componentWillMount() {
        const {serverResult} = this.context.router;

        if (serverResult) {
            // For server rendering
            const {pathname, search, hash} = this.props.urls.makeLocation(this.props);
            serverResult.redirect = `${pathname}${search || ''}${hash || ''}`;
        }
    }

    componentDidMount() {
        // For client rendering
        const {replace, navigate} = this.props;
        navigate(this.props, replace);
    }

    render() {
        return null;
    }
}


export default withRouter(Redirect);
