import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Fib from "./Fib";
import OtherPage from './OtherPage';

function App() {
  return (
    <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <Link to="/">Home</Link>
            <Link to="/otherpage">Other</Link>
          </header>
          <Routes>
            <Route exact path="/" element={<Fib />} />
            <Route path="/otherpage" element={<OtherPage />} />
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
