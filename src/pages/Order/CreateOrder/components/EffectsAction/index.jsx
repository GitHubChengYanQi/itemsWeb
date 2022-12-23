import {FormEffectHooks, FormPath} from '@formily/antd';
import {message} from 'antd';
import {getSearchParams} from 'ice';
import moment from 'moment';
import {request} from '@/util/Request';
import {customerDetail} from '@/pages/Crm/customer/CustomerUrl';
import {contactsDetail} from '@/pages/Crm/contacts/contactsUrl';
import {templateGetLabel} from '@/pages/Crm/template/TemplateUrl';
import {invoiceDetail} from '@/pages/Crm/invoice/invoiceUrl';
import {selfEnterpriseDetail, supplierDetail} from '@/pages/Purshase/Supply/SupplyUrl';
import {isArray, isObject, MathCalc} from '@/util/Tools';

const customerAAction = (setFieldState, getCustomer) => {

  const params = getSearchParams();

  let api = {};
  if (params.module === 'PO') {
    api = selfEnterpriseDetail;
  } else if (params.module === 'SO') {
    api = customerDetail;
  }

  FormEffectHooks.onFieldValueChange$('buyerId').subscribe(async ({value}) => {
    let customer = {};
    if (value) {
      customer = await request({...api, data: {customerId: value}});
      if (params.module === 'SO') {
        getCustomer(customer);
      }
    }
    if (!customer) {
      return;
    }

    setFieldState('partyAAdressId', (state) => {
      if (!value) {
        state.value = value;
      }
      state.props.customerId = value;
      state.props.defaultValue = customer.defaultAddress;
      state.props.options = customer.adressParams && customer.adressParams.map((item) => {
        return {
          label: item.detailLocation || item.location,
          value: item.adressId,
        };
      });
    });

    setFieldState('adressId', (state) => {
      if (!value) {
        state.value = value;
      }
      state.props.customerId = value;
      state.props.defaultValue = customer.defaultAddress;
      state.props.options = customer.adressParams && customer.adressParams.map((item) => {
        return {
          label: item.detailLocation || item.location,
          value: item.adressId,
        };
      });
    });

    setFieldState('partyAContactsId', (state) => {
      if (!value) {
        state.value = value;
      }
      state.props.customerId = value;
      state.props.defaultValue = customer.defaultContacts;
      state.props.options = customer.contactsParams && customer.contactsParams.map((item) => {
        return {
          label: item.contactsName,
          value: item.contactsId,
        };
      });
    });

    setFieldState('userId', (state) => {
      if (!value) {
        state.value = value;
      }
      state.props.customerId = value;
      state.props.defaultValue = customer.defaultContacts;
      state.props.options = customer.contactsParams && customer.contactsParams.map((item) => {
        return {
          label: item.contactsName,
          value: item.contactsId,
        };
      });
    });

    setFieldState('partyABankId', (state) => {
      state.props.customerId = value;
      state.value = customer.invoiceResult && customer.invoiceResult.bankId;
    });

    setFieldState('partyABankAccount', (state) => {
      if (!value) {
        state.value = value;
      }
      state.props.customerId = value;
      state.props.defaultValue = customer.invoiceId;
      state.props.options = customer.invoiceResults && customer.invoiceResults.map((item) => {
        return {
          label: item.bankAccount,
          value: item.invoiceId,
          id: item.bankId,
        };
      });
    });

    setFieldState('partyALegalPerson', (state) => {
      state.value = customer.legal;
    });
    setFieldState('partyACompanyPhone', (state) => {
      state.value = customer.telephone;
    });
    setFieldState('partyAFax', (state) => {
      state.value = customer.fax;
    });
    setFieldState('partyAZipCode', (state) => {
      state.value = customer.zipCode;
    });

  });

  FormEffectHooks.onFieldValueChange$('partyABankId').subscribe(async ({value}) => {
    if (value) {
      setFieldState('partyABankAccount', (state) => {
        state.props.bankId = value;
        state.props.defaultValue = null;
      });
    }
  });

  FormEffectHooks.onFieldValueChange$('partyABankAccount').subscribe(async ({value}) => {
    if (value) {
      const res = await request({...invoiceDetail, data: {invoiceId: value}});
      if (!res) {
        return;
      }
      setFieldState('partyABankNo', (state) => {
        state.value = res.bankNo;
      });
    }
  });

  FormEffectHooks.onFieldValueChange$('partyAContactsId').subscribe(async ({value}) => {
    if (value) {
      const res = await request({...contactsDetail, data: {contactsId: value}});
      if (!res) {
        return;
      }
      setFieldState('partyAPhone', (state) => {
        state.props.contactsId = value;
        state.props.defaultValue = isObject(isArray(res.phoneParams)[0]).phoneId;
        state.props.options = isArray(res.phoneParams).map((item) => {
          return {
            label: item.phone,
            value: item.phoneId,
          };
        });
      });
    } else {
      setFieldState('partyAPhone', (state) => {
        state.value = null;
        state.props.defaultValue = null;
      });
    }
  });
};

