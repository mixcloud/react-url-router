/* @flow */
import React from 'react';
import RouteContext from '../RouteContext';
import withRouter from '../decorators/withRouter';
import {RouterContextPropType} from '../Router';
import type {RouterContextType} from '../Router';
import type Urls from '../../urls';
import type {Location} from '../../types';
import type {RouteProps} from '../Route';


export default withRouter(class extends React.PureComponent {
    static contextTypes = {router: RouterContextPropType};
    context: {router: RouterContextType};

    props: {
        routes: RouteProps[],
        urls: Urls,
        location: Location
    };

    renderMatch(Component, render, match = null) {
        const {location} = this.props;
        const props = {location, match};
        var inner = null;
        if (Component) {
            inner = <Component {...props} />;
        } else if (render) {
            inner = render(props);
        }

        return this.props.urls.renderMatch(props,
            <RouteContext {...props}>
                {inner}
            </RouteContext>
        );
    }

    render() {
        const {location, urls, routes} = this.props;

        for (const route of routes) {
            const {urlName, exact, strict, component, render} = route;

            if (!urlName) {
                // <Route>s with no urlName always match
                return this.renderMatch(component, render);
            }

            const urlNames = Array.isArray(urlName) ? urlName : [urlName];

            for (const urlName of urlNames) {
                const match = urls.match(location.pathname, urlName, {strict, exact});
                if (match) {
                    if (this.context.router.serverResult) {
                        this.context.router.serverResult.hasMatched = true;
                    }
                    return this.renderMatch(component, render, match);
                }
            }
        }

        return null;
    }
});
