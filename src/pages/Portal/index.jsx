import React, {useRef, useState} from 'react';
import {useRouteMatch, useHistory} from 'ice';
import store from '@/store';
import {Drawer, Menu, Modal} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import Icon from '@/components/Icon';
import styles from '@/pages/Crm/index.module.scss';
import BannerDifferenceList from '@/pages/Portal/bannerDifference/bannerDifferenceList';
import NavigationDifferenceList from '@/pages/Portal/navigationDifference/navigationDifferenceList';
import RemindList from '@/pages/Portal/remind/remindList';
import OriginList from '@/pages/Crm/origin/OriginList';
import CrmBusinessSalesList from '@/pages/Crm/business/crmBusinessSales/crmBusinessSalesList';
import TemplateList from '@/pages/Crm/template/TemplateList';
import CrmCustomerLevelList from '@/pages/Crm/customer/crmCustomerLevel/crmCustomerLevelList';
import CrmIndustryList from '@/pages/Crm/crmIndustry/crmIndustryList';
import CompanyRoleList from '@/pages/Crm/companyRole/companyRoleList';
import SetView from '@/layouts/SetView';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);
  const [visible, showModel] = useState(false);

  const RenderComponent = () => {
    switch (type) {
      case '轮播图分类管理':
        return <BannerDifferenceList />;
      case '导航分类管理':
        return <NavigationDifferenceList />;
      case 'shtx':
        return <RemindList />;
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
          items={[
            {key:'轮播图分类管理',label:'轮播图分类管理'},
            {key:'导航分类管理',label:'导航分类管理'}
          ]}
        />} />
      <Modal centered destroyOnClose maskClosable={false} width={860} open={visible} onCancel={() => {
        showModel(false);
      }} footer={null}>{RenderComponent()}</Modal>
    </>
  );
};

const OemLayout = ({children}) => {
  return (
    <TopLayout rightMenu={RightMenu}>
      {children}
    </TopLayout>
  );
};
export default OemLayout;
