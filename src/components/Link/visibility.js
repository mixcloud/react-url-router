/* @flow */
import throttle from 'throttle-debounce/throttle';

const DELAY = 200;


export const checkRefVisibility = throttle(DELAY, (refCallbacks, callback) => {
    const bottom = window.innerHeight || document.documentElement.clientHeight;
    const right = window.innerWidth || document.documentElement.clientWidth;

    Object.keys(refCallbacks).forEach(ref => {
        const rect = ref.getBoundingClientRect();
        const visible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= bottom &&
            rect.right <= right
        );
        if (visible) {
            callback(refCallbacks[ref]);
        }
    });
});
