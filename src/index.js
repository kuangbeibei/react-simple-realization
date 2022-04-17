import React from "./react";
import ReactDOM from "./react-dom";

/**
 * 1. simple html tags
 */
// const jsx = <h1 className="hi" style={{color: 'indianred'}}>hello <span>world</span></h1>;
// console.log('jsx:', jsx);

/**
 * 2. function component
 */
function App(props) {
    return <h1 className="hi" style={{color: 'indianred'}}>{props.msg} | <span>world</span></h1>
}
// const ele = <App msg="hello"/>;
// console.log('ele', ele);
ReactDOM.render(<App msg="hello"/>, document.getElementById('root'))