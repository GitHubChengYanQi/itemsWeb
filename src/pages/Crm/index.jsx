import React, {useRef, useState} from 'react';
import {Drawer, Menu,Modal} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import Icon from '@/components/Icon';
import OriginList from '@/pages/Crm/origin/OriginList';
import TemplateList from '@/pages/Crm/template/TemplateList';
import CrmCustomerLevelList from '@/pages/Crm/customer/crmCustomerLevel/crmCustomerLevelList';
import CrmIndustryList from '@/pages/Crm/crmIndustry/crmIndustryList';
import CrmBusinessSalesList from '@/pages/Crm/business/crmBusinessSales/crmBusinessSalesList';
import CompanyRoleList from '@/pages/Crm/companyRole/companyRoleList';
import SetView from '@/layouts/SetView';
import styles from './index.module.scss';


const CrmLayout = ({children}) => {


  const [type, setType] = useState(null);
  const [visible, showModel] = useState(false);


  const RenderComponent = () => {
    switch (type) {
      case 'sjly':
        return <OriginList />;
      case 'sslc':
        return <CrmBusinessSalesList />;
      case 'htmb':
        return <TemplateList />;
      case 'khjb':
        return <CrmCustomerLevelList />;
      case 'hygl':
        return <CrmIndustryList />;
      case 'jsgl':
        return <CompanyRoleList />;
      default:
        return null;
    }
  };

  const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {
    return (
      <SetView
        mode={mode}
        theme={theme}
        width={width}
        RenderComponent={RenderComponent}
        SetMenu={<Menu
          selectable={false}
          style={{width: '100%'}}
          onClick={(item) => {
            setType(item.key);
            showModel(true);
          }}
        >
          <Menu.Item key="sjly">
            <span>商机来源管理</span>
          </Menu.Item>
          <Menu.Item key="sslc">
            <span>销售流程管理</span>
          </Menu.Item>
          <Menu.Item key="htmb">
            <span>合同模板管理</span>
          </Menu.Item>
          <Menu.Item key="khjb">
            <span>客户级别管理</span>
          </Menu.Item>
          <Menu.Item key="hygl">
            <span>行业管理</span>
          </Menu.Item>
          <Menu.Item key="jsgl">
            <span>角色管理</span>
          </Menu.Item>
          <Menu.Divider />
        </Menu>}>
        <Modal centered destroyOnClose maskClosable={false} width={860} visible={visible} onCancel={() => {
          showModel(false);
        }} footer={null}>{RenderComponent()}</Modal>
      </SetView>
    );
  };

  return (
    <TopLayout rightMenu={RightMenu}>
      {children}
    </TopLayout>
  );
};
export default CrmLayout;
