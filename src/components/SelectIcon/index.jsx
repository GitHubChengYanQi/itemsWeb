import React, {useEffect, useState} from 'react';
import {Button, Drawer} from 'antd';
// import * as Icon from '@ant-design/icons';

import style from './index.module.less';

const Icon = [];

const SelectIcon = ({onChange, value}) => {

  const [visible, setVisible] = useState(false);
  const [icon, setIcon] = useState(null);

  const renderIcon = () => {
    const Item = icon ? Icon[icon] : Icon.MenuUnfoldOutlined;
    if (Item) {
      return <Item/>;
    }
    return null;

  };

  useEffect(() => {
    if (value) {
      setIcon(value);
    }
  }, [value]);

  return (
    <>
      <Button icon={renderIcon()} onClick={() => {
        setVisible(true);
      }}> 选择图标</Button>
      <Drawer open={visible} width={600} onClose={() => {
        setVisible(false);
      }}>
        <div className={style.selectIconWarp}>
          {
            Object.keys(Icon).map((value, index) => {
              const Item = Icon[value];
              if (typeof Item !== 'function' && Item.displayName !== 'AntdIcon') {
                return <Button key={index} icon={<Item/>} size="large" onClick={() => {
                  typeof onChange === 'function' && onChange(value);
                  setIcon(value);
                  setVisible(false);
                }}/>;
              }
              return null;

            })
          }
        </div>
      </Drawer>
    </>
  );
};
export default SelectIcon;
