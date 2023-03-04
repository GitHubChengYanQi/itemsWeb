import {request} from '@/util/Request';
import {spuClassificationTreeVrew} from '@/pages/Erp/spu/components/spuClassification/spuClassificationUrl';
import {crmCustomerLevelList} from '@/pages/Crm/customer/crmCustomerLevel/crmCustomerLevelUrl';
import {commonArea} from '@/pages/Crm/adress/AdressUrl';
import {crmBusinessSalesListSelect} from '@/pages/Crm/business/BusinessUrl';
import {originList} from '@/pages/Crm/origin/OriginUrl';
import {dataClassificationSelect} from '@/pages/Crm/data/dataUrl';
import {speechcraftType} from '@/pages/Crm/speechcraft/speechcraftUrl';
import {getRuleV2} from '@/pages/BaseSystem/codingV2Rules/codingRulesUrl';

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
    async opentaskList(value) {
      try {
        dispatch.dataSource.update({showTaskList: value});
      } catch (e) {
        console.log(e);
      }
    },
    async getSkuClass() {
      try {
        const skuClass = await request({
          ...spuClassificationTreeVrew, data: {
            isNotproduct: 1
          }
        });
        dispatch.dataSource.update({skuClass});
      } catch (e) {
        console.log(e);
      }
    },
    async getCodingRules() {
      try {
        const codingRules = await request(getRuleV2);
        dispatch.dataSource.update({codingRules});
      } catch (e) {
        console.log(e);
      }
    },
    async getCustomerLevel() {
      try {
        const customerLevel = await request(crmCustomerLevelList);
        dispatch.dataSource.update({customerLevel});
      } catch (e) {
        console.log(e);
      }
    },
    async getCommonArea() {
      try {
        const area = await request(commonArea);
        dispatch.dataSource.update({area});
      } catch (e) {
        console.log(e);
      }
    },
    async getBusinessSale() {
      try {
        const businessSale = await request(crmBusinessSalesListSelect);
        dispatch.dataSource.update({businessSale});
      } catch (e) {
        console.log(e);
      }
    },
    async getOrigin() {
      try {
        const origin = await request(originList);
        dispatch.dataSource.update({origin});
      } catch (e) {
        console.log(e);
      }
    },
    async getDataClass() {
      try {
        const dataClass = await request(dataClassificationSelect);
        dispatch.dataSource.update({dataClass});
      } catch (e) {
        console.log(e);
      }
    },
    async getSpeechcraftClass() {
      try {
        const speechcraftClass = await request(speechcraftType);
        dispatch.dataSource.update({speechcraftClass});
      } catch (e) {
        console.log(e);
      }
    },


  }),
};
