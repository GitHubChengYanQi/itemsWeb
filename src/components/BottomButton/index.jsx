import React from 'react';

const BottomButton = ({children, textAlign, style}) => {


  return <div
    style={{
      position: 'fixed',
      bottom: 0,
      width: 'calc(100% - 200px)',
      zIndex: 2,
      height: 47,
      borderTop: '1px solid #e7e7e7',
      background: '#fff',
      textAlign: textAlign || 'center',
      padding: '8px 24px 0',
      ...style
    }}
  >
    {children}
  </div>;
};

export default BottomButton;
