/* @flow */
import type {Location, History} from './types';


export default (location: Location): History => ({
    location,
    replace() { throw Error("replace() is not supported on the server"); },
    push() { throw Error("push() is not supported on the server"); },
    createHref(location: Location) {
        const {pathname, search, hash} = location;
        var path = encodeURI(pathname || '/');

        if (search && search !== '?') {
            path += (search.charAt(0) === '?' ? search : `?${search}`);
        }

        if (hash && hash !== '#') {
            path += (hash.charAt(0) === '#' ? hash : `#${hash}`);
        }

        return path;
    },
    listen: () => () => {}
});
