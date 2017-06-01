/* @flow */
import React from 'react';


export type ServerResult = {
    hasMatched?: boolean,
    redirect?: string
};


export type State = Object;


export type Location = {
    pathname: string,
    search?: string,
    hash?: string,
    state?: State,
    key?: string
};


export type History = {
    location: Location,
    replace: (location: Location) => void,
    push: (location: Location) => void,
    createHref: (location: Location) => string,
    listen: (callback: (location: Location) => void) => () => void
};


export type UrlConf = {[urlName: string]: string};


export type Params = {[paramName: string]: string};


export type Query = {[paramName: string]: string};


export type Match = {
    urlName: string,
    params: Params
};


export type LinkProps = {
    urlName?: ?string,
    params?: ?Params,
    query?: ?Query,
    state?: ?State,
    hash?: ?string,
    to?: ?string
};


export type Navigate = (props: LinkProps, replace: ?boolean) => void;


export type LinkMiddleware = (props: LinkProps, next: (props: LinkProps) => React.Element<*>) => React.Element<*>;
