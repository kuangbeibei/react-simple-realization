import { REACT_CLASS_COMPONENT, REACT_TEXT } from "./constants";

/**
 * using vdom to generate real dom
 * @param {*} vdom 
 * @param {*} container 
 */
export function render(vdom, container) {
    let actualDom = createDom(vdom);
    container.appendChild(actualDom)
}

export function createDom(vdom) {
    const {type, props} = vdom;
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

    return dom;
}

function mountClassComponent(vdom) {
    const {type: ClassComponent, props} = vdom;
    let componentInstance = new ClassComponent(props);
    const renderVdom = componentInstance.render();
    componentInstance.olderRenderVdom = vdom.olderRenderVdom = renderVdom;
    return createDom(renderVdom);
}

function mountFunctionComponent(vdom) {
    const {type, props} = vdom;
    // execute the function component, get the return vdom
    const returnVdom = type(props);
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
            let eventName = key.toLocaleLowerCase();
            dom[eventName] = newProps[key];
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

export function findDom(vdom) {
    if (vdom.dom) return vdom.dom;
    if (vdom.olderRenderVdom) {
        return findDom(vdom.olderRenderVdom)
    }
}

export default {
    render
}