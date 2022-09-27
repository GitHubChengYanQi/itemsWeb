import React, {useRef, useState} from 'react';
import {Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import SetView from '@/layouts/SetView';
import Modal from '@/components/Modal';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);
  const ref = useRef(null);

  const RenderComponent = () => {
    switch (type) {
      default:
        return null;
    }
  };

  return (
    <>
      <SetView
        mode={mode}
        theme={theme}
        width={width}
        RenderComponent={RenderComponent}
        buttons={buttons}
        SetMenu={<Menu

          style={{width: '100%'}}
          onClick={(item) => {
            ref.current.open(false);
            setType(item.key);
          }}
        />} />
      <Modal width={1000} title="设置" footer={[]} ref={ref}>{RenderComponent()}</Modal>
    </>
  );
};


const WorkflowLayout = ({children}) => {
  return (
    <TopLayout rightMenu={RightMenu}>
      {children}
    </TopLayout>
  );
};
export default WorkflowLayout;
