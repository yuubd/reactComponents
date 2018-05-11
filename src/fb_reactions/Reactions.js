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
    this.state = {show: false};

    this.toggleClass = this.toggleClass.bind(this);
  }

  toggleClass = () => {
    this.setState(prevState => ({
      show: !prevState.show
    }));
  }

  render() {
    return (
      <div className='reactions-main'>
        <div className={this.state.show? 'wrap' : 'hide'}>
          <Circle source={like} name='like'/>
          <Circle source={love} name='love'/>
          <Circle source={haha} name='haha'/>
          <Circle source={wow} name='wow'/>
          <Circle source={sad} name='sad'/>
          <Circle source={angry} name='angry'/>
        </div>
        <p id="reaction" onClick={this.toggleClass}>
          Like
        </p>
      </div>
    );
  }
}

export default Reactions;
