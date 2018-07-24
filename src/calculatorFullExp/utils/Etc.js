import React from 'react';

const Etc = (props) => {
	return (
		<input
			className="button"
			type="button"
			id={props.idAndVal}
			onClick={props.function}
			value={props.idAndVal}
		/>
	);
};

export default Etc;
