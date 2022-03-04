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
import PaymentTemplateList from '@/pages/Purshase/paymentTemplate/paymentTemplateList';
import CrmIndustryList from '@/pages/Crm/crmIndustry/crmIndustryList';
import BankList from '@/pages/Purshase/bank/bankList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);

  const ref = useRef();

  const RenderComponent = () => {
    switch (type) {
      case '黑名单管理':
        return <SupplierBlacklistList />;
      case '税率管理':
        return <TaxRateList />;
      case '品牌管理':
        return <BrandList />;
      case '合同分类管理':
        return <ContractClassList />;
      case '合同模板管理':
        return <TemplateList />;
      case '供应商级别管理':
        return <CrmCustomerLevelList />;
      case '付款计划模板':
        return <PaymentTemplateList />;
      case '行业管理':
        return <CrmIndustryList />;
      case '银行管理':
        return <BankList />;
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
          <Menu.Item key="品牌管理">
            <span>品牌管理</span>
          </Menu.Item>
          <Menu.Item key="税率管理">
            <span>税率管理</span>
          </Menu.Item>
          <Menu.Item key="黑名单管理">
            <span>黑名单管理</span>
          </Menu.Item>
          <Menu.Item key="合同分类管理">
            <span>合同分类管理</span>
          </Menu.Item>
          <Menu.Item key="合同模板管理">
            <span>合同模板管理</span>
          </Menu.Item>
          <Menu.Item key="供应商级别管理">
            <span>供应商级别管理</span>
          </Menu.Item>
          <Menu.Item key="行业管理">
            <span>行业管理</span>
          </Menu.Item>
          <Menu.Item key="付款计划模板">
            <span>付款计划模板</span>
          </Menu.Item>
          <Menu.Item key="银行管理">
            <span>银行管理</span>
          </Menu.Item>
        </Menu>} />
      <Modal headTitle={type} footer={[]} width={1200} ref={ref}>{RenderComponent()}</Modal>
    </>
  );
};

const PurshaseLayout = ({children}) => {
  console.log(children);
  return (
    <TopLayout
      rightMenu={RightMenu}
    >
      {children}
    </TopLayout>
  );
};
export default PurshaseLayout;
