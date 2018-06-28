import React, { Component } from "react";
import "./CalculatorFullExp.css";
import Queue from "./Queue";
import Digit from "./utils/Digit";
import Operator from "./utils/Operator";
import Bracket from "./utils/Bracket";
import Etc from "./utils/Etc";

class CalculatorFullExp extends Component {
  constructor(props) {
    super(props);
    this.oprStack = [];
    this.expressionArr = [];
    this.postfixArr = new Queue();
    this.state = {
      expression: "0",
      waitingForOperand: true,
      bracket: 0,
      initialState: true,
      canDotGo: true,
      canOpenBr: true,
      operand: "",
      resultStatus: false
    };
    this.addAnDigit = this.addAnDigit.bind(this);
    this.operator = this.operator.bind(this);
    this.bracket = this.bracket.bind(this);
    this.gst = this.gst.bind(this);
    this.wrap = this.wrap.bind(this);
    this.cleanExp = this.cleanExp.bind(this);
    this.eval = this.eval.bind(this);
  }

  addAnDigit(digit) {
    const { operand } = this.state;
    this.setState({
      expression: this.digitHelper(digit),
      waitingForOperand: false,
      initialState: false,
      canDotGo: true,
      canOpenBr: true,
      operand: String(operand) + digit,
      resultStatus: false
    });
  }

  /* add * if a digit is added after ) */
  digitHelper(digit) {
    const { expression, initialState } = this.state;
    if (initialState) {
      return digit;
    } else if (String(expression).slice(-2) === ") ") {
      this.expressionArr.push("*");
      this.pushIntoPostfixedArr("*");
      return expression + " * " + digit;
    } else {
      return String(expression) + digit;
    }
  }
  dot = () => {
    const { expression, initialState, canDotGo, operand } = this.state;
    if (initialState) {
      this.setState({
        expression: ".",
        operand: ".",
        initialState: false,
        canDotGo: false,
        waitingForOperand: true,
        canOpenBr: false
      });
    } else if (String(operand).indexOf(".") === -1) {
      this.setState({
        expression: canDotGo ? expression + "." : expression,
        initialState: false,
        canDotGo: false,
        waitingForOperand: true,
        canOpenBr: false,
        operand: operand + "."
      });
    }
  };

  operator = opr => {
    const { expression, waitingForOperand, operand } = this.state;
    if (waitingForOperand) {
      return;
    } else {
      if (operand !== "") {
        this.expressionArr.push(operand);
        this.pushIntoPostfixedArr(operand);
      }
      this.expressionArr.push(opr);
      this.pushIntoPostfixedArr(opr);
      this.setState({
        waitingForOperand: true,
        expression: expression + " " + opr + " ",
        operand: "",
        canDotGo: true,
        canOpenBr: true
      });
    }
  };

  bracket = inputBracket => {
    const {
      bracket,
      expression,
      waitingForOperand,
      canOpenBr,
      operand
    } = this.state;
    if (operand !== "") {
      this.expressionArr.push(operand);
      this.pushIntoPostfixedArr(operand);
    }
    if (inputBracket === "(" && canOpenBr) {
      this.setState({
        bracket: bracket + 1,
        expression: this.openBracketHelper(),
        initialState: false,
        waitingForOperand: true,
        canDotGo: true,
        operand: ""
      });
    } else {
      this.setState(() => {
        if (!waitingForOperand && String(expression).slice(-1) !== "(") {
          return {
            bracket: bracket > 0 ? bracket - 1 : bracket,
            expression: this.closeBracketHelper(),
            canDotGo: false,
            operand: ""
          };
        }
      });
    }
  };

