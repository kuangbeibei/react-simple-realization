import {REACT_ELEMENT} from "./constants";
import {toVdom} from "./utils"

/**
 * 
 * @param {*} type whether it is simple react element, or function component or class component
 * @param {*} config including style, className, custom prop, etc.
 * @param {*} children at the end of arguments, there will be no child, one child, or multiple children
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

function updateProps(config) {

}

export default {
    createElement
}