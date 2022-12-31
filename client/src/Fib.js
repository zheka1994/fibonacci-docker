import React, { useEffect, useState } from "react";
import axios from "axios";

const Fib = () => {
    const [state, setState] = useState({
        seenIndexes: [],
        values: {}, 
        index: ""
    });


    async function fetchData() {
        const values = await fetchValues();
        const seenIndexes = await fetchIndexes();
        const newState = {...state, values: values.data, seenIndexes: seenIndexes.data};
        setState(newState);
    }

    async function fetchValues() {
        const values = await axios.get("/api/values/current");
        return values;
    };

    async function fetchIndexes() {
        const seenIndexes = await axios.get("/api/values/all");
        return seenIndexes;
    }

    function renderSeenIndexes() {
        return state.seenIndexes.map(({number}) => number).join(", ");
    }

    function renderValues() {
        const entries = [];

        for (let key in state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {state.values[key]}
                </div>
            )
        }

        return entries;
    }

    function handleChange(event) {
        const newState = {...state, index: event.target.value};
        setState(newState);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await axios.post("/api/values", {
            index: state.index
        });
        setState({...state, index: ""});
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchData();
    }, [state.index]);

    return (
        <div>
            <form>
                <label>Enter your index:</label>
                <input
                    value={state.index}
                    onChange={handleChange}/>
                <button onClick={handleSubmit}>Submit</button>
            </form>
            <h3>Indexes I have seen</h3>
            {renderSeenIndexes()}
            <h3>Calculated values</h3>
            {renderValues()}
        </div>
    )
};

export default Fib;