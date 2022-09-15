import {Drawer, Menu} from 'antd';
import React, {useState} from 'react';
import Icon from '@/components/Icon';
import styles from './index.module.scss';

const SetView = ({mode = 'horizontal', theme, width = '50%', buttons = [], SetMenu}) => {

  const [drawerIsShow, showDrawer] = useState(false);

  return (
    <>
      <Menu
        selectable={false}
        mode="horizontal"
        theme={theme}
        style={{backgroundColor: '#2e3c56'}}
        items={[
          {
            key: 'setting',
            label: <Icon type="icon-xitongpeizhi" />,
            onClick: () => showDrawer(true),
            style: {width, textAlign: 'center'}
          },
          ...buttons
        ]}
      />
      <Drawer
        destroyOnClose
        title={<span>设置</span>}
        style={{
          height: mode === 'vertical' ? 'calc(100vh - 63px)' : 'calc(100vh - 112px)',
          top: mode === 'vertical' ? 62 : 112
        }}
        open={drawerIsShow}
        bodyStyle={{padding: 0}}
        placement={mode === 'vertical' ? 'left' : 'right'}
        onClose={() => {
          showDrawer(false);
        }}>
        <div className={styles.settingMenu}>
          {SetMenu}
        </div>
      </Drawer>
    </>
  );
};
export default SetView;
