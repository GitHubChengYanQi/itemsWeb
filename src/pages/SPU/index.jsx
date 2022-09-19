import React, {useRef, useState} from 'react';
import {Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import BrandList from '@/pages/Erp/brand/BrandList';
import MaterialList from '@/pages/Erp/material/MaterialList';
import UnitList from '@/pages/Erp/unit/unitList';
import SetView from '@/layouts/SetView';
import CategoryList from '@/pages/Erp/category/categoryList';
import SpuClassificationList from '@/pages/Erp/spu/components/spuClassification/spuClassificationList';
import Modal from '@/components/Modal';
import PrintTemplateList from '@/pages/SPU/printTemplate/printTemplateList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);
  const ref = useRef(null);

  const RenderComponent = () => {
    switch (type) {
      case '配置管理':
        return <CategoryList />;
      case '品牌管理':
        return <BrandList />;
      case '材质管理':
        return <MaterialList />;
      case '打印模板':
        return <PrintTemplateList />;
      case '单位管理':
        return <UnitList />;
      case '物料分类管理':
        return <SpuClassificationList type={1} />;
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
            {key: '配置管理', label: '配置管理'},
            {key: '品牌管理', label: '品牌管理'},
            {key: '材质管理', label: '材质管理'},
            {key: '单位管理', label: '单位管理'},
            {key: '物料分类管理', label: '物料分类管理'},
            {key: '打印模板', label: '打印模板'},
          ]}
        />} />
      <Modal width={1000} headTitle={type} footer={[]} ref={ref}>{RenderComponent()}</Modal>
    </>
  );
};


const SpuLayout = ({children}) => {
  return (
    <TopLayout rightMenu={RightMenu}>
      {children}
    </TopLayout>
  );
};
export default SpuLayout;
