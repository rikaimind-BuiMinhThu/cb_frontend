import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const SampleNextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <RightOutlined
      className={`${className} ss-carousel-arrow`.trim()}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <LeftOutlined
      className={`${className} ss-carousel-arrow`.trim()}
      onClick={onClick}
    />
  );
};

export const settingsCarousel = {
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

export default settingsCarousel;
