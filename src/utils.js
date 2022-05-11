import {REACT_ELEMENT, REACT_TEXT} from "./constants";

export function toVdom(element) {
    return typeof element === 'string' || typeof element === 'number' ? {
        $$typeof: REACT_ELEMENT,
        type: REACT_TEXT, 
        props: element
    } : element
}

export function shallowEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;
    let key1 = Object.keys(obj1);
    let key2 = Object.keys(obj2);
    if (key1.length !== key2.length) return false;
    for (let key of key1) {
        if (!obj2.hasOwnProperty(key) || obj2[key] !== obj1[key]) {
            return false
        }
    }
    return true;
}