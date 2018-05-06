import React, { Component } from 'react';
import './Reactions.css'
import angry from './public/facebook-angry.svg'
import haha from './public/facebook-haha.svg'
import like from './public/facebook-like.svg'
import love from './public/facebook-love.svg'
import sad from './public/facebook-sad.svg'
import wow from './public/facebook-wow.svg'
import Circle from './Circle'


class Reactions extends Component {
  constructor(props) {
    super(props);
    this.state = {like: true};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    this.setState(prevState => ({
      like: !prevState.like
    }));
  }

  render() {
    return (
      <body>
        <div className="wrap">
          <Circle source={like} name='like'/>
          <Circle source={love} name='love'/>
          <Circle source={haha} name='haha'/>
          <Circle source={wow} name='wow'/>
          <Circle source={sad} name='sad'/>
          <Circle source={angry} name='angry'/>
        </div>
        <p id="reaction" onClick={this.handleClick}>
          {this.state.like ? 'like' : 'dislike'}
        </p>
      </body>
    );
  }
}

export default Reactions;
