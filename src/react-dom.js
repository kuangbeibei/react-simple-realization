import { REACT_CLASS_COMPONENT, REACT_FORWARDREF, REACT_TEXT, MOVE, PLACEMENT } from "./constants";
import { addEvent } from "./event";

/**
 * using vdom to generate real dom
 * @param {*} vdom 
 * @param {*} container 
 */
export function render(vdom, container) {
    let realDom = createDom(vdom);
    container.appendChild(realDom);
    if (realDom.componentDidMount) {
        realDom.componentDidMount()
    }
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

    if (typeof props === 'object') {
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
    vdom.componentInstance = componentInstance;

    if (ref) ref.current = componentInstance; // assign ref.current to class component instance
    

    // lifecycle - UNSAFE_componentWillMount
    if (componentInstance.UNSAFE_componentWillMount) {
        componentInstance.UNSAFE_componentWillMount()
    }
    const renderVdom = componentInstance.render();
    // componentInstance.olderRenderVdom -> for later use to dom diff
    // vdom -> for later use to find the real dom
    componentInstance.olderRenderVdom = vdom.olderRenderVdom = renderVdom;

    let dom = createDom(renderVdom);

    if (componentInstance.componentDidMount) {
        dom.componentDidMount = componentInstance.componentDidMount.bind(componentInstance);
    }

    return dom;
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
        let childVdom = childrenVdom[i];
        if (childVdom) {
            childVdom.mountIndex = i;
            render(childVdom, parentDom)
        }
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

export function compareTwoVdom(parentDom, oldVdom, newVdom) {
    if (!oldVdom && !newVdom) return null;
    if (oldVdom && !newVdom) return unMountVdom(oldVdom);
    if (!oldVdom && newVdom) {
        // create new dom
        const newDom = createDom(newVdom);
        // there is an obvious bug here, fix it later
        parentDom.appendChild(newDom); 
        if (newDom.componentDidMount) {
            newDom.componentDidMount()
        }
        return
    }
    if (oldVdom && newVdom) {
        if (oldVdom.type !== newVdom.type) {
            unMountVdom(oldVdom);
            let newDom = createDom(newVdom);
            // there is an obvious bug here, fix it later
            parentDom.appendChild(newDom);
            if (newDom.componentDidMount) {
                newDom.componentDidMount()
            }
            return
        } else if (oldVdom.type === newVdom.type) {
            // dom-diff situation
            updateElement(oldVdom, newVdom)
        }
    }
}

function updateElement(oldVdom, newVdom) {
    const {type} = oldVdom;
    if (type === REACT_TEXT) {
        let currentDom = newVdom.dom = findDom(oldVdom);
        if (oldVdom.props !== newVdom.props) {
            currentDom.textContent = newVdom.props;
        }
    } else if (typeof type === 'string') {
        let currentDom = newVdom.dom = findDom(oldVdom);
        updateProps(currentDom, oldVdom.props, newVdom.props);
        updateChildren(currentDom, oldVdom.props.children, newVdom.props.children);
    } else if (typeof type === 'function') {
        if (type.isReactComponent) {
            updateClassComponent(oldVdom, newVdom)
        } else {
            updateFunctionComponent(oldVdom, newVdom)
        }
    }
}

/**
 * update children nodes
 * @param {*} currentDom real old dom
 * @param {*} oldChildren children of old vdom 
 * @param {*} newChildren children of new vdom
 */
function updateChildren(parentDom, oldVChildren, newVChildren) {
    oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
    newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];

    // 1. build a map
    const keyedOldMap = {};
    let lastPlacedIndex = 0;
    oldVChildren.forEach((oldVChild, index) => {
        let oldChildKey = oldVChild && oldVChild.key ? oldVChild && oldVChild.key : index;
        keyedOldMap[oldChildKey] = oldVChild;
    })

    // 2. build patch
    const patch = [];
    newVChildren.forEach((newVChild, index) => {
        if (newVChild) {
            newVChild.mountIndex = index;
            let newChildKey = newVChild.key ? newVChild.key : index;
            let oldVChild = keyedOldMap[newChildKey];
            if (oldVChild) {
                updateElement(oldVChild, newVChild);
                if (oldVChild.mountIndex < lastPlacedIndex) {
                    patch.push({
                        type: MOVE,
                        oldVChild,
                        newVChild,
                        mountIndex: index
                    })
                }
                lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex);
                delete keyedOldMap[newChildKey];
            } else {
                patch.push({
                    type: PLACEMENT,
                    newVChild,
                    mountIndex: index
                })
            }
        }
    })

    // filter move actions in patch
    const moveVChildren = patch.filter(action => action.type === MOVE).map(action => action.oldVChild)

    Object.values(keyedOldMap).concat(moveVChildren).forEach(oldVchild => {
        let dom = findDom(oldVchild);
        if (dom) {
            unMountVdom(oldVchild);
            dom.remove();
        };
    })

    patch.forEach(action => {
        const {type, oldVChild, newVChild, mountIndex} = action;
        
        // real dom nodes
        const childNodes = parentDom.childNodes;

        if (type === PLACEMENT) {
            let newDom = createDom(newVChild);
            let childNode = childNodes[mountIndex];
            if (childNode) {
                parentDom.insertBefore(newDom, childNode)
            } else {
                parentDom.appendChild(newDom)
            }
            if (newDom.componentDidMount) {
                newDom.componentDidMount()
            }
        } else if (type === MOVE) {
            let oldDom = findDom(oldVChild);
            let childNode = childNodes[mountIndex];
            if (childNode) {
                parentDom.insertBefore(oldDom, childNode)
            } else {
                parentDom.appendChild(oldDom)
            }
        }
    })
}

function updateClassComponent(oldVdom, newVdom) {
    const componentInstance = newVdom.componentInstance = oldVdom.componentInstance;
    newVdom.olderRenderVdom = oldVdom.olderRenderVdom;

    if (componentInstance.UNSAFE_componentWillReceiveProps) {
        componentInstance.UNSAFE_componentWillReceiveProps(newVdom.props)
    }
    componentInstance.updater.emitUpdate(newVdom.props)
}

function updateFunctionComponent(oldVdom, newVdom) {
    let currentDom = findDom(oldVdom);
    if (!currentDom) return;
    let {type, props} = newVdom;
    let newRenderVdom = type(props);
    compareTwoVdom(currentDom.parentNode, oldVdom.oldRenderVdom, newRenderVdom);
    newRenderVdom.oldRenderVdom = newRenderVdom;
}

/**
 * unMount real dom iterately 
 * @param {*} oldVdom 
 */
function unMountVdom(oldVdom) {
    const {componentInstance, props, ref} = oldVdom;
    const currentDom = findDom(oldVdom);
    if (componentInstance.componentWillUnMount) {
        componentInstance.componentWillUnMount()
    }
    if (ref) ref.current = null;
    if (props.children) {
        let children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach(unMountVdom)
    }
    if (currentDom) currentDom.remove()
}


export default {
    render
}