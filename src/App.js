import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Reactions from './fb_reactions/Reactions'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">React Components</h1>
        </header>
        <p className="App-intro">
          <Reactions/>
        </p>
      </div>
    );
  }
}

export default App;
