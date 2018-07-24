import React from 'react';

const Bracket = (props) => {
	return (
		<input
			className="button"
			type="button"
			id={props.idAndVal}
			onClick={props.bracketFn}
			value={props.idAndVal}
		/>
	);
};

export default Bracket;
