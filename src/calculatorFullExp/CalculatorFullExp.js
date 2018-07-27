import React, { Component } from 'react';
import './CalculatorFullExp.css';
import HistoryList from './utils/HistoryList';
import Digit from './utils/Digit';
import Operator from './utils/Operator';
import Bracket from './utils/Bracket';
import Etc from './utils/Etc';
import { operations, convertToProperOpr } from './utils/functions';
import Display from './utils/Display';

class CalculatorFullExp extends Component {
	constructor(props) {
		super(props);
		this.history = new HistoryList();
		this.shouldSaveHistory = true;
		this.state = {
			expression: '0',
			waitingForOperand: true,
			bracket: 0,
			initialState: true,
			canDotGo: true,
			canOpenBr: true,
			operand: '',
			resultStatus: false,
			oprStack: [],
			postfixArr: []
		};
		this.addAnDigit = this.addAnDigit.bind(this);
		this.operator = this.operator.bind(this);
		this.bracket = this.bracket.bind(this);
		this.gst = this.gst.bind(this);
		this.cleanExp = this.cleanExp.bind(this);
		this.evaluate = this.evaluate.bind(this);
		this.undo = this.undo.bind(this);
		this.lastCharOfExp = () => {
			return String(this.state.expression).slice(-1);
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.shouldSaveHistory) {
			const prevStateHistory = JSON.parse(JSON.stringify(prevState));
			this.history.pushHistory(prevStateHistory);
		}
		this.shouldSaveHistory = true;
	}

	addAnDigit = (digit) => {
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
	};
	// add * if a digit is added after )
	digitHelper = (digit) => {
		const { expression, initialState } = this.state;
		if (initialState) return digit;
		if (this.lastCharOfExp() === ')') {
			this.pushIntoPostfixedArr('*');
			return expression + '×' + digit;
		} else {
			return String(expression) + digit;
		}
	};

	dot = () => {
		const { initialState, operand } = this.state;
		if (initialState) {
			this.setState({
				expression: '.',
				initialState: false,
				canDotGo: false,
				waitingForOperand: true,
				canOpenBr: false,
				operand: '.'
			});
		} else if (String(operand).indexOf('.') === -1) {
			this.setState({
				expression: this.dotHelper(),
				initialState: false,
				canDotGo: false,
				waitingForOperand: true,
				canOpenBr: false,
				operand: operand + '.'
			});
		}
	};
	dotHelper = () => {
		const { expression, canDotGo } = this.state;
		if (canDotGo) {
			if (this.lastCharOfExp() === ')') return expression + '×.';
			return expression + '.';
		}
		return expression;
	};

	operator = (opr) => {
		const { expression, waitingForOperand, operand } = this.state;
		if (waitingForOperand) return;
		if (operand !== '') {
			this.pushIntoPostfixedArr(operand);
		}
		this.pushIntoPostfixedArr(opr);
		this.setState({
			waitingForOperand: true,
			expression: expression + opr,
			operand: '',
			canDotGo: true,
			canOpenBr: true
		});
	};

	bracket = (inputBracket) => {
		const { bracket, waitingForOperand, canOpenBr, operand } = this.state;
		if (operand !== '') {
			this.pushIntoPostfixedArr(operand);
		}
		if (inputBracket === '(' && canOpenBr) {
			this.setState({
				bracket: bracket + 1,
				expression: this.openBracketHelper(),
				initialState: false,
				waitingForOperand: true,
				canDotGo: true,
				operand: ''
			});
		} else {
			if (!waitingForOperand && this.lastCharOfExp() !== '(')
				this.setState(() => {
					return {
						bracket: bracket > 0 ? bracket - 1 : bracket,
						expression: this.closeBracketHelper(),
						canDotGo: true,
						operand: ''
					};
				});
		}
	};
	openBracketHelper = () => {
		const { initialState, expression } = this.state;
		const shouldMultiplyGo =
			this.lastCharOfExp() <= 9 || this.lastCharOfExp() === ')';
		if (initialState) {
			this.pushIntoPostfixedArr('(');
			return '(';
		} else if (shouldMultiplyGo) {
			this.pushIntoPostfixedArr('*');
			this.pushIntoPostfixedArr('(');
			return expression + '×(';
		} else {
			this.pushIntoPostfixedArr('(');
			return expression + '(';
		}
	};
	closeBracketHelper = () => {
		const { bracket, expression } = this.state;
		if (bracket > 0) {
			this.pushIntoPostfixedArr(')');
			return expression + ')';
		} else return expression;
	};

