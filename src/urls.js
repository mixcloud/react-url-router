/* @flow */
import pathToRegexp from 'path-to-regexp';
import type {UrlConf, Params, Query, Match, Location} from './types';


const PLUS = /%2B/g;
const COLON = /%3A/g;


export default class Urls {
    urlConf: UrlConf;
    _getCompileCache = {};
    _matchCompileCache = {};
    _expectedParamsCache = {};

    constructor(urlConf: UrlConf) {
        this.urlConf = urlConf;
    }

    get(name: string, params: Params = {}) {
        const pattern = this.pattern(name);

        // When in development, check that the params are correct
        if (process.env.NODE_ENV !== "production") {
            const parsed = pathToRegexp.parse(pattern);
            const paramNames = Object.keys(params);
            const expectedParams = new Set(this.getExpectedParams(name));
            parsed.forEach(token => {
                if (token.name && !token.optional && paramNames.indexOf(token.name) === -1) {
                    throw Error(`param ${token.name} not provided for urlName ${name}`);
                }
            });
            paramNames.forEach(paramName => {
                if (!expectedParams.has(paramName)) {
                    throw Error(`Unexpected param ${paramName} provided for urlName ${name}`);
                }
            });
        }

        if (!this._getCompileCache.hasOwnProperty(name)) {
            this._getCompileCache[name] = pathToRegexp.compile(pattern);
        }
        // Replacements to undo url encoding of `+` and `:` so that discover urls look nice
        return this._getCompileCache[name](params).replace(PLUS, '+').replace(COLON, ':');
    }

    buildSearch(query: Query) {
        return Object.keys(query)
                     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key].toString())}`)
                     .join('&');
    }

    _makeLocation({urlName, params, query}: {urlName: string, params: Params, query?: ?Query}): Location {
        const pathname = this.get(urlName, params);
        return query ? {pathname, search: `?${this.buildSearch(query)}`} : {pathname};
    }

    // getForRedirect is called with the props of <Redirect> and can be overridden
    getForRedirect(props: {urlName: string, params: Params, query?: ?Query}): Location {
        return this._makeLocation(props);
    }

    // getForLink is called with the props of <Link> and can be overridden
    getForLink(props: {urlName: string, params: Params, query?: ?Query}): Location {
        return this._makeLocation(props);
    }

    pattern(name: string): string {
        if (process.env.NODE_ENV !== "production" && !this.urlConf.hasOwnProperty(name)) {
            throw Error(`urls.js: URL name ${name} not found`);
        }
        return this.urlConf[name];
    }

    _getMatchCompiled(urlName, exact, strict) {
        const pattern = this.pattern(urlName);

        const cacheKey = `${exact ? 1 : 0}${strict ? 1 : 0}`;
        if (!(cacheKey in this._matchCompileCache)) {
            this._matchCompileCache[cacheKey] = {};
        }

        if (!(urlName in this._matchCompileCache[cacheKey])) {
            const keys = [];
            const re = pathToRegexp(pattern, keys, {end: exact, strict});
            this._matchCompileCache[cacheKey][urlName] = {re, keys};
        }

        return this._matchCompileCache[cacheKey][urlName];
    }

    match(pathname: string, urlName: string, options: {exact?: boolean, strict?: boolean} = {}): Match | null {
        const {exact = false, strict = true} = options;
        const {re, keys} = this._getMatchCompiled(urlName, exact, strict);
        const match = re.exec(pathname);

        if (!match) {
            return null;
        }

        const [url, ...values] = match;
        const isExact = pathname === url;

        if (exact && !isExact) {
            return null;
        }

        return {
            urlName,
            params: keys.reduce((params, key, index) => {
                params[key.name] = decodeURIComponent(values[index]);
                return params;
            }, {})
        };
    }

    getAllUrlNames(): string[] {
        return Object.keys(this.urlConf);
    }

    getExpectedParams(name: string): string[] {
        if (!(name in this._expectedParamsCache)) {
            const pattern = this.pattern(name);
            const parsed = pathToRegexp.parse(pattern);
            const expectedParams = new Set();

            parsed.forEach((token) => {
                if (token.name) {
                    expectedParams.add(token.name);
                }
            });

            this._expectedParamsCache[name] = Array.from(expectedParams);
        }
        return this._expectedParamsCache[name];
    }

    renderMatch(props: {match: Match | null, location: Location}, children: any) {
        return children;
    }
}
