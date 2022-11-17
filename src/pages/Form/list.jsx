import React, {useRef} from 'react';
import {Button} from 'antd';
import {useHistory} from 'ice';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import {formList} from '@/pages/Form/url';
import AddButton from '@/components/AddButton';
import Drawer from '@/components/Drawer';
import Add from '@/pages/Form/Add';

const FormList = () => {

  const ref = useRef();
  const tableRef = useRef();

  const history = useHistory();

  const columns = [
    {
      title: '模块', dataIndex: 'formType', render: (value) => {
        switch (value) {
          case 'PO':
            return '采购单';
          default:
            return '';
        }
      }
    },
    {
      title: '操作', width: 50,dataIndex: 'styleId', align: 'center', render: (value) => {
        return <Button type="link" onClick={() => {
          history.push(`/form/config?id=${value}`);
        }}>配置表单</Button>;
      }
    }
  ];

  return <>
    <Table
      ref={tableRef}
      actions={<AddButton onClick={() => ref.current.open(false)} />}
      api={formList}
      title={<Breadcrumb />}
      rowKey="styleId"
      columns={columns}
    />


    <Drawer
      ref={ref}
      component={Add}
      onSuccess={() => {
        tableRef.current.submit();
        ref.current.close();
      }}
    />
  </>;
};

export default FormList;
