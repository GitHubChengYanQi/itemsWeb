
import OemLayout from '@/pages/Portal';
import {BannerRouter} from '@/pages/Portal/banner/bannerRouter';
import {NavigationRouter} from '@/pages/Portal/navigation/navigationRouter';
import {GoodsRouter} from "@/pages/Shop/goods/goodsRouter";
import {DaoxinPortalClassRouter} from '@/pages/Shop/daoxinPortalClass/daoxinPortalClassRouter';
import {WxuserInfoRouter} from '@/pages/UserInfo/wxuserInfo/wxuserInfoRouter';
import {CreateUserRouter} from '@/pages/Portal/CreateUser/CreateUserRouter';

const ProtalRouterConfig = [
  {
    path: '/protal',
    name: '门户管理',
    component: OemLayout,
    children:[
      ...BannerRouter,
      ...NavigationRouter,
      ...DaoxinPortalClassRouter,
      ...GoodsRouter,
      ...WxuserInfoRouter,
      ...CreateUserRouter,
      {
        redirect: '/protal/banner',
      }
    ]
  }
];
export default ProtalRouterConfig;
