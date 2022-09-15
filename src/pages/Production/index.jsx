import React, {useRef, useState} from 'react';
import {Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import SetView from '@/layouts/SetView';
import ToolClassificationList from '@/pages/Erp/tool/components/toolClassification/toolClassificationList';
import Modal from '@/components/Modal';
import QualityCheckClassificationList from '@/pages/Erp/qualityCheck/components/qualityCheckClassification/qualityCheckClassificationList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);
  const ref = useRef(null);

  const RenderComponent = () => {
    switch (type) {
      case '工具分类管理':
        return <ToolClassificationList />;
      case '质检分类管理':
        return <QualityCheckClassificationList />;
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
            {key:'工具分类管理',label:'工具分类管理'},
            {key:'质检分类管理',label:'质检分类管理'}
          ]}
        />} />
      <Modal width={860} title="设置" footer={[]} ref={ref}>{RenderComponent()}</Modal>
    </>
  );
};


const ProducttionLayout = ({children}) => {
  return (
    <TopLayout rightMenu={RightMenu}>
      {children}
    </TopLayout>
  );
};
export default ProducttionLayout;
