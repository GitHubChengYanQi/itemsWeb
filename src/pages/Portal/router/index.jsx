
import OemLayout from '@/pages/Portal';
import {BannerRouter} from '@/pages/Portal/banner/bannerRouter';
import {NavigationRouter} from '@/pages/Portal/navigation/navigationRouter';
import {ClassDifferenceDetailsRouter} from '@/pages/Shop/classDifferenceDetails/classDifferenceDetailsRouter';

const ProtalRouterConfig = [
  {
    path: '/protal',
    name: '门户管理',
    component: OemLayout,
    children:[
      ...BannerRouter,
      ...NavigationRouter,
      ...ClassDifferenceDetailsRouter,
      {
        redirect: '/protal/banner',
      }
    ]
  }
];
export default ProtalRouterConfig;
