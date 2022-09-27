import React, {useRef, useState} from 'react';
import {Drawer, Menu, Modal} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import SetView from '@/layouts/SetView';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);
  const [visible, showModel] = useState(false);

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
            setType(item.key);
            showModel(true);
          }}
        >
          <Menu.Divider />
        </Menu>} />
      <Modal centered destroyOnClose maskClosable={false} width={860} open={visible} onCancel={() => {
        showModel(false);
      }} footer={null}>{RenderComponent()}</Modal>
    </>
  );
};
const ShopLayout = ({children}) => {
  return (
    <TopLayout rightMenu={RightMenu}>
      {children}
    </TopLayout>
  );
};
export default ShopLayout;
