/* @noflow */
import {Listeners} from '../utils';


describe('Utils', () => {
    describe('Listeners', () => {
        it('should call listeners on notify()', () => {
            const listeners = new Listeners();
            const fn1 = jest.fn();
            const fn2 = jest.fn();
            listeners.listen(fn1);
            const unlisten2 = listeners.listen(fn2);
            expect(fn1).not.toBeCalled();
            expect(fn2).not.toBeCalled();
            listeners.notify();
            expect(fn1).toBeCalled();
            expect(fn2).toBeCalled();
            fn1.mockClear();
            fn2.mockClear();
            unlisten2();
            listeners.notify();
            expect(fn1).toBeCalled();
            expect(fn2).not.toBeCalled();
        });
    });
});
