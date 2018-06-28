import React, { Component } from "react";

class Digit extends Component {
  render() {
    return (
      <input
        type="button"
        id={this.props.idAndVal}
        onClick={this.props.digitFn}
        value={this.props.idAndVal}
      />
    );
  }
}
export default Digit;
