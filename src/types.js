/* @flow */


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
    replace: (location: Location | string, state: ?State) => void,
    push: (location: Location | string, state: ?State) => void,
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
