/* @flow */
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';


export type WrappedComponent = ReactClass<*> | (props: *) => ?React.Element<*>;


export function wraps(Component: ReactClass<*>, Wrapper: WrappedComponent, displayName: ?string) {
    Wrapper.WrappedComponent = Component;
    if (displayName) {
        Wrapper.displayName = displayName;
    }
    hoistNonReactStatics(Wrapper, Component, {WrappedComponent: true});
    return Wrapper;
}


export class Listeners {
    _listeners = [];

    listen = (listener: () => void) => {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(other => other !== listener);
        };
    };

    notify() {
        this._listeners.forEach(listener => { listener(); });
    }
}
