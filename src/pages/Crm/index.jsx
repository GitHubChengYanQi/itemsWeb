import React, {useRef, useState} from 'react';
import {Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import OriginList from '@/pages/Crm/origin/OriginList';
import TemplateList from '@/pages/Crm/template/TemplateList';
import CrmCustomerLevelList from '@/pages/Crm/customer/crmCustomerLevel/crmCustomerLevelList';
import CrmIndustryList from '@/pages/Crm/crmIndustry/crmIndustryList';
import CrmBusinessSalesList from '@/pages/Crm/business/crmBusinessSales/crmBusinessSalesList';
import SetView from '@/layouts/SetView';
import DataClassificationList from '@/pages/Crm/data/dataClassification/dataClassificationList';
import SpeechcraftTypeList from '@/pages/Crm/speechcraft/speechcraftType/speechcraftTypeList';
import Modal from '@/components/Modal';
import ContractClassList from '@/pages/Crm/contract/components/contractClass/contractClassList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);

  const ref = useRef(null);

  const RenderComponent = () => {
    switch (type) {
      case '项目来源管理':
        return <OriginList />;
      case '销售分类管理':
        return <CrmBusinessSalesList />;
      case '合同分类管理':
        return <ContractClassList />;
      case '合同模板管理':
        return <TemplateList />;
      case '客户级别管理':
        return <CrmCustomerLevelList />;
      case '行业管理':
        return <CrmIndustryList />;
      case '产品资料分类管理':
        return <DataClassificationList />;
      case '话术分类管理':
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
          style={{width: '100%'}}
          onClick={(item) => {
            setType(item.key);
            ref.current.open(false);
          }}
          items={[
            {key: '项目来源管理', label: '项目来源管理'},
            {key: '销售分类管理', label: '销售分类管理'},
            {key: '合同分类管理', label: '合同分类管理'},
            {key: '合同模板管理', label: '合同模板管理'},
            {key: '客户级别管理', label: '客户级别管理'},
            {key: '行业管理', label: '行业管理'},
            {key: '产品资料分类管理', label: '产品资料分类管理'},
            {key: '话术分类管理', label: '话术分类管理'},
          ]}
        />} />
      <Modal width={860} headTitle={type} title="设置" footer={[]} ref={ref}>{RenderComponent()}</Modal>
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
