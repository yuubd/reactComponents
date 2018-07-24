import React from 'react';

const Operator = (props) => {
	return (
		<input
			className="button"
			type="button"
			id={props.idAndVal}
			onClick={props.oprFn}
			value={props.idAndVal}
		/>
	);
};

export default Operator;
