import { updateQueue } from "./Component";

export function addEvent(dom, eventType, eventHandler) {
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

    let syntheticEvent = {};
    for (const [key, value] in Object.entries(event)) {
        syntheticEvent[key] = value;
    }

    let currentTarget = target; 
    while (currentTarget.parentNode) {
        const {__store__: store} = currentTarget;
        const handler = store && store[eventType];
        handler && handler.call(currentTarget, syntheticEvent);
        currentTarget = currentTarget.parentNode;
    }

    updateQueue.batchUpdate();
}