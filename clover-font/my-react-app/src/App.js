// src/App.js
import React from 'react';
import NavbarComponent from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Widgets from './components/Widgets';
import './App.css';

function App() {
  return (
    <div className="app">
      <NavbarComponent />
      <div className="app__body">
        <Sidebar />
        <Feed />
        <Widgets />
      </div>
    </div>
  );
}

export default App;
