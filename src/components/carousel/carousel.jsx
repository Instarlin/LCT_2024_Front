import React, { useState, useEffect } from 'react';
import './carousel.css';

const Carousel = (props) => {
  const [children] = props

  const [currentIndex, setCurrentIndex] = useState(0)
  const [length, setLength] = useState(children.length)

  const updateIndex = (index) => {
    if(index < length) {
      setCurrentIndex(index + 1);
    } else {
      setCurrentIndex(0);
    }
  }

  useEffect(() => {
    setLength(children.length)
    setInterval(updateIndex(currentIndex), 2000);
  }, [children])

  return (
  <div className="carouselContainer">
    {children.map((element, index) => {
      <div className='elementWrapper'>
        {element}
      </div>
    })}
  </div>
  )
}

export default Carousel