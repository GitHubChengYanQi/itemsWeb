import React, {useRef, useState} from 'react';
import {Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import SetView from '@/layouts/SetView';
import SupplierBlacklistList from '@/pages/Crm/supplierBlacklist/supplierBlacklistList';
import Modal from '@/components/Modal';
import TaxRateList from '@/pages/Purshase/taxRate/taxRateList';
import BrandList from '@/pages/Erp/brand/BrandList';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);

  const ref = useRef();

  const RenderComponent = () => {
    switch (type) {
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
            ref.current.open(true);
          }}
        >

        </Menu>} />
      <Modal footer={[]} width={1200} ref={ref}>{RenderComponent()}</Modal>
    </>
  );
};

const ProcessLayout = ({children}) => {
  return (
    <TopLayout
      rightMenu={RightMenu}
    >
      {children}
    </TopLayout>
  );
};
export default ProcessLayout;
