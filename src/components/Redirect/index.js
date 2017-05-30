/* @flow */
import React from 'react';
import withRouter from '../decorators/withRouter';
import {RouterContextPropType} from '../Router';
import type {RouterContextType} from '../Router';


const Redirect = withRouter(class extends React.Component {
    static contextTypes = {router: RouterContextPropType};
    context: {router: RouterContextType};

    componentWillMount() {
        const {serverResult} = this.context.router;

        if (serverResult) {
            // For server rendering
            const {pathname, search} = this.props.urls.getForLink(this.props);
            serverResult.redirect = `${pathname}${search || ''}`;
        }
    }

    componentDidMount() {
        // For client rendering
        const {urls, history, replace, state} = this.props;
        if (replace) {
            history.replace(urls.getForLink(this.props), state);
        } else {
            history.push(urls.getForLink(this.props), state);
        }
    }

    render() {
        return null;
    }
});

Redirect.displayName = 'Redirect';


export default Redirect;
