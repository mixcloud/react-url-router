/* @flow */
import debounce from 'throttle-debounce/debounce';

const DELAY = 200;


export const checkRefVisibility = debounce(DELAY, (refProps, callback) => {
    const bottom = window.innerHeight || document.documentElement.clientHeight;
    const right = window.innerWidth || document.documentElement.clientWidth;

    Object.keys(refProps).forEach(ref => {
        const rect = ref.getBoundingClientRect();
        const visible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= bottom &&
            rect.right <= right
        );
        if (visible) {
            callback(refProps[ref]);
            delete refProps[ref]; // Only allow this to fire once
        }
    });
});
