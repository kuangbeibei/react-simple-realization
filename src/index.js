import React, {useState} from "./react";
import ReactDom from "./react-dom";

function Counter() {
    const [number, setNumber] = useState(10);
    const handleClick = () => {
        setNumber(number + 10);
    }
    return <button onClick={handleClick}>counter number: {number}</button>
}
function App() {
    const [state, setState] = React.useState(0);
    const handleClick = () => {
        setState(state + 1);
    }
    return <React.Fragment>
        <div>{state}</div>
        <button onClick={handleClick}>+</button>
        <Counter />
    </React.Fragment>
}

ReactDom.render(<App />, document.getElementById('root'))

