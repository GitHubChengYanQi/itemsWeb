/**
 * 清单列表页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useRef, useState} from 'react';
import {Button, Input, Tag} from 'antd';
import {createFormActions} from '@formily/antd';
import {useHistory, useLocation} from 'ice';
import {bomListV2Url} from '../PartsUrl';
import Breadcrumb from '@/components/Breadcrumb';
import AddButton from '@/components/AddButton';
import Table from '@/components/Table';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import Note from '@/components/Note';

const {FormItem} = Form;


const NewPartsList = (
  {
    selectOne,
    onSelectOne = () => {
    },
  }) => {


  const history = useHistory();

  const [formActionsPublic] = useState(createFormActions);

  const tableRef = useRef();

  const action = () => {
    return (
      <AddButton name="创建物料清单" onClick={() => {
        history.push('/SPU/parts/edit');
      }} />
    );
  };

  const searchForm = () => {

    return (
      <>
        <FormItem
          placeholder="请输入关键字搜索"
          name="keywords"
          component={Input}
        />
      </>
    );
  };

  const columns = [
    {
      title: '物料', dataIndex: 'skuResult', render(skuResult) {
        return SkuResultSkuJsons({skuResult});
      }
    },
    {
      title: '版本号', dataIndex: 'version', render(value) {
        return <Tag color="processing"><Note maxWidth={200}>{value || '-'}</Note></Tag>;
      }
    },
    {
      title: '备注', dataIndex: 'note',width:70, render(value) {
        return <Note maxWidth={200}>{value || '-'}</Note>;
      }
    },
    {
      title: '操作', fixed: 'right', align: 'center', width: 100, render(value, record) {
        return <>
          <Button type="link" onClick={() => {
            onSelectOne(record);
          }}>选择</Button>
        </>;
      }
    }
  ];

  return (
    <>
      <Table
        columns={columns}
        pageSize={selectOne ? 10 : 20}
        noTableColumnSet
        cardHeaderStyle={{display: selectOne && 'none'}}
        formActions={formActionsPublic}
        title={!selectOne && <Breadcrumb title="物料清单" />}
        actions={!selectOne && action()}
        searchForm={searchForm}
        ref={tableRef}
        contentHeight={selectOne}
        noRowSelection
        api={bomListV2Url}
        rowKey="bomId"
      />
    </>
  );
};

export default NewPartsList;
