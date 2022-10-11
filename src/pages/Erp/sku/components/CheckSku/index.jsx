import React, {useImperativeHandle, useRef, useState} from 'react';
import {Button, Space, Table as AntTable} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {createFormActions} from '@formily/antd';
import {useSetState} from 'ahooks';
import * as SysField from '@/pages/Erp/sku/skuField';
import {skuList} from '@/pages/Erp/sku/skuUrl';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import SkuEdit from '@/pages/Erp/sku/skuEdit';
import Form from '@/components/Form';
import SkuDetail from '@/pages/Erp/sku/SkuDetail';
import Note from '@/components/Note';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const CheckSku = ({
  noCreate,
  value = [],
}, ref) => {

  const [loading, setLoading] = useState();

  const [skus, setSkus] = useSetState({data: value || []});

  const refAdd = useRef(null);

  const detailRef = useRef(null);

  const formRef = useRef(null);

  const tableRef = useRef(null);

  const change = () => {
    return skus.data;
  };

  const check = () => {
    return skus.data;
  };

  useImperativeHandle(ref, () => ({
    change,
    check
  }));

  const searchForm = () => {

    return (
      <>
        <FormItem
          label="物料分类"
          name="spuClass"
          placeholder="请选择分类"
          component={SysField.SelectSpuClass}
          onChange={()=>{
            tableRef.current.submit();
          }}
        />
        <FormItem
          placeholder="请输入 名称 / 型号 / 编码"
          name="skuName"
          component={SysField.SelectSkuName} />
      </>
    );
  };


  return (
    <>
      <Table
        api={skuList}
        contentHeight
        formActions={formActionsPublic}
        actions= {!noCreate && <Button type='primary' onClick={() => {
          refAdd.current.open(false);
        }}>创建物料</Button>}
        SearchButton={<Space>
          <Button htmlType='submit' type='primary' onClick={() => {
            tableRef.current.submit();
          }}><SearchOutlined />查询</Button>
        </Space>}
        rowKey="skuId"
        pageSize={5}
        noSort
        searchForm={searchForm}
        ref={tableRef}
        rowSelection={{
          selectedRowKeys: skus.data.map((item) => {
            return item.skuId;
          }),
          onSelect: (record, selected) => {
            if (selected) {
              const array = skus.data.filter(() => true);
              array.push({
                skuId: record.skuId,
                coding: record.standard,
                skuResult: record,
              });
              setSkus({data: array});
            } else {
              const array = skus.data.filter((item) => {
                return item.skuId !== record.skuId;
              });
              setSkus({data: array});
            }
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            if (selected) {
              const ids = skus.data.map((item) => {
                return item.skuId;
              });
              const array = selectedRows.filter((item) => {
                return item && !ids.includes(item.skuId);
              }).map((item) => {
                return {
                  skuId: item.skuId,
                  coding: item.standard,
                  skuResult: item
                };
              });
              setSkus({data: skus.data.concat(array)});
            } else {
              const deleteIds = changeRows.map((item) => {
                return item.skuId;
              });
              const array = skus.data.filter((item) => {
                return !deleteIds.includes(item.skuId);
              });
              setSkus({data: array});
            }
          }
        }}
      >
        <Column title="序号" width={70} align="center" render={(value, record, index) => {
          return <>{index + 1}</>;
        }} />
        <Column title="物料编码" dataIndex="standard" />
        <Column
          title="物料名称"
          key={2}
          sorter={(a, b) => {
            const aSort = a.spuResult && a.spuResult.spuClassificationResult && a.spuResult.spuClassificationResult.name;
            const bSort = b.spuResult && b.spuResult.spuClassificationResult && b.spuResult.spuClassificationResult.name;
            return aSort.length - bSort.length;
          }}
          dataIndex="spuResult"
          render={(value) => {
            return <Note maxWidth={200}>
              {value && value.name}
            </Note>;
          }} />
        <Column
          title="型号 / 规格"
          key={2}
          dataIndex="skuName"
          render={(value, record) => {
            return <Note maxWidth={200}>
              {`${value} / ${record.specifications || '无'}`}
            </Note>;
          }} />

        <Column
          title="物料描述"
          key={2}
          dataIndex="skuId"
          width={200}
          render={(value, record) => {
            return <Note value={
              record.skuJsons
              &&
              record.skuJsons.length > 0
              &&
              record.skuJsons[0].values.attributeValues
                ?
                record.skuJsons.map((items) => {
                  return `${items.attribute.attribute} : ${items.values.attributeValues}`;
                }).toString()
                :
                '无'
            } />;
          }} />

        <Column title="操作" key={8} dataIndex="skuId" width={100} align="center" render={(value) => {
          return <Button type="link" onClick={() => {
            detailRef.current.open(value);
          }}>详情</Button>;
        }} />

      </Table>

      <Modal ref={detailRef} width={1000} component={SkuDetail} />

      <Modal
        title="物料"
        addUrl={{
          url: '/sku/indirectAdd',
          method: 'POST',
          rowKey: 'skuId'
        }}
        compoentRef={formRef}
        loading={(load) => {
          setLoading(load);
        }}
        component={SkuEdit}
        onSuccess={() => {
          tableRef.current.submit();
          refAdd.current.close();
        }}
        ref={refAdd}
        footer={<>
          <Button
            loading={loading}
            type="primary"
            ghost
            onClick={() => {
              formRef.current.nextAdd(true);
            }}
          >完成并添加下一个</Button>
          <Button
            loading={loading}
            type="primary"
            onClick={() => {
              formRef.current.nextAdd(false);
            }}
          >完成</Button>
        </>} />
    </>
  );
};

export default React.forwardRef(CheckSku);
