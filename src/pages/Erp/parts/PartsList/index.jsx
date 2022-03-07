/**
 * 清单列表页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Descriptions, Radio} from 'antd';
import {createFormActions} from '@formily/antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {backDetails, partsList} from '../PartsUrl';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import EditButton from '@/components/EditButton';
import AddButton from '@/components/AddButton';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import Table from '@/components/Table';
import * as SysField from '../PartsField';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {request, useRequest} from '@/util/Request';
import ShowBOM from '@/pages/Erp/parts/components/ShowBOM';
import Drawer from '@/components/Drawer';
import {skuDetail} from '@/pages/Erp/sku/skuUrl';
import BackSkus from '@/pages/Erp/sku/components/BackSkus';

const {Column} = Table;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const PartsList = ({
  spuId,
  spuSkuId,
  value,
  getPartsId = () => {
  },
  type = 1
}) => {

  const refAdd = useRef();
  const formRef = useRef();
  const tableRef = useRef();
  const showRef = useRef();

  const [radio, setRadio] = useState('1');

  const [loading, setLoading] = useState();

  const [key, setKey] = useState([]);

  const {loading: skuLoading, data: skuData, run: sku} = useRequest(skuDetail, {manual: true});

  useEffect(() => {
    if (value) {
      sku({
        data: {
          skuId: value
        }
      });
    }
  }, []);

  const [bom, setBom] = useState();

  if (skuLoading) {
    return <ProSkeleton type="descriptions" />;
  }

  const action = () => {
    return (
      <AddButton onClick={() => {
        refAdd.current.open(false);
      }} />
    );
  };

  const searchForm = () => {

    return (
      <>
        <FormItem
          label="物料"
          placeholder="请选择物料"
          name="skuId"
          value={value || null}
          noAdd
          component={SysField.SkuId} />
        <FormItem
          hidden
          placeholder="请选择物料"
          name="spuId"
          value={spuId}
          component={SysField.PartName} />
        <FormItem
          hidden
          name="type"
          value={type}
          component={SysField.PartName} />
        <FormItem
          hidden
          name="status"
          value={99}
          component={SysField.PartName} />
      </>
    );
  };

  return (
    <>
      <>
        {value && skuData && <>
          <Descriptions style={{margin: 24, marginBottom: 0}} column={2} contentStyle={{fontWeight: 700}}>
            <Descriptions.Item label="编号">{skuData.standard}</Descriptions.Item>
            <Descriptions.Item label="物料"><BackSkus record={skuData} /></Descriptions.Item>
            <Descriptions.Item label="描述">
              {
                skuData.list
                &&
                skuData.list.length > 0
                &&
                skuData.list[0].attributeValues
                  ?
                  <em>({skuData.list.map((items) => {
                    return `${items.itemAttributeResult.attribute} ： ${items.attributeValues}`;
                  }).toString()})</em>
                  :
                  '无'
              }
            </Descriptions.Item>
          </Descriptions>
        </>}

        <Table
          cardHeaderStyle={{display: value === false && 'none'}}
          listHeader={value}
          formActions={formActionsPublic}
          headStyle={spuId && {display: 'none'}}
          title={value !== false  && <Breadcrumb title="物料清单" />}
          actions={action()}
          searchForm={searchForm}
          ref={tableRef}
          noSort
          contentHeight
          noRowSelection
          api={partsList}
          rowKey="key"
          tableKey="parts"
          isChildren
          branch={(data) => {
            return data.map((items) => {
              return {
                key: items.partsId,
                ...items,
                children: []
              };
            });
          }}
          expandable={{
            expandedRowKeys: key,
            onExpand: async (expand, record) => {
              if (expand) {
                const res = await request({...backDetails, params: {id: record.skuId, type}});

                record.children = res && res.length > 0 && res.map((items) => {
                  return {
                    key: `${record.key}_${items.skuId}`,
                    ...items,
                    children: items.isNull && [],
                  };
                });

                setKey([...key, record.key]);

              } else {
                const array = key.filter((item) => {
                  return item !== record.key;
                });
                setKey(array);
              }
            }
          }}
        >
          <Column title="物料" key={1} dataIndex="skuResult" render={(value) => {
            return (<SkuResultSkuJsons skuResult={value} />);
          }} />
          <Column title="数量" key={2} dataIndex="number" render={(value) => {
            return <>{value || null}</>;
          }} />
          <Column title="备注" key={3} visible={spuSkuId && false} dataIndex="note" />
          <Column title="创建人" key={4} visible={spuSkuId && false} dataIndex="userResult" render={(value) => {
            return <>{value && value.name}</>;
          }} />
          <Column title="创建时间" key={5} visible={spuSkuId && false} dataIndex="createTime" render={(value, record) => {
            return !record.partsDetailId && <>{value}</>;
          }} />

          <Column
            title="操作"
            key={99}
            fixed="right"
            align="center"
            dataIndex="partsId"
            width={150}
            render={(value, record) => {
              return record.children && <>
                {
                  spuSkuId
                    ?
                    <Button type="link" onClick={() => {
                      getPartsId(record.id || value);
                    }}>拷贝</Button>
                    :
                    <>
                      <EditButton onClick={() => {
                        refAdd.current.open(record.id || value);
                      }} />
                      <Button type="link" onClick={() => {
                        showRef.current.open(record.id || value);
                      }}>详情</Button>
                    </>
                }

              </>;
            }} />
        </Table>


      </>

      <Modal
        width={1200}
        type={type}
        title="清单"
        bom={bom}
        loading={setLoading}
        compoentRef={formRef}
        component={PartsEdit}
        onClose={() => {
          setBom(null);
        }}
        onSuccess={() => {
          if (bom && bom.type) {
            setRadio(bom.type);
            tableRef.current.formActions.setFieldValue('type', bom.type);
          }
          setBom(null);
          tableRef.current.submit();
          refAdd.current.close();
        }}
        ref={refAdd}
        spuId={spuId}
        footer={<>
          <Button type="primary" loading={loading} onClick={() => {
            formRef.current.submit();
          }}>保存</Button>
        </>}
      />

      <Drawer
        extra
        height="100%"
        placement="top"
        headTitle="物料清单"
        width={1000}
        component={ShowBOM}
        ref={showRef}
      />

    </>
  );
};

export default PartsList;
