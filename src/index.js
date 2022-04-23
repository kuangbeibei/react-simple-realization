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
//         // this.setState({
//         //     count: this.state.count + 1
//         // });
//         // console.log(111, this.state.count); // 0
//         // this.setState({
//         //     count: this.state.count + 1
//         // });
//         // console.log(222, this.state.count); // 0

//         // this.setState({
//         //     count: 1
//         // });
//         // this.setState({
//         //     count: 1
//         // });
//         // this.setState({
//         //     count: 2
//         // });
//         // setTimeout(() => {
//         //     console.log(333, this.state.count); // 1
//         //     this.setState({
//         //         count: this.state.count + 1
//         //     });
//         //     console.log(444, this.state.count); // 2
//         //     this.setState({
//         //         count: this.state.count + 1
//         //     });
//         //     console.log(555, this.state.count); // 3
//         // }, 1000)

//         this.setState((state) => ({
//             count: state.count + 1 
//         }), () => {
//             console.log('call in callback', this.state.count);
//         })
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

// class SubComp extends React.Component {
//     constructor(props) {
//         super(props)
//     }
//     SubCompMethod = () => {
//         console.log('i am sub com method');
//     }
//     render() {
//         return <div>i am sub component</div>
//     }
// }
// function SubComp2(props, ref) {
//     console.log('props~~~', props, 'ref~~~', ref);
//     return <div>i am sub component 2</div>
// };

// const ForwardSubComp2 = React.forwardRef(SubComp2);

// let sub;
// let sub2;

// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         this.refA = React.createRef();
//         this.refB = React.createRef();
//         this.result = React.createRef();
//         this.sub = React.createRef();
//         this.sub2 = React.createRef();
//         sub = this.sub;
//         sub2 = this.sub2;
//     }
//     handleClick = () => {
//         console.log('to check if sub equals this.sub: ', sub === this.sub);
//         // console.log('find method', this.sub.current.SubCompMethod);
//         const inputA = this.refA.current.value;
//         const inputB = this.refB.current.value;
//         const resultAB = `${inputA}`+`${inputB}`;
//         this.result.current.value = resultAB;
        
//     }
//     render() {
//         return <div>
//             <SubComp ref={this.sub}/>
//             <ForwardSubComp2 ref={this.sub2}/>
//             <input ref={this.refA} />
//             + 
//             <input ref={this.refB}/> 
//             <button onClick={this.handleClick}>
//                 =
//             </button> 
//             <input ref={this.result}/>
//         </div>
//     }
// }

// ReactDOM.render(<App />, document.getElementById('root'))

/**
 * realize lifecycle 1
 */

// class Child extends React.Component {
//     constructor(props) {
//         super(props);
//         console.log('Child Constructor');
//     }
//     UNSAFE_componentWillMount() {
//         console.log('Child will mount');
//     }
//     componentDidMount() {
//         console.log('child did mount');
//     }
//     UNSAFE_componentWillUpdate() {
//         console.log('child will update');
//     }
//     shouldComponentUpdate() {
//         console.log('child should update?');
//         return true
//     }
//     componentDidUpdate() {
//         console.log('child did update');
//     }
//     // componentWillUnMount() {
//     //     console.log('child will unmount');
//     // }
//     render() {
//         return <div>{this.props.count + 1}</div>
//     }
// }

class Parent extends React.Component {
    constructor(props) {
        super(props);
        console.log('parent constructor');
        this.state = {
            count: 0
        }
    }
    UNSAFE_componentWillMount() {
        console.log('parent will mount');
    }
    componentDidMount() {
        console.log('parent did mount');
    }
    UNSAFE_componentWillUpdate() {
        console.log('parent will update', this.state.count);
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('parent should update?');
        return nextState.count % 2 == 0
    }
    componentDidUpdate(newProps, newState) {
        console.log('parent did update', this.state.count);
        console.log('_________________');
    }
    handleClick = () => {
        this.setState(state => ({
            count: state.count + 1
        }), () => {
            // after componentDidMount
            console.log('state: ', this.state.count);
        })
    }
    render() {
        return <div>
            <div>{this.state.count}</div>
            <button onClick={this.handleClick}>+</button>
            {/* <Child count={this.state.count} /> */}
        </div>
    }
}

ReactDOM.render(<Parent />, document.getElementById('root'))