const customerBAction = (setFieldState, getCustomer) => {

  const params = getSearchParams();
  let api = {};
  if (params.module === 'SO') {
    api = selfEnterpriseDetail;
  } else if (params.module === 'PO') {
    api = supplierDetail;
  }

  FormEffectHooks.onFieldValueChange$('sellerId').subscribe(async ({value}) => {
    let customer = {};
    if (value) {
      customer = await request({...api, data: {customerId: value}});
      if (params.module === 'PO') {
        getCustomer(customer);
      }
    }
    if (!customer) {
      return;
    }
    setFieldState('partyBAdressId', (state) => {
      if (!value) {
        state.value = value;
      }
      state.props.customerId = value;
      state.props.defaultValue = customer.defaultAddress;
      state.props.options = customer.adressParams && customer.adressParams.map((item) => {
        return {
          label: item.detailLocation || item.location,
          value: item.adressId,
        };
      });
    });

    setFieldState('partyBContactsId', (state) => {
      if (!value) {
        state.value = null;
      }
      state.props.customerId = value;
      state.props.defaultValue = customer.defaultContacts;
      state.props.options = customer.contactsParams && customer.contactsParams.map((item) => {
        return {
          label: item.contactsName,
          value: item.contactsId,
        };
      });
    });

    setFieldState('partyBBankId', (state) => {
      state.props.customerId = value;
      state.value = customer.invoiceResult && customer.invoiceResult.bankId;
    });

    setFieldState('partyBBankAccount', (state) => {
      if (!value) {
        state.value = null;
      }
      state.props.customerId = value;
      state.props.defaultValue = customer.invoiceId;
      state.props.options = customer.invoiceResults && customer.invoiceResults.map((item) => {
        return {
          label: item.bankAccount,
          value: item.invoiceId,
          id: item.bankId,
        };
      });
    });

    setFieldState('partyBLegalPerson', (state) => {
      state.value = customer.legal;
    });
    setFieldState('partyBCompanyPhone', (state) => {
      state.value = customer.telephone;
    });
    setFieldState('partyBFax', (state) => {
      state.value = customer.fax;
    });
    setFieldState('partyBZipCode', (state) => {
      state.value = customer.zipCode;
    });

    setFieldState('detailParams', (state) => {
      state.props.customerId = value;
      state.props.brandName = customer.abbreviation;
    });
  });

  FormEffectHooks.onFieldValueChange$('partyBContactsId').subscribe(async ({value}) => {
    if (value) {
      const res = await request({...contactsDetail, data: {contactsId: value}});
      if (!res) {
        return;
      }
      setFieldState('partyBPhone', (state) => {
        state.props.contactsId = value;
        state.props.defaultValue = isObject(res.phoneParams[0]).phoneId;
        state.props.options = res.phoneParams && res.phoneParams.map((item) => {
          return {
            label: item.phone,
            value: item.phoneId,
          };
        });
      });
    } else {
      setFieldState('partyBPhone', (state) => {
        state.props.contactsId = value;
        state.props.defaultValue = null;
        state.value = null;
      });
    }
  });

  FormEffectHooks.onFieldValueChange$('partyBBankAccount').subscribe(async ({value}) => {
    if (value) {
      const res = await request({...invoiceDetail, data: {invoiceId: value}});
      if (!res) {
        return;
      }
      setFieldState('partyBBankNo', (state) => {
        state.value = res.bankNo;
      });
    }
  });

  FormEffectHooks.onFieldValueChange$('partyBBankId').subscribe(({value}) => {
    if (value) {
      setFieldState('partyBBankAccount', (state) => {
        state.props.bankId = value;
        state.props.defaultValue = null;
      });
    }
  });

};