  openBracketHelper() {
    const { initialState, expression } = this.state;
    if (initialState) {
      this.expressionArr.push("(");
      this.pushIntoPostfixedArr("(");
      return " ( ";
    } else if (
      String(expression).slice(-1) !== " " ||
      String(expression).slice(-2) === " ) "
    ) {
      this.expressionArr.push("*");
      this.expressionArr.push("(");
      this.pushIntoPostfixedArr("*");
      this.pushIntoPostfixedArr("(");
      return expression + " * ( ";
    } else {
      this.expressionArr.push("(");
      this.pushIntoPostfixedArr("(");
      return expression + " ( ";
    }
  }

  closeBracketHelper() {
    const { bracket, expression } = this.state;
    if (bracket > 0) {
      this.expressionArr.push(")");
      this.pushIntoPostfixedArr(")");
      return expression + " ) ";
    } else return expression;
  }

  cleanExp = () => {
    this.expressionArr.length = 0;
    this.expressionArr.length = 0;
    this.postfixArr.empty();
    this.oprStack.length = 0;
    this.setState({
      expression: "0",
      waitingForOperand: true,
      bracket: 0,
      initialState: true,
      canDotGo: true,
      canOpenBr: true,
      operand: "",
      resultStatus: false
    });
  };

  gst = () => {
    const expression = this.state;
    var lastChar = parseFloat(String(expression).slice(-1));
    if (typeof lastChar === "number")
      this.setState({
        expression: this.expressionHelper(this.state.expression * 1.05)
      });
  };

  // get rid of this
  wrap = () => {
    const { expression, bracket } = this.state;
    if (bracket === 0) {
      this.expressionArr.unshift("(");
      this.expressionArr.push(")");
      // this.postfixArr.unshift("(");
      // this.postfixArr.push(")");
      this.setState({
        expression: "( " + expression + " )",
        canDotGo: false,
        operand: ""
      });
    }
  };

  delete = () => {
    this.setState(prevState => ({
      expression: prevState.expression,
      waitingForOperand: prevState.waitingForOperand,
      bracket: prevState.bracket,
      initialState: prevState.initialState,
      canDotGo: prevState.canDotGo,
      canOpenBr: prevState.canOpenBr,
      operand: prevState.operand
    }));
  };

  /**
   * case1: input is a number
   * case2: input is an operator then,
   *        1. push on oprStack when the stack is empty or if the input is (
   *        2. input is ) and popdOpr is (, terminates ax expression in a ()
   *        3. if the hierarchy of input is greater than popdOpr, push the input on the stack
   *        4. otherwise, enqueue operators into postfixArr
   */
  pushIntoPostfixedArr(input) {
    const oprArr = ")(+-/*";
    const { postfixArr, oprStack } = this;
    if (oprArr.indexOf(input) === -1) {
      postfixArr.enq(input);
    } else {
      while (true) {
        if (oprStack.length < 1 || input === "(") {
          oprStack.push(input);
          return;
        }
        var popdOpr = oprStack.pop();
        if (input === ")" && popdOpr === "(") return;
        if (oprArr.indexOf(popdOpr) < oprArr.indexOf(input)) {
          oprStack.push(popdOpr);
          oprStack.push(input);
          return;
        }
        if (popdOpr !== "(" && popdOpr !== ")") {
          postfixArr.enq(popdOpr);
        }
      }
    }
  }

