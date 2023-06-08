/**
 * 清单列表页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Descriptions, Space, Tag} from 'antd';
import {createFormActions} from '@formily/antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {config, useHistory, useLocation} from 'ice';
import cookie from 'js-cookie';
import {backDetails, partsList} from '../PartsUrl';
import Breadcrumb from '@/components/Breadcrumb';
import EditButton from '@/components/EditButton';
import AddButton from '@/components/AddButton';
import Table from '@/components/Table';
import * as SysField from '../PartsField';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {request, useRequest} from '@/util/Request';
import ShowBOM from '@/pages/Erp/parts/components/ShowBOM';
import Drawer from '@/components/Drawer';
import {skuDetail} from '@/pages/Erp/sku/skuUrl';
import BackSkus from '@/pages/Erp/sku/components/BackSkus';
import Import from '@/pages/Erp/sku/SkuTable/Import';
import Note from '@/components/Note';
import Render from '@/components/Render';
import AddSkuModal from '@/pages/Erp/sku/SkuTable/AddSkuModal';

const {Column} = Table;
const {FormItem} = Form;

const {baseURI} = config;

const PartsList = (
  {
    spuId,
    spuSkuId,
    value,
    getPartsId = () => {
    },
    type = 1
  }) => {

  const addRef = useRef();

  const {state = {}} = useLocation();
  const history = useHistory();

  const [formActionsPublic] = useState(createFormActions);

  const tableRef = useRef();
  const showRef = useRef();

  const token = cookie.get('tianpeng-token');

  const [key, setKey] = useState([]);

  const {loading: skuLoading, data: skuData, run: sku} = useRequest(skuDetail, {manual: true});

  useEffect(() => {
    if (value && typeof value !== 'boolean') {
      sku({
        data: {
          skuId: value
        }
      });
    }
  }, []);

  if (skuLoading) {
    return <ProSkeleton type="descriptions"/>;
  }

  const action = () => {
    return (
      <AddButton name="创建物料清单" onClick={() => {
        history.push('/SPU/parts/edit');
        // refAdd.current.open(false);
      }}/>
    );
  };

  const searchForm = () => {

    return (
      <>
        <FormItem
          label="物料名称"
          placeholder="搜索物料"
          name="skuName"
          component={SysField.SkuInput}/>
        <div style={{display: 'none'}}>
          <FormItem
            name="skuId"
            value={value || null}
            component={SysField.SkuInput}
          />
          <FormItem
            name="partsId"
            value={state.partsId || null}
            component={SysField.SkuInput}
          />
          <FormItem
            placeholder="请选择物料"
            name="spuId"
            value={spuId}
            component={SysField.PartName}
          />
          <FormItem
            name="type"
            value={type}
            component={SysField.PartName}
          />
          <FormItem
            name="status"
            value={99}
            component={SysField.PartName}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <>
        {value && skuData && <div>
          <Descriptions style={{margin: 24, marginBottom: 0}} column={2} contentStyle={{fontWeight: 700}}>
            <Descriptions.Item label="编号">{skuData.standard}</Descriptions.Item>
            <Descriptions.Item label="物料"><BackSkus record={skuData}/></Descriptions.Item>
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
        </div>}

        <Table
          isModal={false}
          actionButton={<Space>
            <Import
              url={`${baseURI}Excel/importBom`}
              title="导入BOM"
              module="bom"
              templateUrl={`${baseURI}Excel/downloadBomTemplate?authorization=${token}`}
              onOk={() => {
                tableRef.current.submit();
              }}
            />
          </Space>}
          cardHeaderStyle={{display: value === false && 'none'}}
          listHeader={value}
          formActions={formActionsPublic}
          headStyle={(spuId || spuSkuId) && {display: 'none'}}
          title={value !== false && <Breadcrumb title="物料清单"/>}
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
          format={(data) => {
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
          <Column title="物料" key={3} dataIndex="skuResult" render={(value) => {
            return (<Note width={400}><SkuResultSkuJsons skuResult={value}/></Note>);
          }}/>
          <Column title="物料编码" key={2} dataIndex="skuResult" render={(value) => {
            return <Render maxWidth={200}>
              <Note maxWidth={200}>{value?.standard || '无'}</Note>
            </Render>;
          }}/>
          <Column title="版本号" key={1} dataIndex="name" render={(value, record) => {
            if (!record.children) {
              return <></>;
            }
            return <Render width={200}>
              <Tag color="processing"><Note maxWidth={200}>{value || '-'}</Note></Tag>
            </Render>;
          }}/>
          <Column title="数量" key={4} dataIndex="number" align="center" render={(value) => {
            return <div style={{minWidth: 50}}>{value || null}</div>;
          }}/>
          <Column title="备注" key={1} visible={spuSkuId && false} dataIndex="note" render={(value) => {
            return <Render width={100}>
              {value || '-'}
            </Render>;
          }}/>
          <Column title="创建人" key={6} visible={spuSkuId && false} dataIndex="userResult" render={(value) => {
            return <>{value && value.name}</>;
          }}/>
          <Column
            title="创建时间"
            key={7}
            visible={spuSkuId && false}
            dataIndex="createTime"
            render={(value, record) => {
              return !record.partsDetailId && <>{value}</>;
            }}
          />

          <Column
            title="操作"
            key={99}
            fixed="right"
            align="center"
            dataIndex="partsId"
            width={spuSkuId ? 70 : 250}
            render={(value, record) => {
              if (record.children) {
                if (spuSkuId) {
                  return <Button type="link" onClick={() => {
                    getPartsId(record.id || value);
                  }}>拷贝</Button>;
                } else {
                  return <>
                    <Button type="link" onClick={() => {
                      addRef.current.open({skuId: record.skuId, copy: true});
                    }}>拷贝</Button>
                    <Button type="link" onClick={() => {
                      window.open(`${baseURI}parts/excelExport?authorization=${token}&partsId=${value}`);
                    }}>导出</Button>
                    <EditButton onClick={() => {
                      history.push({
                        pathname: '/SPU/parts/edit',
                        search: `id=${record.id || value}`
                      });
                    }}/>
                    <Button type="link" onClick={() => {
                      history.push({
                        pathname: '/SPU/parts/edit',
                        search: `id=${record.id || value}&type=show`
                      });
                    }}>详情</Button>
                  </>;
                }
              }
            }}/>
        </Table>
      </>

      <AddSkuModal
        add={false}
        edit
        addRef={addRef}
        copy
        onSuccess={() => {
          tableRef.current.submit();
          addRef.current.close();
        }}
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
