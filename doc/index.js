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
 * realize lifecycle between father and son
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
//     UNSAFE_componentWillReceiveProps(nextProps) {
//         console.log('UNSAFE_componentWillReceiveProps: ', nextProps);
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
//     componentWillUnMount() {
//         console.log('child will unmount');
//     }
//     render() {
//         return <div>{this.props.count + 1}</div>
//     }
// }

// class Parent extends React.Component {
//     constructor(props) {
//         super(props);
//         console.log('parent constructor');
//         this.state = {
//             count: 0
//         }
//     }
//     UNSAFE_componentWillMount() {
//         console.log('parent will mount');
//     }
//     componentDidMount() {
//         console.log('parent did mount');
//     }
//     shouldComponentUpdate(nextProps, nextState) {
//         console.log('parent should update?');
//         return nextState.count % 2 == 0
//     }
//     UNSAFE_componentWillUpdate() {
//         console.log('parent will update', this.state.count);
//     }
//     componentDidUpdate(newProps, newState) {
//         console.log('parent did update', this.state.count);
//         console.log('_________________');
//     }
//     handleClick = () => {
//         this.setState(state => ({
//             count: state.count + 1
//         }), () => {
//             // after componentDidMount
//             console.log('state: ', this.state.count);
//         })
//     }
//     render() {
//         return <div>
//             <div>{this.state.count}</div>
//             <button onClick={this.handleClick}>+</button>
//             {
//                 this.state.count === 2 ? <Child count={this.state.count} /> : null
//             }
//         </div>
//     }
// }

// ReactDOM.render(<Parent />, document.getElementById('root'))

/**
 * dom-diff example
 */
// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             list: ['A', 'B', 'C', 'D', 'E', 'F']
//         }
//     }
//     handleClick = () => {
//         this.setState({
//             list: ['A', 'C', 'E', 'B', 'G']
//         })
//     }
//     render () {
//         return <React.Fragment>
//             <ul>
//                 {
//                     this.state.list.map(item => <li key={item}>{item}</li>)
//                 }
//             </ul>
//             <button onClick={this.handleClick}>change</button>
//         </React.Fragment>
//     }
// }

// ReactDOM.render(<App />, document.getElementById('root'))

/**
 * new lifecycle method: 
 * static method: getDerivedStateFromProps (instead of UNSAFE_componentWillReceiveProps)
 */
// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             count: 0
//         }
//     }
//     handleClick = () => {
//         this.setState({
//             count: this.state.count + 1
//         })
//     }
//     render() {
//         return <React.Fragment>
//             <div>{this.state.count}</div>
//             <button onClick={this.handleClick}>+</button>
//             <SubApp count={this.state.count}/>
//         </React.Fragment>
//     }
// }

// class SubApp extends React.Component {
//     state = {
//         number: 0
//     }
//     static getDerivedStateFromProps(nextProps, nextState) {
//         return {
//             number: nextProps.count * 2
//         }
//     }
//     render () {
//         return  <div>sub App: {this.state.number}</div>
//     }
// }

// ReactDOM.render(<App />, document.getElementById('root'))

/**
 * new lifecycle method:
 * prototype method: getSnapshotBeforeUpdate
 */
// class ScrollList extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             message: []
//         }
//         this.container = React.createRef()
//     }
//     get wrapper () {
//         return this.container.current;
//     }
//     componentDidMount() {
//         this.timerId = setInterval(() => {
//             this.setState({
//                 message: [`${this.state.message.length}`, ...this.state.message]
//             })
//         }, 1000)
//     }
//     componentWillUnMount () {
//         clearInterval(this.timerId);
//         this.timerId = null;
//     }
//     getSnapshotBeforeUpdate() {
//         // console.log('getSnapshotBeforeUpdate:', this.wrapper.scrollTop,  this.wrapper.scrollHeight);
//         return {
//             prevScrollTop: this.wrapper.scrollTop,
//             prevScrollHeight: this.wrapper.scrollHeight
//         }
//     }
//     componentDidUpdate(nextProps, nextState, {prevScrollTop, prevScrollHeight}) {
//         console.log('prevScrollTop, prevScrollHeight', this.container.current.scrollHeight, prevScrollHeight);
//         this.container.current.scrollTop = prevScrollTop + (this.wrapper.scrollHeight - prevScrollHeight)
//     }
//     render () {
//         return <ul style={{
//                 width: '200px',
//                 height: '180px',
//                 border: '1px solid indianred',
//                 overflow: 'auto',
//                 fontSize: '30px'
//             }}
//             ref={this.container}
//         >
//             {
//                 this.state.message.map((item, index) => <li key={index}>{item}</li>)
//             }
//         </ul>
//     }
// }
// ReactDOM.render(<ScrollList />, document.getElementById('root'))


