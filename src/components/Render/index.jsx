import React from 'react';

const Render = ({children, width, text, maxWidth}) => {


  return <div style={{minWidth: width || 100, maxWidth}}>{text || children}</div>;
};

export default Render;
