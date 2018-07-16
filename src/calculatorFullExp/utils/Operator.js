import React, { Component } from "react";

class Operator extends Component {
  render() {
    return (
      <input
        className="button"
        type="button"
        id={this.props.idAndVal}
        onClick={this.props.oprFn}
        value={this.props.idAndVal}
      />
    );
  }
}
export default Operator;
