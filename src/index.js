/* @flow */
import Urls from './urls';
import withRouter from './components/decorators/withRouter';
import Link from './components/Link';
import Redirect from './components/Redirect';
import Route from './components/Route';
import Switch from './components/Switch';
import Router from './components/Router';
import ScrollRestorer from './components/ScrollRestorer';
import createServerHistory from './createServerHistory';

export type {
    Urls,
    ServerResult,
    State,
    Location,
    History,
    UrlConf,
    Params,
    Query,
    Match,
    LinkProps,
    LinkCallbackProps,
    Navigate,
    LinkMiddleware,
    OnNavigateCallback,
    OnClickCallback,
    OnVisibilityCallback,
    RefProps,
    RouterProps
} from './types';

export {
    Router,
    Route,
    Switch,
    Link,
    Redirect,
    ScrollRestorer,
    withRouter,
    createServerHistory
};
