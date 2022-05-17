import React, {useState, useMemo, useCallback, useReducer} from "./react";
import ReactDom from "./react-dom";

/**
 * useState, useMemo, useCallback
 */
// function Counter(props) {
//     console.log('counter render');
//     return <button onClick={props.handleClick}>counter number: {props.number.count}</button>
// }

// const MemoCounter = React.memo(Counter);

// function App() {
//     const [count, setCount] = useState(0);
//     const [name, setName] = useState('kk');
    
//     const handlechange = (e) => {
//         console.log('e.target.value: ', e.target.value);
//         setName(e.target.value);
//     }

//     const number = useMemo(() => ({count}), [count]);

//     const handleClick = useCallback(() => {
//         setCount(count + 1);
//     }, [count]);

//     return <React.Fragment>
//         <div>{count}</div>
//         <MemoCounter handleClick={handleClick} number={number}/>
//         <input value={name} onChange={handlechange} />
//     </React.Fragment>
// }

// ReactDom.render(<App />, document.getElementById('root'))


/**
 * useReducer
 */
const ADD = 'ADD';
const MINUS = 'MINUS';

function reducer(state, action) {
    switch (action.type) {
        case ADD:
            return {number: state.number + 1}
        case MINUS:
            return {number: state.number - 1};
        default:
            return state
    }

}

function App() {
    const [val1, setVal1] = useState(10);
    const [state, dispatch] = useReducer(reducer, {number: 0})
    return <React.Fragment>
        
        <div>{state.number}</div>
        <button onClick={() => dispatch({type: ADD})}>+</button>
        <button onClick={() => dispatch({type: MINUS})}>-</button>
        <div>{val1}</div>
        <button onClick={() => setVal1(val1 + 10)}>set val1</button>
    </React.Fragment>
}

ReactDom.render(<App />, document.getElementById('root'))

