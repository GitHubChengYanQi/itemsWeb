import React, {useRef, useState} from 'react';
import {Button, Input, notification, Popover, Select} from 'antd';
import {useHistory} from 'ice';
import useUrlState from '@ahooksjs/use-url-state';
import {useBoolean} from 'ahooks';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';
import {warningSku} from '@/pages/Erp/StockForewarn/url';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import Render from '@/components/Render';
import CreatePrePurchase, {purchaseListListBySkuId} from '@/pages/Erp/StockForewarn/components/CreatePrePurchase';
import {useRequest} from '@/util/Request';
import Scope from '@/components/Scope';
import Icon from '@/components/Icon';

const {FormItem} = Form;

const List = () => {

  const tableRef = useRef(null);
  const skuListRef = useRef(null);

  const [search, {toggle}] = useBoolean(false);

  const history = useHistory();

  const [open, setOpen] = useState();

  const [skuId, setSkuId] = useState();

  const {
    loading: purchaseListListLoading,
    data: purchaseListList = [],
    run: getPurchaseList
  } = useRequest(purchaseListListBySkuId, {
    manual: true,
    onSuccess() {
      setOpen(skuId);
    }
  });

  const [state] = useUrlState(
    {
      navigateMode: 'push',
    },
  );

  const defaultTableQuery = state.params && JSON.parse(state.params) || {};
  const tableQueryValues = defaultTableQuery.values || {};
  let defaultSearchType = '';
  if (tableQueryValues.classId) {
    defaultSearchType = 'skuClass';
  }

  const searchForm = () => {

    const types = [
      {value: 'all', label: '全部'},
      {value: 'min', label: '下限预警'},
      {value: 'max', label: '上限预警'},
    ];

    return (
      <>
        <GroupSku
          style={{marginRight: 12}}
          defaultSearchType={defaultSearchType}
          value={tableQueryValues.showValue}
          ref={skuListRef}
          align="start"
          noSearchButton
          noParts
          onChange={(id, type, showValue) => {
            tableRef.current.formActions.setFieldValue('showValue', showValue);
            tableRef.current.formActions.setFieldValue('classId', null);
            tableRef.current.formActions.setFieldValue('keyWords', null);
            switch (type) {
              case 'skuClass':
                tableRef.current.formActions.setFieldValue('classId', id);
                break;
              case 'skuName':
                tableRef.current.formActions.setFieldValue('keyWords', id);
                break;
              default:
                break;
            }
            tableRef.current.submit();
          }} />
        <div hidden>
          <FormItem name="showValue" component={Input} />
          <FormItem name="keyWords" label="基础物料" component={Input} />
          <FormItem name="classId" label="基础物料" component={Input} />
        </div>
        <div style={{height: 12}} />
        <FormItem
          label="预警状态"
          name="forewarnStatus"
          style={{width: '230px'}}
          options={types}
          placeholder="请选择"
          component={Select} />
        <div hidden={!search}>
          <FormItem
            label="库存数量"
            name="number"
            component={Scope}
            placeholder="值"
          />
        </div>
        <div hidden={!search}>
          <FormItem
            label="在途数量"
            name="floatingCargoNumber"
            component={Scope}
            placeholder="值"
          />
        </div>
        <div hidden={!search}>
          <FormItem
            label="待采数量"
            name="purchaseNumber"
            component={Scope}
            placeholder="值"
          />
        </div>
        <div hidden={!search}>
          <FormItem
            label="缺欠数量"
            name="storage"
            component={Scope}
            placeholder="值"
          />
        </div>
      </>
    );
  };

  const columns = [
    {
      title: '物料编码', width: 200, sorter: true, dataIndex: 'standard', render: (value, record) => {
        return (<Render>{record?.skuResult?.standard}</Render>);
      }
    },
    {
      title: '物料分类', width: 140, sorter: true, dataIndex: 'className', render: (value, record) => {
        return <Render>{record?.skuResult?.spuResult?.spuClassificationResult?.name}</Render>;
      }
    },
    {
      title: '物料', dataIndex: 'spuName', sorter: true, render: (value, record) => {
        return <Button type="link" onClick={() => {
          history.push(`/SPU/sku/${record.skuId}`);
        }}>
          {SkuResultSkuJsons({skuResult: record.skuResult})}
        </Button>;
      }
    },
    {title: '库存数量', width: 100, sorter: true, dataIndex: 'number'},
    {
      title: '在途数量', width: 120, sorter: true, dataIndex: 'floatingCargoNumber', render(value) {
        return <Button type="link" onClick={() => {
          history.push('/purchase/order');
        }}>{value}</Button>;
      }
    },
    {
      title: '待采数量', width: 120, sorter: true, dataIndex: 'purchaseNumber', render(value) {
        return <Button type="link" onClick={() => {
          history.push('/purchase/toBuyPlan');
        }}>{value || 0}</Button>;
      }
    },
    {
      title: '缺欠数量', width: 100, sorter: true, dataIndex: 'storage', render: (text) => {
        return (
          <Render>
            {typeof text === 'number' ? text : '-'}
          </Render>);
      }
    },
    {
      title: '库存下限', width: 100, sorter: true, dataIndex: 'inventoryFloor', render: (text, record) => {
        return (
          <Render
            style={{color: record.number <= record.inventoryFloor ? 'red' : ''}}>{typeof text === 'number' ? text : '-'}</Render>);
      }
    },
    {
      title: '库存上限', width: 100, sorter: true, dataIndex: 'inventoryCeiling', render: (text, record) => {
        return (
          <Render
            style={{color: record.number >= record.inventoryCeiling ? 'red' : ''}}>{typeof text === 'number' ? text : '-'}</Render>);
      }
    }, {
      title: '操作', width: 100, sorter: true, align: 'center', dataIndex: 'inventoryCeiling', render: (text, record) => {
        const disabled = record.number > record.inventoryFloor;
        if (disabled) {
          return <Button
            disabled
            type="link"
          >备采</Button>;
        }
        const openPopover = open === record.skuId;

        return (
          <Render>
            <Popover
              open={openPopover}
              content={openPopover && <CreatePrePurchase
                purchaseListList={purchaseListList}
                sku={record}
                onCancel={() => {
                  setOpen(null);
                }}
                onSuccess={() => {
                  setOpen(null);
                  notification.success({
                    message: '保存成功！',
                    description: <a onClick={() => history.push('/purchase/toBuyPlan')}>点击查看预购列表</a>,
                    placement: 'bottomRight',
                  });
                  tableRef.current.reset();
                }}
              />}
              title="添加预购物料"
              trigger="click"
              placement="topRight"
              onOpenChange={(open) => {
                if (!open) {
                  setOpen(null);
                }
              }}
            >
              <Button
                type="link"
                loading={skuId === record.skuId && purchaseListListLoading}
                onClick={() => {
                  setSkuId(record.skuId);
                  getPurchaseList({
                    params: {
                      skuId: record.skuId
                    }
                  });
                }}
              >备采</Button>
            </Popover>
          </Render>);
      }
    },

  ];

  const actions = () => {
    return <>
      <Button type="primary" onClick={() => {
        history.push('/ERP/stockForewarn/Set');
      }}>预警设置</Button>
    </>;
  };

  return <>
    <Table
      noRowSelection
      layout={!search ? 'inline' : 'horizontal'}
      otherActions={<Button
        type="link"
        title={search ? '收起高级搜索' : '展开高级搜索'}
        onClick={() => {
          toggle();
        }}>
        <Icon type={search ? 'icon-shouqi' : 'icon-gaojisousuo'}
        />{search ? '收起' : '高级'}
      </Button>}
      formSubmit={(values) => {
        Object.keys(values).forEach(item => {
          switch (item) {
            case 'number':
            case 'floatingCargoNumber':
            case 'purchaseNumber':
            case 'storage':
              values = {
                ...values,
                [`${item}Max`]: values[item].maxNum,
                [`${item}Min`]: values[item].mixNum
              };
              break;
            default:
              break;
          }
        });
        return values;
      }}
      isModal={false}
      noTableColumnSet
      onReset={() => {
        skuListRef.current.reset();
      }}
      ref={tableRef}
      api={warningSku}
      title={<Breadcrumb />}
      columns={columns}
      rowKey="skuId"
      searchForm={searchForm}
      actions={actions()}
    />

  </>;
};

export default List;
