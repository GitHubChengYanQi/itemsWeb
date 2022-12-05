import {Drawer, Menu} from 'antd';
import React, {useImperativeHandle, useState} from 'react';
import Icon from '@/components/Icon';
import styles from './index.module.scss';

const SetView = ({mode = 'horizontal', theme, width = '50%', buttons = [], SetMenu}, ref) => {

  const [drawerIsShow, showDrawer] = useState(false);

  const close = () => {
    showDrawer(false);
  };

  useImperativeHandle(ref, () => ({
    close
  }));

  return (
    <>
      <Menu
        mode="horizontal"
        theme={theme}
        style={{backgroundColor: '#2e3c56'}}
        selectable={false}
        items={[
          {
            key: 'setting',
            label: <Icon type="icon-xitongpeizhi"/>,
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
export default React.forwardRef(SetView);
