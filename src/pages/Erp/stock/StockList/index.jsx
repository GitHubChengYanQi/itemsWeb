/**
 * 仓库总表列表页
 *
 * @author
 * @Date 2021-07-15 11:13:02
 */

import React, {useRef, useState} from 'react';
import Table from '@/components/Table';
import {Button, Divider, Table as AntTable, Tree} from 'antd';
import DelButton from '@/components/DelButton';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import {customerBatchDelete} from '@/pages/Crm/customer/CustomerUrl';
import {MegaLayout} from '@formily/antd-components';
import {FormButtonGroup, Submit} from '@formily/antd';
import {SearchOutlined} from '@ant-design/icons';
import Icon from '@/components/Icon';
import CheckButton from '@/components/CheckButton';
import {stockList, storehouse} from '../StockUrl';
import * as SysField from '../StockField';
import {useRequest} from "@/util/Request";
import ListLayout from "@/layouts/ListLayout";
import CustomerTable from "@/pages/Crm/customer/components/CustomerTable";
import StockTable from "@/pages/Erp/stock/components/StockTable";
import Select from '@/components/Select';
import {customerIdSelect} from '@/pages/Crm/contacts/contactsUrl';

const {Column} = AntTable;
const {FormItem} = Form;

const StockList = () => {

  const {loading, data,run} = useRequest({ url: '/storehouse/list',method: 'POST'});

  const Storehouse = data ? data.map((values) => {
    return {
      title: values.name,
      key: values.storehouseId,
    };
  }) : [];

  const [value,setValue] = useState();


  const [state, setState] = useState();

  const Left = () => {
    return (
      <>
        <div>
          <Select api={storehouse} placeholder='搜索仓库' value={value} bordered={false} notFoundContent={null} defaultActiveFirstOption={false} onChange={async (value)=>{
            await run(
              {
                data:{
                  storehouseId : value
                }
              }
            );
            setValue(value);
          }} />
        </div>
        <Tree
          showLine
          onSelect={(value) => {
            setState(value);
          }}
          defaultExpandedKeys={['']}
          treeData={[
            {
              title: '所有仓库',
              key: '',
              children: Storehouse
            },
          ]}
        />
      </>);
  };
  return (
    <ListLayout>
      <StockTable left={Left()} state={state}/>
    </ListLayout>
  );
};

export default StockList;
