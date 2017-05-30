/* @flow */
import React from 'react';
import withLink from '../decorators/withLink';
import type Urls from '../../urls';
import type {Params, Query, History} from '../../types';


const PROPS_RE = /^(data-|on[A-Z])/;
const A_PROPS = new Set([
    'target',
    'style',
    'className',
    'rel',
    'title',
    'children'
]);


function forwardProps(props) {
    return Object.keys(props).filter(k => A_PROPS.has(k) || k.match(PROPS_RE)).reduce((filtered, k) => {
        filtered[k] = props[k];
        return filtered;
    }, {});
}


const Link = withLink(class extends React.PureComponent {
    props: {
        history: History,
        urls: Urls,
        urlName: string,
        params: Params,
        query?: ?Query,
        state: Object,
        replace: boolean,
        exact?: boolean,
        strict?: boolean,
        activeClassName?: string,
        activeStyle?: Object,
        style?: Object,
        className?: string,
        target?: string,
        onClick?: (event: MouseEvent) => void,
        children?: any,
        isActive: () => boolean,
        navigate: () => void
    };

    onClick = (event) => {
        if (this.props.onClick) {
            this.props.onClick(event);
        }

        if (
            !event.defaultPrevented && // onClick prevented default
            event.button === 0 && // ignore right clicks
            !this.props.target && // let browser handle "target=_blank" etc.
            !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) // ignore clicks with modifier keys
        ) {
            event.preventDefault();

            this.props.navigate();
        }
    };

    render() {
        const {
            history,
            urls,
            activeClassName,
            activeStyle,
            ...rest
        } = this.props;

        const useActiveStyle = (activeClassName || activeStyle) ? this.props.isActive() : false;

        const props = {
            ...forwardProps(rest),
            href: history.createHref(urls.getForLink(this.props)),
            onClick: this.onClick
        };

        if (useActiveStyle) {
            if (activeClassName) {
                props.className = `${props.className || ''} ${activeClassName}`;
            }
            if (activeStyle) {
                props.style = {...props.style, ...activeStyle};
            }
        }

        return <a {...props} />;
    }
});

Link.displayName = 'Link';


export default Link;
