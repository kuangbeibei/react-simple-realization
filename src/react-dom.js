import { REACT_CLASS_COMPONENT, REACT_FORWARDREF, REACT_TEXT } from "./constants";
import { addEvent } from "./event";

/**
 * using vdom to generate real dom
 * @param {*} vdom 
 * @param {*} container 
 */
export function render(vdom, container) {
    let realDom = createDom(vdom);
    container.appendChild(realDom)
}

export function createDom(vdom) {
    const {type, props, ref, key} = vdom;

    let dom;
    if (type === REACT_TEXT) {
        // render number or string
        dom = document.createTextNode(props);
    } else if (typeof type === 'function') {
        if (type.isReactComponent === REACT_CLASS_COMPONENT) {
            return mountClassComponent(vdom)
        } else {
            return mountFunctionComponent(vdom)
        }
    } else if (type && type.$$typeof === REACT_FORWARDREF) {
        return mountForwardRefComponnet(vdom);
    } else {
        // render html tags
        dom = document.createElement(type)
    }

    if (props) {
        updateProps(dom, {}, props);
        if (props.children) {
            if (typeof props.children === 'object' && props.children.$$typeof) {
                render(props.children, dom)
            } else if (Array.isArray(props.children)) {
                iterateRender(props.children, dom)
            }
        }
    }

    vdom.dom = dom;

    if (ref) {
        ref.current = dom;
    }

    return dom;
}

function mountForwardRefComponnet(vdom) {
    const {type, props, ref} = vdom;
    let renderVdom = type.render(props, ref);
    vdom.oldRenderVdom = renderVdom;
    return createDom(renderVdom);
}

function mountClassComponent(vdom) {
    const {type: ClassComponent, props, ref} = vdom;
    let componentInstance = new ClassComponent(props);

    if (ref) ref.current = componentInstance; // assign ref.current to class component instance

    const renderVdom = componentInstance.render();
    // componentInstance.olderRenderVdom -> for later use to dom diff
    // vdom -> for later use to find the real dom
    componentInstance.olderRenderVdom = vdom.olderRenderVdom = renderVdom;
    return createDom(renderVdom);
}

function mountFunctionComponent(vdom) {
    const {type, props} = vdom;
    // execute the function component, get the return vdom
    const returnVdom = type(props);
    vdom.olderRenderVdom = returnVdom;
    // iterate the return vdom to create real dom
    return createDom(returnVdom)
}

function iterateRender(childrenVdom, parentDom) {
    for (let i = 0, len = childrenVdom.length; i < len; i++) {
        render(childrenVdom[i], parentDom)
    }
}

function updateProps(dom, oldProps={}, newProps={}) {
    // create and update props
    for (const key in newProps) {
        if (key === 'children') continue;
        if (key === 'style') {
            let styleObj = newProps[key];
            for (const attr in styleObj) {
                dom.style[attr] = styleObj[attr];
            }
        } else if (/^on[A-Z]*/.test(key)) {
            let eventType = key.toLocaleLowerCase();
            addEvent(dom, eventType, newProps[key]);
        } else {
            dom[key] = newProps[key]
        }
    }

    // props in oldProps but not in newProps, delete them
    for (let key in oldProps) {
        if (!newProps.hasOwnProperty(key)) {
            delete dom[key]
        }
    }
}

/**
 * using vdom to find real dom
 * @param {*} vdom 
 * @returns 
 */
export function findDom(vdom) {
    if (!vdom) return null;
    if (vdom.dom) return vdom.dom;
    if (vdom.olderRenderVdom) {
        return findDom(vdom.olderRenderVdom)
    }
}

export function compareTwoVdom(oldDom, newVdom) {
    const newDom = createDom(newVdom);
    const parentDom = oldDom.parentNode;
    parentDom.replaceChild(newDom, oldDom)
}


export default {
    render
}