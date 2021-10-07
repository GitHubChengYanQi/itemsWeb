import React, {useRef, useState} from 'react';
import {Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import OriginList from '@/pages/Crm/origin/OriginList';
import TemplateList from '@/pages/Crm/template/TemplateList';
import CrmCustomerLevelList from '@/pages/Crm/customer/crmCustomerLevel/crmCustomerLevelList';
import CrmIndustryList from '@/pages/Crm/crmIndustry/crmIndustryList';
import CrmBusinessSalesList from '@/pages/Crm/business/crmBusinessSales/crmBusinessSalesList';
import CompanyRoleList from '@/pages/Crm/companyRole/companyRoleList';
import SetView from '@/layouts/SetView';
import DataClassificationList from '@/pages/Crm/data/dataClassification/dataClassificationList';
import SpeechcraftTypeList from '@/pages/Crm/speechcraft/speechcraftType/speechcraftTypeList';
import Modal from '@/components/Modal';
import Icon from '@/components/Icon';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);

  const ref = useRef(null);

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
      case 'cpzl':
        return <DataClassificationList />;
      case 'hsfl':
        return <SpeechcraftTypeList />;
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
            ref.current.open(false);
          }}
        >
          <Menu.Item key="sjly">
            <span><Icon type='icon' style={{margin:'0 8px'}} />项目来源管理</span>
          </Menu.Item>
          <Menu.Item key="sslc">
            <span><Icon type='icon' style={{margin:'0 8px'}} />销售分类管理</span>
          </Menu.Item>
          <Menu.Item key="htmb">
            <span><Icon type='icon' style={{margin:'0 8px'}} />合同模板管理</span>
          </Menu.Item>
          <Menu.Item key="khjb">
            <span><Icon type='icon' style={{margin:'0 8px'}} />客户级别管理</span>
          </Menu.Item>
          <Menu.Item key="hygl">
            <span><Icon type='icon' style={{margin:'0 8px'}} />行业管理</span>
          </Menu.Item>
          <Menu.Item key="jsgl">
            <span><Icon type='icon' style={{margin:'0 8px'}} />职位管理</span>
          </Menu.Item>
          <Menu.Item key="cpzl">
            <span><Icon type='icon' style={{margin:'0 8px'}} />产品资料分类管理</span>
          </Menu.Item>
          <Menu.Item key="hsfl">
            <span><Icon type='icon' style={{margin:'0 8px'}} />话术分类管理</span>
          </Menu.Item>
          <Menu.Divider />
        </Menu>} />
      <Modal width={860} title='设置' footer={[]} ref={ref}>{RenderComponent()}</Modal>
    </>
  );
};

const CrmLayout = ({children}) => {

  return (
    <TopLayout rightMenu={RightMenu}>
      {children}
    </TopLayout>
  );
};
export default CrmLayout;
