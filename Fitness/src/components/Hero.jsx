import React from 'react'
import '../styles/Hero.css'

const Hero = () => {
  return (
    <div className='hero-container' id='hero'>
      
      <div className="hero-text">
        <span>
          <div className="hero-line" />
          <h5>PAIN ZONE</h5>
        </span>
        <h2>Don't <b>Wait</b> For The <b>Right</b> Time</h2>
        <a href="#search"><button>View more</button></a>
      </div>
    </div>
  )
}

export default Hero