	cleanExp = () => {
		this.history.empty();
		this.setState((prevState) => {
			return {
				expression: '0',
				waitingForOperand: true,
				bracket: 0,
				initialState: true,
				canDotGo: true,
				canOpenBr: true,
				operand: '',
				resultStatus: false,
				oprStack: [],
				postfixArr: []
			};
		});
		this.shouldSaveHistory = false;
	};

	gst = () => {
		if (this.state.resultStatus)
			this.setState({
				expression: this.expressionHelper(this.state.expression * 1.05)
			});
	};

	/** 
	 * when undo is clicked, go back to the lastHistory for each state
	 * !!! note : oprStack and postfixArr are updated at the same time
	 *            when operator is inserted.
	 *            Thus, when the undoing string is an operator
	 * 									the number in front of the operator is already
	 * 									in the postfixArr, so the operand is ''.
	*/
	undo = () => {
		const { oprStack, resultStatus, postfixArr } = this.state;
		const history = this.history.stateHistory;
		const index = history.length - 1;
		const lastHistory = history[index];
		const oprArr = ')(+-×÷';
		const isUndoingOpr = oprArr.indexOf(this.lastCharOfExp()) !== -1;
		const isOprInOprStack =
			convertToProperOpr(this.lastCharOfExp()) === String(oprStack).slice(-1);
		if (index >= 0 && !resultStatus) {
			this.setState((prevState) => {
				return {
					expression: lastHistory.expression,
					waitingForOperand: lastHistory.waitingForOperand,
					bracket: lastHistory.bracket,
					initialState: lastHistory.initialState,
					canDotGo: lastHistory.canDotGo,
					canOpenBr: lastHistory.canOpenBr,
					resultStatus: lastHistory.resultStatus
				};
			});
			if (isUndoingOpr) {
				this.setState((prevState) => {
					return {
						operand: '',
						oprStack: isOprInOprStack
							? oprStack.slice(0, -1)
							: lastHistory.oprStack,
						postfixArr: isOprInOprStack
							? lastHistory.postfixArr
							: postfixArr.slice(0, -1)
					};
				});
			} else {
				this.setState((prevState) => {
					return {
						operand: lastHistory.operand,
						oprStack: lastHistory.oprStack,
						postfixArr: lastHistory.postfixArr
					};
				});
			}
			history.length = index;
			this.shouldSaveHistory = false;
		}
	};

	/**
   * case1: input is a number
   * case2: input is an operator then,
   *        1. push on oprStack when the stack is empty or if the input is (
   *        2. input is ) and popdOpr is (, terminates an expression in a ()
   *        3. if the hierarchy of input is greater than popdOpr, 
	 *           push the input on the stack
   *        4. otherwise, enqueue operators into postfixArr
   */
	pushIntoPostfixedArr = (input) => {
		input = convertToProperOpr(input);
		const oprArr = ')(+-/*';
		const { postfixArr, oprStack } = this.state;
		if (oprArr.indexOf(input) === -1) {
			postfixArr.push(input);
		} else {
			while (true) {
				if (oprStack.length < 1 || input === '(') {
					oprStack.push(input);
					return;
				}
				var popdOpr = oprStack.pop();
				if (input === ')' && popdOpr === '(') return;
				if (oprArr.indexOf(popdOpr) < oprArr.indexOf(input)) {
					oprStack.push(popdOpr);
					oprStack.push(input);
					return;
				}
				if (popdOpr !== '(' && popdOpr !== ')') {
					postfixArr.push(popdOpr);
				}
			}
		}
	};

