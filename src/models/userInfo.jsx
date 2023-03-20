import {request} from '@/util/Request';
import {userInfo} from '@/Config/ApiUrl/system/user';
import {selfEnterpriseDetail} from '@/pages/Purshase/Supply/SupplyUrl';

export default {
  state: {},
  reducers: {
    update(prevState, payload) {
      return {
        ...prevState,
        ...payload,
      };
    },
  },
  effects: (dispatch) => ({
    async getUserInfo() {
      try {
        const response = await request(userInfo);
        let res = await request(selfEnterpriseDetail);
        if (res && Object.keys(res).length > 0) {
          res = {abbreviation: res.abbreviation, customerName: res.customerName, customerId: res.customerId};
        } else {
          res = {};
        }
        dispatch.user.update({...response, ...res});
      } catch (e) {
        console.log(e);
      }
    },
  }),
};
