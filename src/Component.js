import {REACT_CLASS_COMPONENT} from "./constants";
import { findDom, compareTwoVdom } from "./react-dom";

export const updateQueue = {
    isBatchingUpdate: false,
    updaters: new Set(),
    batchUpdate: () => {
        updateQueue.isBatchingUpdate = false;
        updateQueue.updaters.forEach(updater => updater.updateComponent());
        updateQueue.updaters.clear();
    }
}

class Updater {
    constructor(componentInstance) {
        this.componentInstance = componentInstance;
        this.pendingStates = [];
        this.callbacks = [];
    }
    addState(partialState, callback) {
        this.pendingStates.push(partialState);
        if (callback) this.callbacks.push(callback);
        this.emitUpdate()
    }
    emitUpdate() {
        if (updateQueue.isBatchingUpdate) {
            updateQueue.updaters.add(this);
        } else {
            this.updateComponent();
        }
        // ^18.0.0
        // queueMicrotask(updateQueue.batchUpdate) // another way to setState, always batch update
    }
    updateComponent() {
        const {pendingStates, componentInstance, callbacks} = this;
        if(pendingStates.length) {
            let newState = this.getState();
            shouldUpdateComponent(componentInstance, newState);
            queueMicrotask(() => {
                if (callbacks.length) {
                    callbacks.forEach(cb => cb.call(this))
                };
                this.callbacks.length = 0;
            })
        }
        
    }
    getState() {
        const {componentInstance, pendingStates} = this;
        let {state} = componentInstance;
        pendingStates.forEach(nextState => {
            if (typeof nextState === 'function') {
                nextState = nextState(state)
            } 
            state = {
                ...state,
                ...nextState
            } 
        })
        pendingStates.length = 0;
        return state
    }
}

function shouldUpdateComponent(componentInstance, newState) {
    let willUpdate = true;

    if (componentInstance.shouldComponentUpdate 
        && 
        // now 'componentInstance.props' is the old props, after 'dom-diff', this part will be improved.
        !componentInstance.shouldComponentUpdate(componentInstance.props, newState)
    ) {
        willUpdate = false
    }

    if (componentInstance.UNSAFE_componentWillUpdate) {
        componentInstance.UNSAFE_componentWillUpdate()
    }

    componentInstance.state = newState;
    
    if (willUpdate) {
        componentInstance.forceUpdate();
        if (componentInstance.componentDidUpdate) {
            componentInstance.componentDidUpdate(componentInstance.props, newState)
        }
    }
}

export class Component {
    static isReactComponent = REACT_CLASS_COMPONENT;
    constructor(props) {
        this.props = props;
        this.updater = new Updater(this);
    }
    setState(partialState, callback) {
        this.updater.addState(partialState, callback);
    }
    forceUpdate() {
        const oldRenderVdom = this.olderRenderVdom;
        const oldDom = findDom(oldRenderVdom);
        const newRenderVdom = this.render();
        // The code below is very very important! Because we upate state in browser, there is no type of class component, it is all about vdom. 
        // So, we have to manually connect vdom and dom, manually handle their relationship, or there will be misterious bugs.
        this.olderRenderVdom = newRenderVdom.oldRenderVdom = newRenderVdom;
        compareTwoVdom(oldDom, newRenderVdom);
    }
}
