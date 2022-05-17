import React, {useState, useMemo, useCallback} from "./react";
import ReactDom from "./react-dom";

function Counter(props) {
    console.log('counter render');
    return <button onClick={props.handleClick}>counter number: {props.number.count}</button>
}

const MemoCounter = React.memo(Counter);

function App() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('kk');
    
    const handlechange = (e) => {
        console.log('e.target.value: ', e.target.value);
        setName(e.target.value);
    }

    const number = useMemo(() => ({count}), [count]);

    const handleClick = useCallback(() => {
        setCount(count + 1);
    }, [count]);

    return <React.Fragment>
        <div>{count}</div>
        <MemoCounter handleClick={handleClick} number={number}/>
        <input value={name} onChange={handlechange} />
    </React.Fragment>
}

ReactDom.render(<App />, document.getElementById('root'))

