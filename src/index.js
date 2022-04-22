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
 * synthetic event
 * batch update
 */
// class A extends React.Component {
//     constructor (props) {
//         super(props);
//         this.state = {
//             count: 0
//         }
//     }
//     handleClick = (e) => {
//         e.stopPropagation();
//         this.setState({
//             count: this.state.count + 1
//         });
//         console.log(111, this.state.count); // 0
//         this.setState({
//             count: this.state.count + 1
//         });
//         console.log(222, this.state.count); // 0

//         // this.setState({
//         //     count: 1
//         // });
//         // this.setState({
//         //     count: 1
//         // });
//         // this.setState({
//         //     count: 2
//         // });
//         setTimeout(() => {
//             console.log(333, this.state.count); // 1
//             this.setState({
//                 count: this.state.count + 1
//             });
//             console.log(444, this.state.count); // 2
//             this.setState({
//                 count: this.state.count + 1
//             });
//             console.log(555, this.state.count); // 3
//         }, 1000)
//     }
//     handleDivClick = () => {
//         console.log('handleDivClick');
//     }
//     render() {
//         console.log('render', this.state);
//         return <div onClick={this.handleDivClick}>
//              <h1 className="hi" style={{color: 'indianred'}}>{this.props.msg} | <span>{this.state.count}</span></h1>
//              <button onClick={this.handleClick}>click</button>
//         </div>
//     }
// }

// ReactDOM.render(<A msg="hello"/>, document.getElementById('root'))

/**
 * realize React.createRef()
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        this.refA = React.createRef();
        this.refB = React.createRef();
        this.result = React.createRef()
    }
    handleClick = () => {
        const inputA = this.refA.current.value;
        const inputB = this.refB.current.value;
        const resultAB = `${inputA}`+`${inputB}`;
        this.result.current.value = resultAB;
    }
    render() {
        return <div>
            <input ref={this.refA} /> 
            + 
            <input ref={this.refB}/> 
            <button onClick={this.handleClick}>
                =
            </button> 
            <input ref={this.result}/>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('root'))