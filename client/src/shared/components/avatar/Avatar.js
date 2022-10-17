import React from 'react';

import './Avatar.css';

const Avatar = props => {
  return (
    <div
      className={`avatar ${props.className}`}
      style={props.style}
      data-testid="avatar"
    >
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;
