import {REACT_ELEMENT, REACT_FORWARDREF, REACT_FRAGMENT, REACT_PROVIDER, REACT_CONTEXT} from "./constants";
import {toVdom} from "./utils"
import { Component } from "./Component";

/**
 * 
 * @param {*} type simple react element, or function component or class component
 * @param {*} config including style, className, custom prop, etc.
 * @param {*} children added at the end of arguments, could be none, one child or multiple children
 * @returns 
 */
const createElement = function (type, config, children) {
    let key, ref, props = {};

    if (config.ref) {
        ref = config.ref;
        key = config.key;
        delete config.ref;
        delete config.key; // used for dom-diff
        delete config.__self;
        delete config.__source;
    }

    props = {...config}

    if (arguments.length > 3) {
        props.children = Array.prototype.slice.call(arguments, 2).map(toVdom); // arguments is array-like data, and cannot use built-in functions in array.
    } else if (arguments.length === 3) {
        props.children = toVdom(children)
    }

    return {
        $$typeof: REACT_ELEMENT,
        type,
        props,
        ref, 
        key
    }
}

function createRef() {
    return {
        current: null
    }
}

function forwardRef(functionComponent) {
    return {
        $$typeof: REACT_FORWARDREF,
        render: functionComponent
    }
}

function createContext() {
    const context = {
        $$typeof: REACT_CONTEXT,
        _currentValue: undefined,
    }
    context.Provider = {
        $$typeof: REACT_PROVIDER,
        _context: context
    }
    context.Consumer = {
        $$typeof: REACT_CONTEXT,
        _context: context
    }
    return context
}

function cloneElement(element, newProps, ...newChildren) {
    let children = newChildren.length === 1 ? toVdom(newChildren[0]) : newChildren.map(toVdom);
 
    const props = {
        ...element.props,
        ...newProps,
        children
    };

    return {
        ...element,
        props
    }
}

export default {
    createElement,
    Component,
    createRef,
    forwardRef,
    Fragment: REACT_FRAGMENT,
    createContext,
    cloneElement
}