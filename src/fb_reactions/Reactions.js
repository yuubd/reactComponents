import React, { Component } from 'react';
import './Reactions.css'
import angry from './public/facebook-angry.svg'
import haha from './public/facebook-haha.svg'
import like from './public/facebook-like.svg'
import love from './public/facebook-love.svg'
import sad from './public/facebook-sad.svg'
import wow from './public/facebook-wow.svg'


class Reactions extends Component {
  render() {
    return (
      <body>
        <div className="wrap">
          <div className="circle"><img src={like} alt="logo"/>
            <p>like</p>
          </div>
          <div className="circle"><img src={love} alt="logo"/>
            <p>love</p>
          </div>
          <div className="circle"><img src={haha} alt="logo"/>
            <p>haha</p>
          </div>
          <div className="circle"><img src={wow} alt="logo"/>
            <p>wow</p>
          </div>
          <div className="circle"><img src={sad} alt="logo"/>
            <p>sad</p>
          </div>
          <div className="circle"><img src={angry} alt="logo"/>
            <p>angry</p>
          </div>
        </div>
      </body>
    );
  }
}

export default Reactions;
