import React, {useState} from 'react';
import {
  UnorderedListOutlined
} from '@ant-design/icons';
import {Menu, Drawer, Avatar, Button, Dropdown, Space} from 'antd';
import {useHistory, config} from 'ice';
import Icon from '@/components/Icon';
import store from '@/store';
import AppEntFUNC from '@/asseset/imgs/88.png';
import PassWord from '@/pages/Member/passWord';

import crm from '@/asseset/imgs/crm.png';
import erp from '@/asseset/imgs/erp.png';
import repair from '@/asseset/imgs/repair.png';
import protal from '@/asseset/imgs/protal.png';
import sys from '@/asseset/imgs/sys.png';
import menu from '@/asseset/imgs/menu.png';
import SPU from '@/asseset/imgs/spu.png';
import production from '@/asseset/imgs/production.png';
import workflow from '@/asseset/imgs/workflow.png';
import purchase from '@/asseset/imgs/purchase.png';

import daoxinyun from '@/asseset/imgs/daoxinyun.png';

import styles from './index.module.less';
import Message from '@/layouts/BasicLayout/components/Header/components/Message';
import TaskList from '@/pages/TaskList';

const AppIcon = {
  ENT_FUNC: menu,
  BASE_SYSTEM: sys,
  CRM: crm,
  ERP: erp,
  REPAIR: repair,
  protal,
  production,
  SPU,
  workflow,
  purchase,
};


const Header = () => {

  const [visiblePwd, setVisiblePwd] = useState(false);

  const history = useHistory();

  const [userInfo] = store.useModel('user');

  const {menus} = userInfo;

  const [visible, setVisible] = useState(false);

  const items = [
    {
      key: 'name',
      style: {padding: 12, fontSize: 16,width:200, color: '#7f7f7f'},
      label: userInfo.name,
    },
    {
      key: '/member',
      label: <div className={styles.dropdownMenuItem} onClick={()=>{
        history.push('/member');
      }}>个人中心</div>,
    },
    {
      key: '/password',
      label: <div className={styles.dropdownMenuItem} onClick={()=>{
        setVisiblePwd(true);
      }}>修改密码</div>,
    },
    {
      key: '/logout',
      label: <div className={styles.dropdownMenuItem}  onClick={()=>{
        history.push('/logout');
      }}>退出登录</div>,
    },
  ];

  return (
    <>
      <header className={styles.navbar}>
        <div className={`row-flex ${styles.inner}`}>
          <div className={`${styles.systemBar}`}>
            <div className={styles.left}>
              <div onClick={() => {
                history.push('/');
              }} style={{
                width: 200,
                cursor: 'pointer',
                paddingLeft: 16,
                backgroundColor: '#2e3c56',
                height: '100%',
                paddingTop: 8
              }}>
                <img src={daoxinyun} alt="" />
              </div>
              <Menu
                items={[
                  {
                    key: 'mail',
                    label: <div style={{minWidth: 100}}>
                      <Space>
                        所有功能<UnorderedListOutlined />
                      </Space>
                    </div>,
                    onClick: () => setVisible(true)
                  }
                ]}
                selectedKeys={[]}
                mode="horizontal"
                theme="dark"
                style={{backgroundColor: '#222e44', color: '#fff', height: '100%', lineHeight: '60px'}}
              />
            </div>
            <div className={styles.middle} />
            <div className={styles.right}>
              <Dropdown trigger={['click']} menu={{items}} style={{width: 220}}>
                <Button type="text" size="large" style={{height: 60}}>
                  <Avatar
                    style={{float: 'left'}}
                    src={`${config.baseURI}${userInfo.avatar}`}
                  />
                </Button>
              </Dropdown>
              <Message />
              <TaskList />
            </div>
          </div>
        </div>
      </header>
      <Drawer
        placement="left"
        closable={false}
        onClose={() => {
          setVisible(false);
        }}
        open={visible}
        width={325}
        bodyStyle={{padding: 0, margin: 0}}
      >
        <div className="docker-top-container">
          <div className="docker-top-title">
            <div className="css-1b5qfbo">
              <Icon type="icon-fenlei1" />
            </div>
            <div className="docker-top-text">
              <span
                aria-haspopup="true"
                aria-expanded="false"
              >{userInfo.abbreviation || '道昕云'}</span></div>
          </div>
        </div>
        <div className="docker-middle">
          <div className={styles.appContent}>
            {menus && Array.isArray(menus) && menus.map((item, index) => {
              return (
                <div className={styles.appItemWrap} key={index} onClick={() => {
                  setVisible(false);
                  history.push(`/${item.id}`);
                }}>
                  <div className="app-item">
                    <div className="item-logo-wrap">
                      <span className="navigation-badge">
                        <img style={{
                          boxShadow: 'none',
                        }} className="app-item-logo" src={AppIcon[item.id] || AppEntFUNC} alt="logo" />
                      </span>
                    </div>
                    <div className="app-item-name">
                      {item.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Drawer>
      <PassWord visible={visiblePwd} onClose={() => setVisiblePwd(false)} />
    </>
  );
};

export default Header;
