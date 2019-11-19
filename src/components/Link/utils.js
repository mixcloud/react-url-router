/* @flow */
import React, {Children, isValidElement} from 'react';

const childToString = (child: Text | boolean | {} | null): string => {
    if (typeof child === 'undefined' || child === null || typeof child === 'boolean') {
        return '';
    }

    return child.toString();
};

const hasChildren = (element: React.Children): boolean =>
    isValidElement(element) && Boolean(element.props.children);

export const onlyText = (children: React.Children): string => {
    if (!(children instanceof Array) && !isValidElement(children)) {
        return childToString(children);
    }

    return Children.toArray(children).reduce((text: string, child: React.Children): string => {
        let newText;

        if (isValidElement(child) && hasChildren(child)) {
            newText = onlyText(child.props.children);
        } else {
            newText = childToString(child);
        }

        return text.concat(newText);
    }, '');
};
