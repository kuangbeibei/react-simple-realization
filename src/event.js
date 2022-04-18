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
    const {__store__: store} = target;
    const handler = store[eventType];

    let syntheticEvent = {};
    for (const [key, value] in Object.entries(event)) {
        syntheticEvent[key] = value;
    }

    handler && handler.call(target, syntheticEvent);

    updateQueue.batchUpdate();
}