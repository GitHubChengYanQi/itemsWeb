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
import InvoiceList from '@/pages/Purshase/Invoice/InvoiceList';
import PaymentList from '@/pages/Purshase/Payment/PaymentList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);

  const ref = useRef();
  const setRef = useRef();

  const RenderComponent = () => {
    switch (type) {
      case '黑名单管理':
        return <SupplierBlacklistList/>;
      case '税率管理':
        return <TaxRateList/>;
      case '品牌管理':
        return <BrandList/>;
      case '合同分类管理':
        return <ContractClassList/>;
      case '合同模板管理':
        return <TemplateList/>;
      case '供应商级别管理':
        return <CrmCustomerLevelList/>;
      case '付款计划模板':
        return <PaymentTemplateList/>;
      case '行业管理':
        return <CrmIndustryList/>;
      case '银行管理':
        return <BankList/>;
      case '发票管理':
        return <InvoiceList/>;
      case '付款管理':
        return <PaymentList onClose={() => {
          setRef.current.close();
          ref.current.close();
        }}/>;
      default:
        return null;
    }
  };

  return (
    <>
      <SetView
        ref={setRef}
        mode={mode}
        theme={theme}
        width={width}
        RenderComponent={RenderComponent}
        buttons={buttons}
        SetMenu={<Menu

          style={{width: '100%'}}
          onClick={(item) => {
            setType(item.key);
            ref.current.open(true);
          }}
          items={[
            {key: '品牌管理', label: '品牌管理'},
            {key: '税率管理', label: '税率管理'},
            {key: '黑名单管理', label: '黑名单管理'},
            {key: '合同分类管理', label: '合同分类管理'},
            {key: '合同模板管理', label: '合同模板管理'},
            {key: '供应商级别管理', label: '供应商级别管理'},
            {key: '行业管理', label: '行业管理'},
            {key: '付款计划模板', label: '付款计划模板'},
            {key: '银行管理', label: '银行管理'},
            {key: '发票管理', label: '发票管理'},
            {key: '付款管理', label: '付款管理'},
          ]}
        />}/>
      <Modal headTitle={type} footer={[]} width={1200} ref={ref}>{RenderComponent()}</Modal>
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
