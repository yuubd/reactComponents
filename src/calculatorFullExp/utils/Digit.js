import React from 'react';

const Digit = (props) => {
	return (
		<input
			className="button"
			type="button"
			id={props.idAndVal}
			onClick={props.digitFn}
			value={props.idAndVal}
		/>
	);
};
export default Digit;
