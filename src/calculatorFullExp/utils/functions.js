export const operations = {
	'+': (prevVal, nextVal) => {
		return prevVal + nextVal;
	},
	'-': (prevVal, nextVal) => {
		return prevVal - nextVal;
	},
	'*': (prevVal, nextVal) => {
		return prevVal * nextVal;
	},
	'/': (prevVal, nextVal) => {
		return prevVal / nextVal;
	}
};

export const convertToProperOpr = (inputOpr) => {
	if (inputOpr === '÷') {
		return '/';
	}
	if (inputOpr === '×') {
		return '*';
	} else {
		return inputOpr;
	}
};
