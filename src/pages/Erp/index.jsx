import React, {useState} from 'react';
import {Menu, Modal} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import BrandList from '@/pages/Erp/brand/BrandList';
import MaterialList from '@/pages/Erp/material/MaterialList';
import StorehouseList from '@/pages/Erp/storehouse/StorehouseList';
import UnitList from '@/pages/Erp/unit/unitList';
import ItemClassList from '@/pages/Erp/itemClass/itemClassList';
import SetView from '@/layouts/SetView';
import CategoryList from '@/pages/Erp/category/categoryList';
import CodingRulesList from '@/pages/Erp/codingRules/codingRulesList';
import ToolClassificationList from '@/pages/Erp/tool/components/toolClassification/toolClassificationList';
import SpuClassificationList from '@/pages/Erp/spu/components/spuClassification/spuClassificationList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);
  const [visible, showModel] = useState(false);

  const RenderComponent = () => {
    switch (type) {
      case 'lmgl':
        return <CategoryList />;
      case 'ppgl':
        return <BrandList />;
      case 'czgl':
        return <MaterialList />;
      case 'ckgl':
        return <StorehouseList />;
      case 'cpflgl':
        return <ItemClassList />;
      case 'dwgl':
        return <UnitList />;
      case 'bmgl':
        return <CodingRulesList />;
      case 'gjflgl':
        return <ToolClassificationList />;
      case 'wlfl':
        return <SpuClassificationList />;
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
            setType(item.key);
            showModel(true);
          }}
        >
          <Menu.Item key="lmgl">
            <span>类目管理</span>
          </Menu.Item>
          <Menu.Item key="ppgl">
            <span>品牌管理</span>
          </Menu.Item>
          <Menu.Item key="czgl">
            <span>材质管理</span>
          </Menu.Item>
          <Menu.Item key="ckgl">
            <span>仓库管理</span>
          </Menu.Item>
          <Menu.Item key="cpflgl">
            <span>产品分类管理</span>
          </Menu.Item>
          <Menu.Item key="dwgl">
            <span>单位管理</span>
          </Menu.Item>
          <Menu.Item key="bmgl">
            <span>编码规则管理</span>
          </Menu.Item>
          <Menu.Item key="gjflgl">
            <span>工具分类管理</span>
          </Menu.Item>
          <Menu.Item key="wlfl">
            <span>物料分类管理</span>
          </Menu.Item>
          <Menu.Divider />
        </Menu>} />
      <Modal centered destroyOnClose maskClosable={false} width={860} visible={visible} onCancel={() => {
        showModel(false);
      }} footer={null}>{RenderComponent()}</Modal>
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
