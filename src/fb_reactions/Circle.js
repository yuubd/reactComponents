import React, {Component} from 'react';

function Circle(props) {
    return (
        <div className="circle">
            <img src={props.source} alt="logo"/>
            <p>{props.name}</p>
        </div>
    )}

// class Circle extends Component {
//     render(){
//         return(
//             <div className="circle">
//                 <img src={this.props.source} alt="logo"/>
//                 <p>{this.props.name}</p>
//             </div>
//         );
//     }
// }

export default Circle;