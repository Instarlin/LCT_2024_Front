import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Welcome from './pages/welcome/welcome.jsx';
import './App.css';

function App() {
  return (
  //   <Router>
  //   <nav>
  //     <ul>
  //       <li>
  //         <Link to="/">Home</Link>
  //       </li>
  //       <li>
  //         <Link to="/about">About</Link>
  //       </li>
  //       <li>
  //         <Link to="/contact">Contact</Link>
  //       </li>
  //     </ul>
  //   </nav>

  //   <Routes>
  //     <Route exact path="/" component={<Welcome/>} />
  //     {/* <Route path="/about" component={About} />
  //     <Route path="/contact" component={Contact} /> */}
  //   </Routes>
  // </Router>
  <Welcome/>
  );
}

export default App;
