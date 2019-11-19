/* @flow */
import React, {Children} from 'react';
import PropTypes from 'prop-types';
import {Listeners} from '../../utils';
import {checkRefVisibility} from '../Link/visibility';
import type Urls from '../../urls';
import type {LinkCallbackProps, LinkProps, LinkMiddleware, Match, History, Location, ServerResult, Navigate, OnClickCallback, OnVisibilityCallback} from '../../types';


export type RouterContextType = {|
    serverResult?: ServerResult,
    history: History,
    urls: Urls,
    match: Match | null,
    location: Location,
    listen: (callback: () => void) => () => void,
    linkMiddleware: LinkMiddleware[],
    navigate: Navigate,
    onClickCallback?: OnClickCallback | null,
    onVisibilityCallback?: OnVisibilityCallback | null,
    visibleRefProps: Map<HTMLElement, LinkCallbackProps>
|};

export const RouterContextPropType = PropTypes.shape({
    serverResult: PropTypes.object,
    history: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired,
    match: PropTypes.object,
    location: PropTypes.object.isRequired,
    listen: PropTypes.func.isRequired,
    linkMiddleware: PropTypes.arrayOf(PropTypes.func).isRequired,
    navigate: PropTypes.func.isRequired
}).isRequired;


type RouterProps = {
    history: History,
    addSlashes: boolean,
    urls: Urls,
    serverResult?: ServerResult,
    linkMiddleware: LinkMiddleware[],
    children?: ?any,
    onClickCallback?: ?OnClickCallback,
    onVisibilityCallback?: ?OnVisibilityCallback
};

const SLASH_RE = /\/$/;

export default class Router extends React.Component {
    static displayName = 'Router';
    props: RouterProps;
    static defaultProps = {
        linkMiddleware: [],
        addSlashes: false
    };

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
        listen: this._listeners.listen,
        linkMiddleware: this.props.linkMiddleware,
        navigate: (props: LinkProps, replace: ?boolean = false) => {
            const location = this.routerContext.urls.makeLocation(props);

            if (replace) {
                this.routerContext.history.replace(location);
            } else {
                this.routerContext.history.push(location);
            }
        },
        onClickCallback: this.props.onClickCallback,
        visibleRefProps: new Map()
    };

    _updateLocation = location => {
        let finalLocation = location;

        if (this.props.addSlashes) {
            const redirectLocation = this._slashUrlPath(location);
            if (redirectLocation) {
                finalLocation = redirectLocation;
                this.routerContext.history.replace(finalLocation);
            }
        }

        if (finalLocation !== this.routerContext.location) {
            this.routerContext.location = finalLocation;
            this._listeners.notify();
        }
    };

    _visibleRefChecker = () => {
        if (this.props.onVisibilityCallback) {
            checkRefVisibility(this.routerContext.visibleRefProps, this.props.onVisibilityCallback);
        }
    }

    _slashUrlPath = location => {
        // See if there is a url with slashes that we can redirect to
        const {pathname} = location;

        if (pathname.match(SLASH_RE)) {
            return null;
        }

        const {urls} = this.routerContext;

        // Do not redirect if the current url matches something in urls
        for (const urlName of urls.getAllUrlNames()) {
            if (urls.match(pathname, urlName, {strict: true, exact: true})) {
                return null;
            }
        }

        return {
            ...location,
            pathname: `${pathname}/`
        };
    };

    componentDidMount() {
        const {history} = this.props;
        this._unlisten = history.listen(this._updateLocation);

        window.addEventListener("scroll", this._visibleRefChecker, true);

        // To catch early redirects
        this._updateLocation(history.location);
    }

    componentWillUnmount() {
        if (this._unlisten) {
            this._unlisten();
        }
        window.removeEventListener("scroll", this._visibleRefChecker, true);
    }

    render() {
        return Children.only(this.props.children);
    }
}
