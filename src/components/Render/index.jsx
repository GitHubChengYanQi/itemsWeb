import React from 'react';

const Render = ({children, width,text}) => {


  return <div style={{minWidth: width || 100}}>{text || children}</div>;
};

export default Render;
