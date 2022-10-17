import React from 'react';
import {Button} from 'antd';
import {useHistory} from 'ice';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';

const FormList = () => {

  const history = useHistory();

  const columns = [
    {title: '模块'},
    {
      title: '操作', width: 50, align: 'center', render: () => {
        return <Button type="link" onClick={() => {
          history.push('/form/config');
        }}>配置表单</Button>;
      }
    }
  ];

  return <>
    <Table
      title={<Breadcrumb />}
      rowKey="key"
      columns={columns}
      dataSource={[{key: 1}]}
    />
  </>;
};

export default FormList;
