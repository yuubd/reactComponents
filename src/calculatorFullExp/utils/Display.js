import React from 'react';

var AlignRight = {
	textAlign: 'right',
	fontSize: '50px',
	height: '60px'
};

const Display = (props) => {
	return (
		<input style={AlignRight} className="display" value={props.value} disabled />
	);
};

export default Display;
