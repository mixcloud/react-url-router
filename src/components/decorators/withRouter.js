/* @flow */
import React from 'react';
import {RouterContextPropType} from '../Router';
import {wraps} from '../../utils';
import type {RouterContextType} from '../Router';
import type {Location, Match} from '../../types';
import type {WrappedComponent} from '../../utils';


export default (Component: WrappedComponent) => {
    const componentName = Component.displayName || Component.name || ((Component.constructor: any).name: any);

    return wraps(Component, class extends React.PureComponent {
        static contextTypes = {router: RouterContextPropType};
        context: {router: RouterContextType};

        state: {
            location: Location,
            match: Match | null
        } = {
            location: this.context.router.location,
            match: this.context.router.match
        };

        unlisten: ?() => void;

        componentDidMount() {
            const {router} = this.context;
            this.unlisten = router.listen(() => {
                const {location, match} = router;
                this.setState({location, match});
            });
        }

        componentWillUnmount() {
            if (this.unlisten) {
                this.unlisten();
            }
        }

        render() {
            const {location, match, history, urls} = this.context.router;
            const props = {
                location,
                ...this.props,  // Deliberately allowing this.props to override location
                match,
                history,
                urls
            };
            return <Component {...props} />;
        }
    }, componentName ? `WithRouter(${componentName})` : 'WithRouter');
};