const paymentAction = (setFieldState, getFieldState) => {
  FormEffectHooks.onFieldValueChange$('detailParams').subscribe(({value, inputed}) => {
    let money = 0;
    if (value && inputed) {
      value.map((item) => {
        if (item && item.totalPrice) {
          money = MathCalc(money, item.totalPrice, 'jia');
        }
        return null;
      });
      setFieldState('money', (state) => {
        state.value = money;
      });
    }
  });

  FormEffectHooks.onFieldValueChange$('money').subscribe(async ({value}) => {
    setFieldState('floatingAmount', (state) => {
      state.value = 0;
    });

    setFieldState('totalAmount', (state) => {
      state.value = value;
    });
  });

  FormEffectHooks.onFieldValueChange$('floatingAmount').subscribe(async ({value, inputed}) => {
    if (!inputed) {
      return;
    }
    const money = await new Promise((resolve) => {
      resolve(getFieldState('money'));
    }) || {};
    setFieldState('totalAmount', (state) => {
      state.value = MathCalc(money.value, value, 'jia');
    });
  });

  FormEffectHooks.onFieldValueChange$('totalAmount').subscribe(async ({value, inputed}) => {
    if (!inputed) {
      return;
    }
    const money = await new Promise((resolve) => {
      resolve(getFieldState('money'));
    }) || {};
    setFieldState('floatingAmount', (state) => {
      state.value = MathCalc(value,money.value,'jian');
    });

    const paymentDetail = await new Promise((resolve) => {
      resolve(getFieldState('paymentDetail'));
    });
    setFieldState('paymentDetail', (state) => {
      if (paymentDetail && Array.isArray(paymentDetail.value)) {
        state.value = paymentDetail.value.map((item) => {
          if (item) {
            return {
              ...item,
              money: MathCalc(MathCalc(item.percentum,100,'chu'),value,'cheng'),
            };
          }
          return item;
        });
      } else {
        state.value = [{}];
      }
    });
  });

  FormEffectHooks.onFieldValueChange$('paymentDetail.*.percentum').subscribe(async ({
    name,
    value,
    inputed,
  }) => {

    if (!value) {
      return;
    }
    const money = await new Promise((resolve) => {
      resolve(getFieldState('totalAmount'));
    });
    const paymentDetail = await new Promise((resolve) => {
      resolve(getFieldState('paymentDetail'));
    });
    if (!money || !money.value) {
      setFieldState(FormPath.transform(name, /\d/, ($1) => {
        return `paymentDetail.${$1}.percentum`;
      }), (state) => {
        state.value = null;
      });
      return inputed && message.warn('请输入采购总价！');
    }
    if (paymentDetail && paymentDetail.value) {
      let percentum = 0;
      paymentDetail.value.map((item) => {
        if (item) {
          return percentum = MathCalc(percentum, item.percentum, 'jia');
        }
        return true;
      });
      if (percentum > 100) {
        setFieldState(FormPath.transform(name, /\d/, ($1) => {
          return `paymentDetail.${$1}.percentum`;
        }), (state) => {
          state.value = null;
        });
        return message.warn('总比例不能超过百分之百！');
      }
    }

    setFieldState(FormPath.transform(name, /\d/, ($1) => {
      return paymentDetail.value[$1] && `paymentDetail.${$1}.money`;
    }), (state) => {
      state.value = MathCalc(money.value,(value / 100),'cheng');
    });
    if (paymentDetail.value) {
      let percentum = 0;
      paymentDetail.value.map((item, index) => {
        if (item && item.percentum) {
          percentum = MathCalc(percentum, item.percentum, 'jia');
        } else if (index !== paymentDetail.value.length - 1) {
          percentum = 0;
        }
        return null;
      });

      if (percentum && !(paymentDetail.value[paymentDetail.value.length - 1] && paymentDetail.value[paymentDetail.value.length - 1].percentum)) {
        setFieldState(`paymentDetail.${paymentDetail.value.length - 1}.percentum`, (state) => {
          state.value = MathCalc(100,percentum,'jian');
        });
      }
    }
  });

  FormEffectHooks.onFieldValueChange$('paymentDetail.*.money').subscribe(async ({
    name,
    value,
    inputed
  }) => {

    if (!inputed) {
      return;
    }
    const money = await new Promise((resolve) => {
      resolve(getFieldState('money'));
    });
    const paymentDetail = await new Promise((resolve) => {
      resolve(getFieldState('paymentDetail'));
    });
    if (!money || !money.value) {
      setFieldState(FormPath.transform(name, /\d/, ($1) => {
        return `paymentDetail.${$1}.money`;
      }), (state) => {
        state.value = null;
      });
      return inputed && message.warn('请输入采购总价！');
    }
    if (paymentDetail && paymentDetail.value) {
      let number = 0;
      paymentDetail.value.map((item) => {
        if (item) {
          return number = MathCalc(number, item.money, 'jia');
        }
        return true;
      });
      if (number > money.value) {
        setFieldState(FormPath.transform(name, /\d/, ($1) => {
          return `paymentDetail.${$1}.percentum`;
        }), (state) => {
          state.value = null;
        });
        return message.warn('不能超过总金额！');
      }
    }
    setFieldState(FormPath.transform(name, /\d/, ($1) => {
      return paymentDetail.value[$1] && `paymentDetail.${$1}.percentum`;
    }), (state) => {
      if (!value) {
        return state.value = 0;
      }
      state.value = MathCalc(MathCalc(value,money.value,'chu'),100,'cheng');
    });
  });
};

