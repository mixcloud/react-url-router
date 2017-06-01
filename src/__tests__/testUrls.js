/* @noflow */
import Urls from '../urls';


const URLCONF = {
    'home': '/',
    'user:profile': '/u/:username/'
};

const urls = new Urls(URLCONF);


describe('Urls', () => {
    it('should provide a pattern for a url', () => {
        expect(urls.pattern('home')).toEqual('/');
        expect(urls.pattern('user:profile')).toEqual('/u/:username/');
        expect(() => {
            urls.pattern('somethingelse');
        }).toThrow();
    });

    it('should build a url with params', () => {
        expect(urls.get('home')).toEqual('/');
        expect(urls.get('user:profile', {username: 'testuser'})).toEqual('/u/testuser/');
        expect(() => {
            urls.get('somethingelse');
        }).toThrow();
        expect(() => {
            urls.get('user:profile');
        }).toThrow();
        expect(() => {
            urls.get('user:profile', {username: 'x', something: 'else'});
        }).toThrow();
    });

    it('should generate a querystring', () => {
        expect(urls.buildSearch({})).toEqual('');
        expect(urls.buildSearch({a: 'b'})).toEqual('a=b');
        expect(urls.buildSearch({a: 'b', c: 'd'})).toEqual('a=b&c=d');
        expect(urls.buildSearch({a: 'b', c: 'd', e: 'f'})).toEqual('a=b&c=d&e=f');
        expect(urls.buildSearch({$: '$'})).toEqual('%24=%24');
    });

    it('should build locations', () => {
        expect(urls.makeLocation({urlName: 'home', params: {}})).toEqual({pathname: '/'});
        expect(urls.makeLocation({urlName: 'user:profile', params: {username: 'x'}})).toEqual({pathname: '/u/x/'});
        expect(urls.makeLocation({urlName: 'home', params: {}, query: {a: 'b'}})).toEqual({pathname: '/', search: '?a=b'});
    });

    it('should provide expected params', () => {
        expect(urls.getExpectedParams('home')).toEqual([]);
        expect(urls.getExpectedParams('user:profile')).toEqual(['username']);
    });

    describe('match', () => {
        it('should match a path', () => {
            expect(urls.match('/', 'home', {exact: true, strict: true})).toEqual({params: {}, urlName: 'home'});
            expect(urls.match('/another/', 'home', {exact: true, strict: true})).toEqual(null);
            expect(urls.match('/', 'user:profile', {exact: true, strict: true})).toEqual(null);
            expect(urls.match('/another/', 'user:profile', {exact: true, strict: true})).toEqual(null);
            expect(urls.match('/u/abc/', 'user:profile', {exact: true, strict: true})).toEqual({params: {username: 'abc'}, urlName: 'user:profile'});
        });

        it('should match non-exactly', () => {
            expect(urls.match('/', 'home', {exact: false, strict: true})).toEqual({params: {}, urlName: 'home'});
            expect(urls.match('/another/', 'home', {exact: false, strict: true})).toEqual({params: {}, urlName: 'home'});
            expect(urls.match('/u/abc/another/', 'user:profile', {exact: false, strict: true})).toEqual({params: {username: 'abc'}, urlName: 'user:profile'});
        });

        it('should match non-strictly', () => {
            expect(urls.match('/u/abc', 'user:profile', {exact: true, strict: true})).toEqual(null);
            expect(urls.match('/u/abc', 'user:profile', {exact: true, strict: false})).toEqual({params: {username: 'abc'}, urlName: 'user:profile'});
        });
    });
});
