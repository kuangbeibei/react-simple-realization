
/**
 * 
 * @param {*} vdom 
 * @param {*} container 
 */
function render(vdom, container) {
    let actualDom = createDom(vdom);
    container.appendChild(actualDom)
}

function createDom(vdom) {
    const {type, props} = vdom;
}

export {
    render
}