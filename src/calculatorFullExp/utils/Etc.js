import React, { Component } from "react";

class Etc extends Component {
  render() {
    return (
      <input
        className="button"
        type="button"
        id={this.props.idAndVal}
        onClick={this.props.function}
        value={this.props.idAndVal}
      />
    );
  }
}
export default Etc;