/**
 * Context
 * Provider
 * Consumer
 */
// const ColorContext = React.createContext();

// const style = {
//     marginLeft: '20px',
//     marginTop: '5px',
//     width: '200px',
//     height: '70px',
// }

// class Header extends React.Component {
//     static contextType = ColorContext
//     constructor(props) {
//         super(props)
//     }
//     render() {
//         return <div style={{
//             ...style,
//             border: `1px solid ${this.context.color}`
//         }}>
//             Header
//             <button onClick={() => this.context.changeColor('orange')}>change</button>
//         </div>
//     }
// }

// function Content () {
//     return <ColorContext.Consumer>
//         {
//             (contextValue) => {
//                 return <div style={{
//                     ...style,
//                      border: `1px solid ${contextValue.color}`
//                  }}>
//                      Content
//                      <button onClick={() => contextValue.changeColor('blue')}>change</button>
//                  </div>
//             }
//         }
//     </ColorContext.Consumer>
// }


// class App extends React.Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             color: 'yellow'
//         }
//     }
//     changeColor = (color) => {
//         this.setState({
//             color
//         })
//     }
//     render() {
//         const contextValue = {
//             color: this.state.color,
//             changeColor: this.changeColor
//         }
//         return <ColorContext.Provider value={contextValue}>
//             <div style={{
//                 width: '300px',
//                 height: '180px',
//                 border: `1px solid ${this.state.color}`
//             }}>
//                 Panel
//                 <button onClick={() => this.changeColor('yellow')}>reset</button>
//                 <Header />
//                 <Content />
//             </div>
//         </ColorContext.Provider>
//     }
// }

// ReactDOM.render(<App />, document.getElementById('root'));

/**
 * React.cloneElement
 */
// class ButtonLibrary extends React.Component {
//     constructor(props) {
//         super(props)
//     }
//     componentDidMount() {
//         console.log('button library did mount');
//     }
//     render() {
//         return <button><span>ll button library {`${this.props.count}`}</span></button>
//     }
// }

// const processButton = OldButtonComponent => {
//     return class MyButton extends ButtonLibrary {
//         constructor(props) {
//             super(props);
//             this.state = {
//                 count: 0
//             }
//         }
//         componentDidMound() {
//             console.log('mybutton component did mount');
//             super.componentDidMount()
//         }
//         handleClick = () => {
//             this.setState({
//                 count: this.state.count + 1
//             })
//         }
//         render() {
//             console.log('mybutton render');
//             const buttonLibrary = super.render();
//             const newProps = {
//                 ...buttonLibrary.props,
//                 ...this.props,
//                 onClick: this.handleClick
//             }
//             console.log('buttonLibrary~~~', buttonLibrary);
//             const result = React.cloneElement(buttonLibrary, newProps, this.state.count);
//             console.log('result~~~', result);
//             return result;
//         }
//     }
// }

// const MyButton = processButton(ButtonLibrary)

// ReactDOM.render(<MyButton />, document.getElementById('root'));


/**
 * React.PureComponent
 * React.memo
 */

class Counter extends React.PureComponent {
    render() {
        console.log('counter render~~');
        return <div>{this.props.count}</div>
    }
}

function AnotherCounter(props) {
    console.log('another counter render');
    return <div>{props.count}</div>
}

const MemoAnotherCounter = React.memo(AnotherCounter);
console.log('MemoAnotherCounter',MemoAnotherCounter);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            count: 0
        }
    }
    handleClick = () => {
        this.setState({
            count: this.state.count + parseInt(this.inputRef.current.value)
        })
    }
    render() {
        return <React.Fragment>
            <MemoAnotherCounter count={this.state.count}/>
            <Counter count={this.state.count}/>
            <input ref={this.inputRef} defaultValue={0}/>
            <button onClick={this.handleClick}>+</button>
        </React.Fragment>
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