const contractAction = (setFieldState) => {
  FormEffectHooks.onFieldValueChange$('generateContract').subscribe(({value}) => {
    setFieldState('templateId', (state) => {
      state.visible = value === 1;
    });
    setFieldState('contractCoding', (state) => {
      state.visible = value === 1;
    });
    setFieldState('labelResults', (state) => {
      state.visible = value === 1;
    });
    setFieldState('fileId', (state) => {
      state.visible = value === 2;
    });
  });


  FormEffectHooks.onFieldValueChange$('templateId').subscribe(async ({value}) => {
    if (value) {
      setFieldState('labelResults', (state) => {
        state.props.array = null;
        state.value = [];
      });
      const res = await request({...templateGetLabel, params: {templateId: value}});
      if (!res) {
        return;
      }
      setFieldState('labelResults', (state) => {
        state.props.array = res;
      });
    }

  });


};

const ordedrAction = (setFieldState) => {
  FormEffectHooks.onFieldValueChange$('currency').subscribe(({value}) => {
    setFieldState('detailParams', (state) => {
      state.props.currency = value;
    });
  });

  // FormEffectHooks.onFieldValueChange$('leadTime').subscribe(({value, inputed}) => {
  //   if (inputed) {
  //     setFieldState('deliveryDate', (state) => {
  //       state.value = new Date(moment(new Date()).add(value, 'day'));
  //     });
  //   }
  // });
  //
  // FormEffectHooks.onFieldValueChange$('deliveryDate').subscribe(({value, inputed}) => {
  //   if (inputed) {
  //     setFieldState('leadTime', (state) => {
  //       state.value = moment(value).diff(new Date(), 'day');
  //     });
  //   }
  // });

};

export const EffectsAction = (setFieldState, getFieldState, getCustomer) => {
  customerAAction(setFieldState, getCustomer);
  customerBAction(setFieldState, getCustomer);
  paymentAction(setFieldState, getFieldState);
  contractAction(setFieldState);
  ordedrAction(setFieldState);
};
