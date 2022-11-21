import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Spin} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import Select from '@/components/Select';
import Modal from '@/components/Modal';
import AdressEdit from '@/pages/Crm/adress/AdressEdit';
import SelectCustomer from '@/pages/Crm/customer/components/SelectCustomer';
import ContactsEdit from '@/pages/Crm/contacts/ContactsEdit';
import PhoneEdit from '@/pages/Crm/phone/phoneEdit';
import {useRequest} from '@/util/Request';
import {bankListSelect} from '@/pages/Purshase/bank/bankUrl';
import BankEdit from '@/pages/Purshase/bank/bankEdit';
import InvoiceEdit from '@/pages/Crm/invoice/invoiceEdit';

export const Customer = (props) => {
  return (<SelectCustomer width="100%" noAdd {...props} />);
};

export const Adress = (props) => {

  const {customerId, options, defaultValue, adressType, ...other} = props;

  const [option, setOption] = useState([]);

  useEffect(() => {
    if (Array.isArray(options)) {
      setOption(options || []);
      let value = null;
      if (options.map(item => item.value).includes(other.value)) {
        value = other.value;
      }
      props.onChange(value || defaultValue);
    }
  }, [customerId, options]);

  const ref = useRef();

  const submitRef = useRef();

  return <>
    <Select options={option || []} {...other} />

    <Button type="link" icon={<PlusOutlined />} style={{margin: 0}} onClick={() => {
      if (customerId) {
        ref.current.open(false);
      } else {
        message.warn('请先选择客户！');
      }
    }} />

    <Modal
      width={500}
      headTitle="添加地址"
      ref={ref}
      footer={<>
        <Button type="primary" onClick={() => {
          submitRef.current.submit();
        }}>
          保存
        </Button>
        <Button onClick={() => {
          ref.current.close();
        }}>
          取消
        </Button>
      </>}
    >
      <AdressEdit
        adressType={adressType}
        ref={submitRef}
        onSuccess={(res) => {
          ref.current.close();
          const array = option.filter(() => true);
          array.push({
            label: res.detailLocation || res.location,
            value: res.adressId,
          });
          setOption(array);
          props.onChange(res.adressId);
        }}
        value={false}
        customer={customerId}
        NoButton={false}
      />
    </Modal>
  </>;
};

export const Contacts = (props) => {

  const {customerId, options, defaultValue, ...other} = props;

  const [option, setOption] = useState([]);

  useEffect(() => {
    if (Array.isArray(options)) {
      setOption(options || []);
      let value = null;
      if (options.map(item => item.value).includes(other.value)) {
        value = other.value;
      }
      props.onChange(value || defaultValue);
    }
  }, [customerId, options]);

  const ref = useRef();

  const submitRef = useRef();

  return <>
    <Select options={option || []} {...other} />

    <Button type="link" icon={<PlusOutlined />} style={{margin: 0}} onClick={() => {
      if (customerId) {
        ref.current.open(false);
      } else {
        message.warn('请先选择客户！');
      }
    }} />

    <Modal
      width={800}
      headTitle="添加联系人"
      ref={ref}
      footer={<>
        <Button type="primary" onClick={() => {
          submitRef.current.submit();
        }}>
          保存
        </Button>
        <Button onClick={() => {
          ref.current.close();
        }}>
          取消
        </Button>
      </>}
    >
      <ContactsEdit
        ref={submitRef}
        onSuccess={(res) => {
          ref.current.close();
          const array = option.filter(() => true);
          array.push({
            label: res.contactsName,
            value: res.contactsId,
          });
          setOption(array);
          props.onChange(res.contactsId);
        }}
        value={false}
        customerId={customerId}
      />
    </Modal>
  </>;
};

