import React, {useRef,useState} from 'react';
import {Menu} from 'antd';
import Modal from '@/components/Modal';
import TopLayout from '@/layouts/TopLayout';
import BannerDifferenceList from '@/pages/Portal/bannerDifference/bannerDifferenceList';
import NavigationDifferenceList from '@/pages/Portal/navigationDifference/navigationDifferenceList';
import RemindList from '@/pages/Portal/remind/remindList';
import SetView from '@/layouts/SetView';


const RightMenu = ({mode = 'horizontal', theme, width = '50%', buttons = []}) => {

  const [type, setType] = useState(null);
  const ref = useRef(null);

  const RenderComponent = () => {
    switch (type) {
      case '轮播图分类管理':
        return <BannerDifferenceList />;
      case '导航分类管理':
        return <NavigationDifferenceList />;
      case 'shtx':
        return <RemindList />;
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
            {key:'轮播图分类管理',label:'轮播图分类管理'},
            {key:'导航分类管理',label:'导航分类管理'}
          ]}
        />} />
      <Modal width={1200} headTitle={type} ref={ref}>{RenderComponent()}</Modal>
    </>
  );
};

const OemLayout = ({children}) => {
  return (
    <TopLayout rightMenu={RightMenu}>
      {children}
    </TopLayout>
  );
};
export default OemLayout;
