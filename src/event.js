import { updateQueue } from "./Component";

export function addEvent(dom, eventType, eventHandler) {
    // debugger;
    let store = dom.__store__ ||( dom.__store__ = {});
    store[eventType] = eventHandler;
    if (!document[eventType]) {
        // AOP
        document[eventType] = dispatchEvent; 
    }
}

/**
 * delegate event to the document node
 * @param {*} event 
 */
function dispatchEvent(event) {
    updateQueue.isBatchingUpdate = true;

    const {target, type} = event;
    const eventType = `on${type}`;

    let syntheticEvent = createSyntheticEvent(event);

    let currentTarget = target; 
    while (currentTarget.parentNode) {
        syntheticEvent.currentTarget = currentTarget;
        if (syntheticEvent.isPropagationStopped) {
            syntheticEvent.isPropagationStopped = false;
            break;
        }
        const {__store__: store} = currentTarget;
        const handler = store && store[eventType];
        handler && handler.call(currentTarget, syntheticEvent);
        currentTarget = currentTarget.parentNode;
    }

    updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
    let syntheticEvent = {};
    for (let key in nativeEvent) {
        const value = nativeEvent[key];
        if (typeof value === 'function') {
            syntheticEvent[key] = value.bind(nativeEvent);
        } else {
            syntheticEvent[key] = value;
        }
    }
    
    syntheticEvent.nativeEvent = nativeEvent;
    syntheticEvent.isPropagationStopped = false;
    syntheticEvent.isDefaultPrevented = false;
    syntheticEvent.preventDefault = preventDefault;
    syntheticEvent.stopPropagation = stopPropagation;
    return syntheticEvent;
}

function stopPropagation() {
    this.isPropagationStopped = true;
    let nativeEvent = this.nativeEvent;
    if (nativeEvent.stopPropagation) {
        nativeEvent.stopPropagation()
    } else {
        nativeEvent.cancelBubble = true
    }
}

function preventDefault() {
    this.isDefaultPrevented = true;
    let nativeEvent = this.nativeEvent;
    if (nativeEvent.preventDefault) {
        nativeEvent.preventDefault()
    } else {
        nativeEvent.returnValue = false;
    }
}