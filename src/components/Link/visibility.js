/* @flow */
import type {OnVisibilityCallback, RefProps} from '../../types';

export const checkRefVisibility = (refProps: RefProps, callback: OnVisibilityCallback) => {
    const bottom = window.innerHeight || (document && document.documentElement && document.documentElement.clientHeight);
    const right = window.innerWidth || (document && document.documentElement && document.documentElement.clientWidth);

    refProps.forEach((props, ref) => {
        if (ref.getBoundingClientRect) {
            const rect = ref.getBoundingClientRect();
            const visible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= bottom &&
                rect.right <= right
            );
            if (visible) {
                callback(props);
                refProps.delete(ref); // Allow this to fire just once per render
            }
        }
    });
};
