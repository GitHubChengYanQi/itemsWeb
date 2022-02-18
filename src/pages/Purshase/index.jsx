import React, {useRef, useState} from 'react';
import {Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import SetView from '@/layouts/SetView';
import SupplierBlacklistList from '@/pages/Crm/supplierBlacklist/supplierBlacklistList';
import Modal from '@/components/Modal';
import TaxRateList from '@/pages/Purshase/taxRate/taxRateList';
import BrandList from '@/pages/Erp/brand/BrandList';
import ContractClassList from '@/pages/Crm/contract/components/contractClass/contractClassList';
import TemplateList from '@/pages/Crm/template/TemplateList';
import CrmCustomerLevelList from '@/pages/Crm/customer/crmCustomerLevel/crmCustomerLevelList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);

  const ref = useRef();

  const RenderComponent = () => {
    switch (type) {
      case 'hmd':
        return <SupplierBlacklistList />;
      case 'slgl':
        return <TaxRateList />;
      case 'ppgl':
        return <BrandList />;
      case 'htfl':
        return <ContractClassList />;
      case 'htmb':
        return <TemplateList />;
      case 'khjb':
        return <CrmCustomerLevelList />;
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
            ref.current.open(true);
          }}
        >
          <Menu.Item key="ppgl">
            <span>品牌管理</span>
          </Menu.Item>
          <Menu.Item key="slgl">
            <span>税率管理</span>
          </Menu.Item>
          <Menu.Item key="hmd">
            <span>黑名单管理</span>
          </Menu.Item>
          <Menu.Item key="htfl">
            <span>合同分类管理</span>
          </Menu.Item>
          <Menu.Item key="htmb">
            <span>合同模板管理</span>
          </Menu.Item>
          <Menu.Item key="khjb">
            <span>供应商级别管理</span>
          </Menu.Item>
          <Menu.Item key="hygl">
            <span>行业管理</span>
          </Menu.Item>
        </Menu>} />
      <Modal footer={[]} width={1200} ref={ref}>{RenderComponent()}</Modal>
    </>
  );
};

const PurshaseLayout = ({children}) => {
  return (
    <TopLayout
      rightMenu={RightMenu}
    >
      {children}
    </TopLayout>
  );
};
export default PurshaseLayout;
