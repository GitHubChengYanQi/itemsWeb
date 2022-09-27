import React, {useRef, useState} from 'react';
import {Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import StorehouseList from '@/pages/Erp/storehouse/StorehouseList';
import SetView from '@/layouts/SetView';
import Modal from '@/components/Modal';
import AnnouncementsList from '@/pages/Erp/announcements/announcementsList';
import TemplateList from '@/pages/Crm/template/TemplateList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);
  const ref = useRef(null);

  const RenderComponent = () => {
    switch (type) {
      case '仓库管理':
        return <StorehouseList />;
      case '入库单模板':
        return <TemplateList module="inStock" />;
      case '出库单模板':
        return <TemplateList module="outStock" />;
      case '盘点单模板':
        return <TemplateList module="stocktaking" />;
      case '养护单模板':
        return <TemplateList module="curing" />;
      case '调拨单模板':
        return <TemplateList module="allocation" />;
      case '异常单模板':
        return <TemplateList module="error" />;
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
          style={{width: '100%'}}
          onClick={(item) => {
            ref.current.open(false);
            setType(item.key);
          }}
          items={[
            {key: '仓库管理', label: '仓库管理'},
            {key: '入库单模板', label: '入库单模板'},
            {key: '出库单模板', label: '出库单模板'},
            {key: '盘点单模板', label: '盘点单模板'},
            {key: '养护单模板', label: '养护单模板'},
            {key: '调拨单模板', label: '调拨单模板'},
            {key: '异常单模板', label: '异常单模板'},
            {key: '注意事项', label: '注意事项'},
          ]}
        />} />
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
