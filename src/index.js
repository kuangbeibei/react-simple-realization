import React from "./react";
import ReactDOM from "./react-dom";

/**
 * 1. simple html tags
 */
// const jsx = <h1 className="hi" style={{color: 'indianred'}}>hello <span>world</span></h1>;
// console.log('jsx:', jsx);
// ReactDOM.render(jsx, document.getElementById('root'))

/**
 * 2. function component
 */
// function Two(props) {
//     return <h1 className="hi" style={{color: 'indianred'}}>{props.msg} | <span>world</span> two </h1> 
// }
// function One(props) {
//     return <Two msg={props.msg}/>
// }
// ReactDOM.render(<One msg="hello"/>, document.getElementById('root'))

/**
 * 3. class component
 */
class A extends React.Component {
    constructor (props) {
        super(props)
    }
    render() {
        return <h1 className="hi" style={{color: 'indianred'}}>{this.props.msg} | <span>world</span> Class Component </h1>
    }
}

ReactDOM.render(<A msg="hello"/>, document.getElementById('root'))