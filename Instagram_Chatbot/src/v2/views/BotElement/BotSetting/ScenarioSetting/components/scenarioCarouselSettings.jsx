import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <RightOutlined
      className={`${className} ss-carousel-arrow`.trim()}
      style={style}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <LeftOutlined
      className={`${className} ss-carousel-arrow`.trim()}
      style={style}
      onClick={onClick}
    />
  );
};

export const settingsCarousel = {
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

export default settingsCarousel;
