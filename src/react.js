import {REACT_ELEMENT} from "./constants";
import {toVdom} from "./utils"

/**
 * 
 * @param {*} type simple react element, or function component or class component
 * @param {*} config including style, className, custom prop, etc.
 * @param {*} children added at the end of arguments, could be none, one child or multiple children
 * @returns 
 */
const createElement = function (type, config, children) {
    let key, ref,  props = {};

    for (const [key, value] of Object.entries(config)) {
        if ( key !== '__self' && key !== '__source') {
            props[key] = value
        }
    }

    if (arguments.length > 3) {
        props.children = Array.prototype.slice.call(arguments, 2).map(toVdom); // arguments is array-like data, and cannot use built-in functions in array.
    } else if (arguments.length === 3) {
        props.children = toVdom(children)
    }

    return {
        $$typeof: REACT_ELEMENT,
        type,
        props
    }
}

export default {
    createElement
}