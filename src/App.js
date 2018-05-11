import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Reactions from './fb_reactions/Reactions'
import Calculator from './calculator/Calculator'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">React Components</h1>
        </header>
        <div className="App-intro">
          <Reactions className="reactions"/>
          <Calculator className="calculator"/>
        </div>
      </div>
    );
  }
}

export default App;
