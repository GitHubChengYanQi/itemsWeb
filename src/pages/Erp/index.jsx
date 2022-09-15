import React, {useRef, useState} from 'react';
import {Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import StorehouseList from '@/pages/Erp/storehouse/StorehouseList';
import SetView from '@/layouts/SetView';
import Modal from '@/components/Modal';
import AnnouncementsList from '@/pages/Erp/announcements/announcementsList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);
  const ref = useRef(null);

  const RenderComponent = () => {
    switch (type) {
      case '仓库管理':
        return <StorehouseList />;
      case '注意事项':
        return <AnnouncementsList />;
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
          selectable={false}
          style={{width: '100%'}}
          onClick={(item) => {
            ref.current.open(false);
            setType(item.key);
          }}
          items={[
            {key:'仓库管理',label:'仓库管理'},
            {key:'注意事项',label:'注意事项'}
          ]}
        >
          <Menu.Divider />
        </Menu>} />
      <Modal width={1200} headTitle={type} footer={[]} ref={ref}>{RenderComponent()}</Modal>
    </>
  );
};


const ErpLayout = ({children}) => {
  return (
    <TopLayout rightMenu={RightMenu}>
      {children}
    </TopLayout>
  );
};
export default ErpLayout;