  /**
   * All open brackets have to be closed,
   * the end of expression is number,
   *
   */
  eval = () => {
    const operations = {
      "+": (prevVal, nextVal) => {
        return prevVal + nextVal;
      },
      "-": (prevVal, nextVal) => {
        return prevVal - nextVal;
      },
      "*": (prevVal, nextVal) => {
        return prevVal * nextVal;
      },
      "/": (prevVal, nextVal) => {
        return prevVal / nextVal;
      }
    };
    const { bracket, expression, operand, waitingForOperand } = this.state;
    if (
      bracket !== 0 ||
      waitingForOperand ||
      String(expression).slice(-1) === "." ||
      this.oprStack.length === 0
    ) {
      return;
    }
    if (operand !== "") {
      this.expressionArr.push(operand);
      this.pushIntoPostfixedArr(operand);
    }
    this.cleanStack();
    this.setState({
      operand: ""
    });
    this.oprStack.length = 0;
    var curr, opr1, opr2, result;
    while (this.postfixArr.q.length !== 0) {
      curr = this.postfixArr.deq();
      if (!operations[curr]) {
        this.oprStack.push(curr);
      } else {
        opr1 = parseFloat(this.oprStack.pop());
        opr2 = parseFloat(this.oprStack.pop());
        result = operations[curr](opr2, opr1);
        this.oprStack.push(result);
      }
    }
    this.setState(
      {
        expression: this.expressionHelper(result),
        waitingForOperand: false,
        initialState: false,
        canDotGo: true,
        canOpenBr: true,
        operand: result,
        resultStatus: true
      },
      () => this.setArrs(result)
    );
  };

  setArrs = res => {
    this.expressionArr.length = 0;
    this.expressionArr.push(res);
    //this.postfixArr.length = 0;
    //this.postfixArr.enq(res);
    this.oprStack.length = 0;
  };

  cleanStack() {
    while (this.oprStack.length !== 0) {
      var temp = this.oprStack.pop();
      if (temp !== "(" && temp !== ")") this.postfixArr.enq(temp);
    }
  }

  /* shorthen the result to 2 decimal points */
  expressionHelper(exp) {
    var StrExp = String(exp);
    if (StrExp.indexOf(".") !== -1) {
      return StrExp.substring(0, StrExp.indexOf(".") + 3);
    }
    return StrExp;
  }

  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        <pre>oprStack = {JSON.stringify(this.oprStack, null, 2)}</pre>
        <pre>expressionArr = {JSON.stringify(this.expressionArr, null, 2)}</pre>
        <pre>postfixArr = {JSON.stringify(this.postfixArr, null, 2)}</pre>
        <div className="display">{this.state.expression}</div>
        <div className="row">
          <Digit digitFn={() => this.addAnDigit(1)} idAndVal="1" />
          <Digit digitFn={() => this.addAnDigit(2)} idAndVal="2" />
          <Digit digitFn={() => this.addAnDigit(3)} idAndVal="3" />
          <Digit digitFn={() => this.addAnDigit(4)} idAndVal="4" />
          <Operator oprFn={() => this.operator("+")} idAndVal="+" />
          <Bracket bracketFn={() => this.bracket("(")} idAndVal="(" />
          <Etc function={() => this.wrap()} idAndVal="wrap" />
          <Etc function={() => this.delete()} idAndVal="<" />
        </div>
        <div className="row">
          <Digit digitFn={() => this.addAnDigit(5)} idAndVal="5" />
          <Digit digitFn={() => this.addAnDigit(6)} idAndVal="6" />
          <Digit digitFn={() => this.addAnDigit(7)} idAndVal="7" />
          <Digit digitFn={() => this.addAnDigit(8)} idAndVal="8" />
          <Operator oprFn={() => this.operator("-")} idAndVal="-" />
          <Bracket bracketFn={() => this.bracket(")")} idAndVal=")" />
          <Etc function={() => this.gst()} idAndVal="gst" />
        </div>
        <div className="row">
          <Etc function={() => this.cleanExp()} idAndVal="c" />
          <Digit digitFn={() => this.addAnDigit(0)} idAndVal="0" />
          <Digit digitFn={() => this.addAnDigit(9)} idAndVal="9" />
          <Etc function={() => this.dot()} idAndVal="." />
          <Operator oprFn={() => this.operator("*")} idAndVal="×" />
          <Operator oprFn={() => this.operator("/")} idAndVal="÷" />
          <Etc function={() => this.eval()} idAndVal="=" />
        </div>
        <p>
          <br />
          <br />
          <br />
          <br />
        </p>
      </div>
    );
  }
}

export default CalculatorFullExp;
