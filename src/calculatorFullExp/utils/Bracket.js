import React, { Component } from "react";

class Bracket extends Component {
  render() {
    return (
      <input
        className="button"
        type="button"
        id={this.props.idAndVal}
        onClick={this.props.bracketFn}
        value={this.props.idAndVal}
      />
    );
  }
}
export default Bracket;