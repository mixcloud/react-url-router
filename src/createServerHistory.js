/* @flow */
import {createPath} from 'history/PathUtils';
import type {Location, History} from './types';


export default (location: Location): History => ({
    location,
    replace() { throw Error("replace() is not supported on the server"); },
    push() { throw Error("push() is not supported on the server"); },
    createHref: createPath,
    listen: () => () => {}
});
