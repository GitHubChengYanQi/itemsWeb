import React from 'react';
import {Avatar, Comment, Table as AntTable} from 'antd';
import * as SysField from '@/pages/Crm/customer/CustomerField';
import Form from '@/components/Form';
import Table from '@/components/Table';
import {createFormActions} from '@formily/antd';

const {Column} = AntTable;

const formActionsPublic = createFormActions();

const Dynamic = (props) => {


  const {value, api} = props;
  const {FormItem} = Form;

  if (!value) {
    return null;
  }

  const datas = (value) => {
    return {
      author: value.userResult ? value.userResult.name : '--',
      avatar: <Avatar>{value.userResult && value.userResult.name && value.userResult.name.substring(0, 1)}</Avatar>,
      content: (
        <>
          <p style={{padding: 10}}>{value.content}</p>
        </>
      ),
      datetime: (
        <span>{value.createTime}</span>
      ),
    };
  };

  const searchForm = () => {

    return (
      <div style={{maxWidth: 800}}>

        {!value.businessId ?
          <FormItem
            placeholder="customerId"
            hidden
            value={value.customerId}
            name="customerId"
            component={SysField.Name} />
          :
          <FormItem
            placeholder="businessId"
            hidden
            value={value.businessId}
            name="businessId"
            component={SysField.Name} />}

      </div>
    );
  };


  return (
    <div>
      <Table
        formActions={formActionsPublic}
        headStyle={{display: 'none'}}
        searchForm={searchForm}
        selectionType
        noRowSelection
        noSort
        bodyStyle={{padding: 0}}
        bordered={false}
        showHeader={false}
        dynamic
        showSearchButton={false}
        api={api}
        rowKey="dynamicId"
      >
        <Column width={0} />
        <Column render={(text, record) => {
          return (
            <Comment
              style={{padding: 0}}
              {...datas(record)}
            />
          );
        }} />
      </Table>
    </div>
  );
};

export default Dynamic;