export const Phone = (props) => {

  const {contactsId, options, defaultValue, ...other} = props;

  const [option, setOption] = useState([]);

  useEffect(() => {
    if (Array.isArray(options)) {
      setOption(options || []);
      let value = null;
      if (options.map(item => item.value).includes(other.value)) {
        value = other.value;
      }
      props.onChange(value || defaultValue);
    }
  }, [contactsId, options]);

  const ref = useRef();

  const submitRef = useRef();

  return <>
    <Select options={option || []} {...other} />

    <Button type="link" icon={<PlusOutlined />} style={{margin: 0}} onClick={() => {
      if (contactsId) {
        ref.current.open(false);
      } else {
        message.warn('请先选择联系人！');
      }

    }} />

    <Modal
      width={500}
      headTitle="添加联系人电话"
      ref={ref}
      footer={<>
        <Button type="primary" onClick={() => {
          submitRef.current.submit();
        }}>
          保存
        </Button>
        <Button onClick={() => {
          ref.current.close();
        }}>
          取消
        </Button>
      </>}
    >
      <PhoneEdit
        NoButton={false}
        ref={submitRef}
        onSuccess={(res) => {
          ref.current.close();
          const array = option.filter(() => true);
          array.push({
            label: `${res.phoneNumber.toString().substring(0, 3)}****${res.phoneNumber.toString().substring(7)}`,
            value: res.phoneId,
          });
          setOption(array);
          props.onChange(res.phoneId);
        }}
        value={false}
        contactsId={contactsId}
      />
    </Modal>
  </>;
};

export const BankAccount = (props) => {

  const {customerId, bankId, options, defaultValue, ...other} = props;

  const [option, setOption] = useState([]);

  useEffect(() => {
    if (customerId && Array.isArray(options)) {
      let array = options;
      if (bankId) {
        array = options.filter((item) => {
          return item.id === bankId;
        });
      }
      let value = null;
      if (array.map(item => item.value).includes(other.value)) {
        value = other.value;
      }
      props.onChange(value || defaultValue);
      setOption(array || []);
    } else {
      setOption([]);
      props.onChange(null);
    }
  }, [customerId, bankId, options]);

  const ref = useRef();

  const submitRef = useRef();

  return <>
    <Select options={option || []} {...other} />

    <Button type="link" icon={<PlusOutlined />} style={{margin: 0}} onClick={() => {
      if (customerId) {
        ref.current.open(false);
      } else {
        message.warn('请先选择客户！');
      }

    }} />

    <Modal
      width={500}
      headTitle="添加银行账户"
      ref={ref}
      footer={<>
        <Button type="primary" onClick={() => {
          submitRef.current.submit();
        }}>
          保存
        </Button>
        <Button onClick={() => {
          ref.current.close();
        }}>
          取消
        </Button>
      </>}
    >

      <InvoiceEdit
        ref={submitRef}
        bankId={bankId}
        value={false}
        NoButton={false}
        customerId={customerId}
        onSuccess={(res) => {
          ref.current.close();
          if (res.data) {
            const array = option.filter(() => true);
            array.push({
              label: res.data.bankAccount,
              value: res.data.invoiceId,
            });
            setOption(array);
            props.onChange(res.data.invoiceId);
          }

        }} />

    </Modal>
  </>;
};

export const Bank = (props) => {

  const {customerId, ...other} = props;

  const {loading, data, refresh} = useRequest(bankListSelect);

  const ref = useRef();

  const submitRef = useRef();

  return loading ? <Spin /> : <>
    <Select options={data || []} {...other} />

    <Button type="link" icon={<PlusOutlined />} style={{margin: 0}} onClick={() => {
      ref.current.open(false);
    }} />

    <Modal
      width={500}
      headTitle="银行"
      ref={ref}
      footer={<>
        <Button type="primary" onClick={() => {
          submitRef.current.submit();
        }}>
          保存
        </Button>
        <Button onClick={() => {
          ref.current.close();
        }}>
          取消
        </Button>
      </>}
    >
      <BankEdit ref={submitRef} value={false} NoButton={false} onSuccess={(res) => {
        refresh();
        if (res && res.data) {
          props.onChange(res.data.bankId);
        }
      }} />
    </Modal>
  </>;
};

