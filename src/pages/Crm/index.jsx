import React, {useRef, useState} from 'react';
import {useRouteMatch, useHistory} from 'ice';
import store from '@/store';
import {Drawer, Menu} from 'antd';
import TopLayout from '@/layouts/TopLayout';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import OriginList from '@/pages/Crm/origin/OriginList';
import TemplateList from '@/pages/Crm/template/TemplateList';
import CrmCustomerLevelList from '@/pages/Crm/crmCustomerLevel/crmCustomerLevelList';
import CrmIndustryList from '@/pages/Crm/crmIndustry/crmIndustryList';
import CrmBusinessSalesList from '@/pages/Crm/crmBusinessSales/crmBusinessSalesList';

import styles from './index.module.scss';

const CrmLayout = ({children}) => {

  const refOriginList = useRef(null);
  const refTemplateList = useRef(null);
  const refCrmCustomerLevelList = useRef(null);
  const refCrmIndustryList = useRef(null);
  const refCrmBusinessSalesList = useRef(null);


  const [drawerIsShow, showDrawer] = useState(false);

  const rightMenu = () => {
    return (
      <>
        <Menu
          selectable={false}
          mode="horizontal"
        >
          <Menu.Item key="setting" onClick={() => {
            showDrawer(true);
          }}><Icon type="icon-xitongpeizhi" /></Menu.Item>
        </Menu>
        <Drawer
          title={<span>设置</span>}
          style={{height: 'calc(100% - 112px)', top: 112}}
          visible={drawerIsShow}
          getContainer={false}
          bodyStyle={{padding: 0}}
          onClose={() => {
            showDrawer(false);
          }}>
          <div className={styles.settingMenu}>
            <Menu
              selectable={false}
              style={{width: '100%'}}
            >
              <Menu.Item key='sjly' onClick={() => {refOriginList.current.open(false);}}>
                <span className={styles.dropdownMenuItem}>商机来源管理</span>
              </Menu.Item>
              <Modal width={800} component={OriginList} ref={refOriginList} />
              <Menu.Item key='sslc'  onClick={() => {refCrmBusinessSalesList.current.open(false);}}>
                <span className={styles.dropdownMenuItem}>销售流程管理</span>
              </Menu.Item>
              <Modal title="商机来源" width={800} component={CrmBusinessSalesList} ref={refCrmBusinessSalesList} />
              <Menu.Item key='htmb'  onClick={() => {refTemplateList.current.open(false);}}>
                <span className={styles.dropdownMenuItem}>合同模板管理</span>
              </Menu.Item>
              <Modal title="合同模板" width={800} component={TemplateList} ref={refTemplateList} />
              <Menu.Item key='khjb'  onClick={() => {refCrmCustomerLevelList.current.open(false);}}>
                <span className={styles.dropdownMenuItem} >客户级别管理</span>
              </Menu.Item>
              <Modal title="客户级别" width={800} component={CrmCustomerLevelList} ref={refCrmCustomerLevelList} />
              <Menu.Item key='yegl'  onClick={() => {refCrmIndustryList.current.open(false);}}>
                <span className={styles.dropdownMenuItem} >行业管理</span>
              </Menu.Item>
              <Modal width={860} component={CrmIndustryList} ref={refCrmIndustryList} />
              <Menu.Divider />
            </Menu>
          </div>
        </Drawer>
      </>

    );
  };

  return (
    <TopLayout rightMenu={rightMenu()}>
      {children}
    </TopLayout>
  );
};
export default CrmLayout;
