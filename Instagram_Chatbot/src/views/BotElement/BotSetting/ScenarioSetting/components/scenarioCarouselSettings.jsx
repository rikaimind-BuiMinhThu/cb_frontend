import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <RightOutlined
      className={className}
      style={{
        ...style,
        color: 'black',
        fontSize: '15px',
        lineHeight: '1.5715',
      }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <LeftOutlined
      className={className}
      style={{
        ...style,
        color: 'black',
        fontSize: '15px',
        lineHeight: '1.5715',
      }}
      onClick={onClick}
    />
  );
};

export const settingsCarousel = {
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

export default settingsCarousel;
