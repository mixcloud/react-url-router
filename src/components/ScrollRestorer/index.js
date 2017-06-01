/* @flow */
import React, {Children} from 'react';
import withRouter from '../decorators/withRouter';
import type {Location} from '../../types';


type Props = {
    location: Location,
    children?: any
};

class ScrollRestorer extends React.Component {
    props: Props;

    componentDidUpdate(prevProps) {
        const {location} = this.props;
        const {location: prevLocation} = prevProps;

        if (location !== prevLocation) {
            window.scrollTo(0, location.state && location.state.scrollY || 0);
        }
    }

    render() {
        const {children} = this.props;
        if (children) {
            return Children.only(children);
        }
        return null;
    }
}


export default withRouter(ScrollRestorer);
