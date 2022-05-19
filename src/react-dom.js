import { REACT_CLASS_COMPONENT, REACT_FORWARDREF, REACT_TEXT, MOVE, PLACEMENT, REACT_FRAGMENT, REACT_PROVIDER, REACT_CONTEXT, REACT_MEMO } from "./constants";
import { addEvent } from "./event";
import { shallowEqual } from "./utils";

let scheduleUpdate;
let hookIndex = 0;
let hookStates = [];

/**
 * using vdom to generate real dom
 * @param {*} vdom 
 * @param {*} container 
 */
export function render(vdom, container) {
    mount(vdom, container);
    scheduleUpdate = () => {
        hookIndex = 0;
        compareTwoVdom(container, vdom, vdom)
    }
}

export function mount(vdom, container) {
    let realDom = createDom(vdom);
    container.appendChild(realDom);
    if (realDom.componentDidMount) {
        realDom.componentDidMount()
    };
}

export function createDom(vdom) {
    const {type, props, ref, key} = vdom;

    let dom;
    if (type === REACT_TEXT) {
        // render number or string
        dom = document.createTextNode(props);
    } else if (type === REACT_FRAGMENT) {
        dom = document.createDocumentFragment();
    } else if (typeof type === 'function') {
        if (type.isReactComponent === REACT_CLASS_COMPONENT) {
            return mountClassComponent(vdom)
        } else {
            return mountFunctionComponent(vdom)
        }
    } else if (type && type.$$typeof === REACT_FORWARDREF) {
        return mountForwardRefComponnet(vdom);
    } else if (type && type.$$typeof === REACT_PROVIDER) {
        return mountProviderComponent(vdom)
    } else if (type && type.$$typeof === REACT_CONTEXT) {
        return mountContextComponent(vdom)
    } else if (type && type.$$typeof === REACT_MEMO) {
        return mountMemoComponent(vdom);
    } else {
        // render html tags
        dom = document.createElement(type)
    }
    if (typeof props === 'object') {
        updateProps(dom, {}, props);
        if (props.children) {
            if (typeof props.children === 'object' && props.children.$$typeof) {
                props.children.mountIndex = 0;
                mount(props.children, dom)
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

function mountMemoComponent(vdom) {
    const {type, props} = vdom;
    const renderVdom = type.type(props);
    vdom.oldRenderVdom = renderVdom;
    return createDom(renderVdom);
}

function mountProviderComponent(vdom) {
    const {type, props} = vdom;
    const context = type._context;
    const contextVAlue = props.value;
    context._currentValue = contextVAlue;
    let renderVdom = props.children;
    vdom.oldRenderVdom = renderVdom;
    return createDom(renderVdom);
}

function mountContextComponent(vdom) {
    const {type, props} = vdom;
    const context = type._context;
    const renderVdom = props.children(context._currentValue);
    vdom.oldRenderVdom = renderVdom;
    return createDom(renderVdom)
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

    // if class component has a static property called 'contextType'
    if (componentInstance.constructor.contextType) {
        componentInstance.context = componentInstance.constructor.contextType._currentValue;
    }

    if (ref) ref.current = componentInstance; // assign ref.current to class component instance
    

    // lifecycle - UNSAFE_componentWillMount
    if (componentInstance.UNSAFE_componentWillMount) {
        componentInstance.UNSAFE_componentWillMount()
    }
    const renderVdom = componentInstance.render();
    // componentInstance.oldRenderVdom -> for later use to dom diff
    // vdom -> for later use to find the real dom
    componentInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;

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
    vdom.oldRenderVdom = returnVdom;
    // iterate the return vdom to create real dom
    return createDom(returnVdom)
}

function iterateRender(childrenVdom, parentDom) {
    for (let i = 0, len = childrenVdom.length; i < len; i++) {
        let childVdom = childrenVdom[i];
        if (childVdom) {
            childVdom.mountIndex = i;
            mount(childVdom, parentDom)
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
    if (vdom.oldRenderVdom) {
        return findDom(vdom.oldRenderVdom)
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
    } else if (type === REACT_FRAGMENT) {
        const currentDom = newVdom.dom = findDom(oldVdom);
        updateChildren(currentDom, oldVdom.props.children, newVdom.props.children)
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
    } else if (type && type.$$typeof === REACT_PROVIDER) {
        updateProviderComponent(oldVdom, newVdom)
    } else if (type && type.$$typeof === REACT_CONTEXT) {
        updateContextComponent(oldVdom, newVdom)
    } else if (type && type.$$typeof === REACT_MEMO) {
        updateMemoComponent(oldVdom, newVdom);
    }
}

function updateMemoComponent(oldVdom, newVdom) {
    const {type: {compare}, props: prevProps} = oldVdom;
    const {props: nextProps} = newVdom;
    const compareFn = compare || shallowEqual;
    if (!compareFn(prevProps, nextProps)) {
        const currentDom = findDom(oldVdom);
        const renderVdom = newVdom.type.type(nextProps);
        compareTwoVdom(currentDom.parentNode, oldVdom.oldRenderVdom, renderVdom);
        newVdom.oldRenderVdom = renderVdom;
    } else {
        newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
    }
} 

function updateProviderComponent(oldVdom, newVdom) {
    const currentDom = findDom(oldVdom);
    const {type, props} = newVdom;
    const context = type._context;
    const contextVAlue = props.value;
    context._currentValue = contextVAlue;
    let renderVdom = props.children;
    compareTwoVdom(currentDom.parentNode, oldVdom.oldRenderVdom, renderVdom);
    newVdom.oldRenderVdom = renderVdom;
}

function updateContextComponent(oldVdom, newVdom) {
    const currentDom = findDom(oldVdom);
    const {type, props} = newVdom;
    const context = type._context;
    const renderVdom = props.children(context._currentValue);
    compareTwoVdom(currentDom.parentNode, oldVdom.oldRenderVdom, renderVdom);
    newVdom.oldRenderVdom = renderVdom;   
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
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom;

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
    newVdom.oldRenderVdom = newRenderVdom;
}

/**
 * unMount real dom iterately 
 * @param {*} oldVdom 
 */
function unMountVdom(oldVdom) {
    const {componentInstance, props, ref} = oldVdom;
    const currentDom = findDom(oldVdom);
    if (componentInstance && componentInstance.componentWillUnMount) {
        componentInstance.componentWillUnMount()
    }
    if (ref) ref.current = null;
    if (props.children) {
        let children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach(unMountVdom)
    }
    if (currentDom) currentDom.remove()
}

/**
 * 
 * @param {*} reducer 
 * @param {*} initialState 
 * @returns 
 */
export function useReducer(reducer, initialState) {
    hookStates[hookIndex] = hookStates[hookIndex] || initialState;
    const currentIndex = hookIndex;
    function dispatch(action) {
        const oldState = hookStates[currentIndex];
        if (reducer) {
            hookStates[currentIndex] = reducer(oldState, action);
        } else {
            hookStates[currentIndex] = typeof action === 'function' ? action(oldState) : action; // in the case of useState, type is the newState
        }
        scheduleUpdate();
    }

    return [hookStates[hookIndex++], dispatch]
}

/**
 * actually, useState is a syntactic sugar of useReducer
 * @param {*} initialState 
 * @returns 
 */
export function useState(initialState) {
    return useReducer(null, initialState)
}

/**
 * useState
 * @param {*} initialState 
 * @returns 
 * 
export function useState(initialState) {
    hookStates[hookIndex] = hookStates[hookIndex] || initialState;
    const currentIndex = hookIndex;
    function setState(nextState) {
        hookStates[currentIndex] = nextState;
        scheduleUpdate();
    };
    return [hookStates[hookIndex++], setState]
}
 */

export function useMemo(factory, deps) {
    if (hookStates[hookIndex]) {
        const [memoObj, oldDeps] = hookStates[hookIndex];
        const same = deps.every((item, index) => item === oldDeps[index]);
        if (same) {
            hookIndex++;
            return memoObj;
        } else {
            const newMemoObj = factory();
            hookStates[hookIndex++] = [newMemoObj, deps];
            return newMemoObj
        }
    } else {
        const newMemoObj = factory();
        hookStates[hookIndex++] = [newMemoObj, deps];
        return newMemoObj
    }
}

export function useCallback(callback, deps) {
    if (hookStates[hookIndex]) {
        const [oldCallback, oldDeps] = hookStates[hookIndex];
        const same = deps.every((item, index) => item === oldDeps[index]);
        if (same) {
            hookIndex++;
            return oldCallback;
        } else {
            hookStates[hookIndex++] = [callback, deps];
            return callback
        }
    } else {
        hookStates[hookIndex++] = [callback, deps];
        return callback
    }
}

export function useContext(context) {
    return context._currentValue
}

export function useEffect(factory, deps) {
    // debugger;
    const currentIndex = hookIndex;
    if (hookStates[hookIndex]) {
        const [destory, oldDeps] = hookStates[hookIndex];
        const same = deps && deps.every((item, index) => item === oldDeps[index]);
        if (same) {
            hookIndex++
        } else {
            destory && destory();
            setTimeout(() => {
                const destroy = factory();
                hookStates[currentIndex] = [destroy, deps];
            }, 0);
            hookIndex++
        }
    } else {
        setTimeout(() => {
            const destroy = factory();
            hookStates[currentIndex] = [destroy, deps];
        }, 0);
        hookIndex++;
    }
}

export function useRef() {
    hookStates[hookIndex] = hookStates[hookIndex] || {current: null};
    return hookStates[hookIndex++];
}

export function useImperativeHandle(ref, callback) {
    ref.current = callback()
}

export default {
    render,
    createPortal: render
}