	/**
   * All open brackets have to be closed,
   * the end of expression is number,
   */
	evaluate = () => {
		const { bracket, operand, waitingForOperand, oprStack } = this.state;
		const shouldEvaluate =
			bracket === 0 &&
			!waitingForOperand &&
			this.lastCharOfExp() !== '.' &&
			this.state.postfixArr.length !== 0;
		if (shouldEvaluate) {
			if (operand !== '') {
				this.pushIntoPostfixedArr(operand);
			}
			this.cleanStack();
			this.setState({
				operand: ''
			});
			var curr, opr1, opr2, result;
			while (this.state.postfixArr.length !== 0) {
				curr = this.state.postfixArr.shift();
				if (!operations[curr]) {
					oprStack.push(curr);
				} else {
					opr1 = parseFloat(oprStack.pop());
					opr2 = parseFloat(oprStack.pop());
					result = operations[curr](opr2, opr1);
					oprStack.push(result);
				}
			}
			this.setState({
				expression: this.expressionHelper(result),
				waitingForOperand: false,
				initialState: false,
				canDotGo: true,
				canOpenBr: true,
				operand: result,
				resultStatus: true,
				oprStack: []
			});
		}
		return;
	};
	cleanStack = () => {
		const { oprStack, postfixArr } = this.state;
		while (oprStack.length !== 0) {
			var temp = oprStack.pop();
			if (temp !== '(' && temp !== ')') postfixArr.push(temp);
		}
	};
	/* shorthen the result to 2 decimal points */
	expressionHelper = (exp) => {
		var expression = String(exp);
		if (expression.indexOf('.') !== -1)
			return expression.substring(0, expression.indexOf('.') + 3);
		return expression;
	};

	render() {
		return (
			<div>
				<pre>{JSON.stringify(this.state, null, 2)}</pre>
				<Display value={this.state.expression} />
				<div className="row">
					<Digit digitFn={() => this.addAnDigit(1)} idAndVal="1" />
					<Digit digitFn={() => this.addAnDigit(2)} idAndVal="2" />
					<Digit digitFn={() => this.addAnDigit(3)} idAndVal="3" />
					<Digit digitFn={() => this.addAnDigit(4)} idAndVal="4" />
					<Operator oprFn={() => this.operator('+')} idAndVal="+" />
					<Bracket bracketFn={() => this.bracket('(')} idAndVal="(" />
					<Etc function={() => this.undo()} idAndVal="undo" />
				</div>
				<div className="row">
					<Digit digitFn={() => this.addAnDigit(5)} idAndVal="5" />
					<Digit digitFn={() => this.addAnDigit(6)} idAndVal="6" />
					<Digit digitFn={() => this.addAnDigit(7)} idAndVal="7" />
					<Digit digitFn={() => this.addAnDigit(8)} idAndVal="8" />
					<Operator oprFn={() => this.operator('-')} idAndVal="-" />
					<Bracket bracketFn={() => this.bracket(')')} idAndVal=")" />
					<Etc function={() => this.gst()} idAndVal="gst" />
				</div>
				<div className="row">
					<Etc function={() => this.cleanExp()} idAndVal="c" />
					<Digit digitFn={() => this.addAnDigit(0)} idAndVal="0" />
					<Digit digitFn={() => this.addAnDigit(9)} idAndVal="9" />
					<Etc function={() => this.dot()} idAndVal="." />
					<Operator oprFn={() => this.operator('×')} idAndVal="×" />
					<Operator oprFn={() => this.operator('÷')} idAndVal="÷" />
					<Etc function={() => this.evaluate()} idAndVal="=" />
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
