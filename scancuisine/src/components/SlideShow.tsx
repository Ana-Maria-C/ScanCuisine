import React, { useState, useEffect } from "react";

interface SlideShowProps {
  images: string[];
}

const SlideShow: React.FC<SlideShowProps> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const delay = 2000; // timpul de întârziere este setat la 2 secunde

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, delay);

    return () => {
      clearInterval(timer);
    };
  }, [images, delay]);

  return (
    <div className="slideShowContainer">
      <img className="slideShowImage" src={images[index]} alt="slide" />
    </div>
  );
};

export default SlideShow;
