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

        mounted: boolean = false;

        componentDidMount() {
            const {router} = this.context;
            this.mounted = true;
            this.unlisten = router.listen(() => {
                const {location, match} = router;
                if (this.mounted) {
                    this.setState({location, match});
                }
            });
        }

        componentWillUnmount() {
            this.mounted = false;
            if (this.unlisten) {
                this.unlisten();
            }
        }

        render() {
            const {location, match, history, urls, navigate} = this.context.router;
            const props = {
                ...this.props,
                location,
                match,
                history,
                urls,
                navigate
            };
            // Deliberately allowing this.props to override location
            if (this.props.location) {
                props.location = this.props.location;
            }
            return <Component {...props} />;
        }
    }, componentName ? `WithRouter(${componentName})` : 'WithRouter');
};
