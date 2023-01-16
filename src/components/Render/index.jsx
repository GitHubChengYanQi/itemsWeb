import React from 'react';

const Render = ({children, width, text, maxWidth, style = {}}) => {


  return <div style={{minWidth: width || 100, maxWidth, ...style}}>{text || children}</div>;
};

export default Render;
