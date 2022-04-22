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
    }
    addState(partialState) {
        this.pendingStates.push(partialState);
        this.emitUpdate()
    }
    emitUpdate() {
        // if (updateQueue.isBatchingUpdate) {
            updateQueue.updaters.add(this);
        // } else {
        //     this.updateComponent();
        // }
        queueMicrotask(updateQueue.batchUpdate) // always update in batch
    }
    updateComponent() {
        const {pendingStates, componentInstance} = this;
        if(pendingStates.length) {
            let newState = this.getState();
            shouldUpdateComponent(componentInstance, newState)
        }
        
    }
    getState() {
        const {componentInstance, pendingStates} = this;
        let {state} = componentInstance;
        pendingStates.forEach(nextState => {
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
    componentInstance.state = newState;
    componentInstance.forceUpdate();
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
    forceUpdate() {
        console.log('forceupdate');
        const oldRenderVdom = this.olderRenderVdom;
        const oldDom = findDom(oldRenderVdom);
        const newRenderVdom = this.render();
        // The code below is very very important! Because we upate state in browser, there is no type of class component, it is all about vdom. 
        // So, we have to manually connect vdom and dom, manually handle their relationship, or there will be misterious bugs.
        this.olderRenderVdom = newRenderVdom.oldRenderVdom = newRenderVdom;
        compareTwoVdom(oldDom, newRenderVdom);
    }
}
