import React, { Component } from "react";
import "./Calculator.css";

class Calculator extends Component {
  state = {
    expression: "0",
    waitingForOperand: false,
    operator: null,
    savedValue: null
  };

  onClickDigit = digit => {
    const { expression, waitingForOperand } = this.state;
    if (waitingForOperand) {
      this.setState({
        expression: String(digit),
        waitingForOperand: false
      });
    } else {
      this.setState({
        expression:
          expression === "0" ? String(digit) : expression + String(digit)
      });
    }
  };

  onClickDot = () => {
    const { expression, waitingForOperand } = this.state;
    if (waitingForOperand) {
      this.setState({
        expression: "0.",
        waitingForOperand: false
      });
    } else
      this.setState({
        expression:
          expression.indexOf(".") === -1 ? expression + "." : expression
      });
  };

  cleanExp = () => {
    this.setState({
      expression: "0",
      waitingForOperand: false,
      operator: null,
      savedValue: null
    });
  };

  onClickGST = () => {
    this.setState({
      expression: this.state.expression * 1.05
    });
  };
  onClickOperator = opr => {
    const { expression, savedValue, operator } = this.state;
    const operations = {
      "+": (prevVal, nextVal) => prevVal + nextVal,
      "-": (prevVal, nextVal) => prevVal - nextVal,
      "*": (prevVal, nextVal) => prevVal * nextVal,
      "/": (prevVal, nextVal) => prevVal / nextVal,
      "=": (prevVal, nextVal) => nextVal
    };
    if (savedValue == null) {
      this.setState({
        waitingForOperand: true,
        operator: opr,
        savedValue: parseFloat(expression)
      });
    } else {
      const computedVal = operations[operator](
        savedValue,
        parseFloat(expression)
      );
      this.setState({
        savedValue: computedVal,
        operator: opr,
        expression: String(computedVal),
        waitingForOperand: true
      });
    }
  };
  onClickBracket = bracket => {
    return;
  };
  render() {
    return (
      <div className="calculator">
        <div> {this.state.expression} </div>
        <div className="row">
          <button className="number" onClick={() => this.onClickDigit(1)}>
            1
          </button>
          <button className="number" onClick={() => this.onClickDigit(2)}>
            2
          </button>
          <button className="number" onClick={() => this.onClickDigit(3)}>
            3
          </button>
          <button className="number" onClick={() => this.onClickDigit(4)}>
            4
          </button>
          <button
            className="operator"
            onClick={() => this.onClickOperator("+")}
          >
            +
          </button>
        </div>
        <div className="row">
          <button className="number" onClick={() => this.onClickDigit(5)}>
            5
          </button>
          <button className="number" onClick={() => this.onClickDigit(6)}>
            6
          </button>
          <button className="number" onClick={() => this.onClickDigit(7)}>
            7
          </button>
          <button className="number" onClick={() => this.onClickDigit(8)}>
            8
          </button>
          <button
            className="operator"
            onClick={() => this.onClickOperator("-")}
          >
            -
          </button>
          <button className="special" onClick={() => this.onClickGST()}>
            GST
          </button>
        </div>
        <div className="row">
          <button className="operator" onClick={() => this.cleanExp()}>
            c
          </button>
          <button className="number" onClick={() => this.onClickDigit(0)}>
            0
          </button>
          <button className="number" onClick={() => this.onClickDigit(9)}>
            9
          </button>
          <button className="dot" onClick={() => this.onClickDot()}>
            .
          </button>
          <button
            className="operator"
            onClick={() => this.onClickOperator("*")}
          >
            &times;
          </button>
          <button
            className="operator"
            onClick={() => this.onClickOperator("/")}
          >
            &divide;
          </button>
          <button className="result" onClick={() => this.onClickOperator("=")}>
            =
          </button>
        </div>
      </div>
    );
  }
}

export default Calculator;
