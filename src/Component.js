import {REACT_CLASS_COMPONENT} from "./constants";

export class Component {
    static isReactComponent = REACT_CLASS_COMPONENT;
    constructor(props) {
        this.props = props;
    }
}
