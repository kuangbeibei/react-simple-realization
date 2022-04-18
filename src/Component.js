import {REACT_CLASS_COMPONENT} from "./constants";
import ReactDOM, { findDom } from "./react-dom";

class Updater {
    constructor(componentInstance) {
        this.componentInstance = componentInstance;
        this.pendingStates = [];
    }
    addState(partialState) {
        this.pendingStates.push(partialState);
        this.emitUpdate()
    }
    emitUpdate() {
        if(this.pendingStates.length) {
            let newState = this.getState();
            shouldUpdateComponent(this.componentInstance)
        }
    }
    getState() {
        let oldState = this.componentInstance.state;
        this.pendingStates.forEach(newState => {
            this.componentInstance.state = {
                ...oldState,
                ...newState
            } 
        })
        this.pendingStates.length = 0;
        return this.componentInstance.state
    }
}

function shouldUpdateComponent(componentInstance) {
    const oldVdom = componentInstance.olderRenderVdom;
    const newVdom = componentInstance.render();
    const dom = findDom(oldVdom);
    ReactDOM.render(newVdom, dom.parentNode)
}

export class Component {
    static isReactComponent = REACT_CLASS_COMPONENT;
    constructor(props) {
        this.props = props;
        this.updater = new Updater(this);
    }
    setState(partialState) {
        this.updater.addState(partialState)
    }
}
