import React, {useRef, useState} from 'react';
import {Button, Input, message, Space} from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import Table from '@/components/Table';
import {useRequest} from '@/util/Request';
import {stockForewarnAdd, stockForewarnSave} from '@/pages/Erp/StockForewarn/url';
import Form from '@/components/Form';
import {skuV1List} from '@/pages/Erp/sku/skuUrl';
import Render from '@/components/Render';
import InputNumber from '@/components/InputNumber';
import BottomButton from '@/components/BottomButton';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import SearchValueFormat from '@/components/SearchValueFormat';

const {FormItem} = Form;

const Set = () => {

  const tableRef = useRef();

  const [data, setData] = useState([]);

  const [bomSku, setBomSku] = useState({});

  const [bomId, setBomId] = useState();

  const [showBatch, setShowBatch] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const {loading: addLoading, run: add} = useRequest(stockForewarnAdd, {
    response: true,
    manual: true,
    onSuccess: () => {
      message.success('设置成功!');
      tableRef.current.refresh();
    }
  });

  const {loading: stockForewarnSaveLoading, run: stockForewarnSaveRun} = useRequest(stockForewarnSave, {
    response: true,
    manual: true,
    onSuccess: () => {
      setData([]);
      message.success('设置成功!');
      tableRef.current.refresh();
    }
  });

  const render = (value) => {
    return <Render>
      <SearchValueFormat
        searchValue={searchValue}
        label={value || '-'}
      />
    </Render>;
  };

  const columns = [
    {title: '物料编码', width: 200, sorter: true, dataIndex: 'standard', render},
    {title: '物料分类', width: 140, sorter: true, dataIndex: 'categoryName', render},
    {
      title: '物料',
      dataIndex: 'spuName',
      sorter: true,
      render: (value, record) => {
        return render(`${value} ${record.skuName ? ` / ${record.skuName}` : ''}${record.specifications ? ` / ${record.specifications}` : ''}`);
      }
    },
    {
      title: '库存下限',
      width: 140,
      align: 'center',
      dataIndex: 'stockWarningMin',
      render: (value, record) => {
        const sku = data.find(item => item.skuId === record.skuId);
        return <InputNumber
          value={sku ? sku.inventoryFloor : value}
          width={140}
          min={0}
          placeholder="请输入"
          onChange={(inventoryFloor) => {
            let exit = false;
            const newData = data.map(item => {
              if (item.skuId === record.skuId) {
                exit = true;
                return {
                  ...item,
                  inventoryFloor,
                  inventoryCeiling: item.inventoryCeiling <= inventoryFloor ? null : item.inventoryCeiling
                };
              }
              return item;
            });
            if (!exit) {
              newData.push({
                skuId: record.skuId,
                inventoryFloor,
                inventoryCeiling: record?.stockWarningMax <= inventoryFloor ? null : record?.stockWarningMax
              });
            }
            setData(newData);
          }}
        />;
      }
    },
    {
      title: '库存上限',
      width: 140,
      align: 'center',
      dataIndex: 'stockWarningMax',
      render: (value, record) => {
        const sku = data.find(item => item.skuId === record.skuId);
        return <InputNumber
          value={sku ? sku.inventoryCeiling : value}
          width={140}
          min={sku?.inventoryFloor ? sku.inventoryFloor + 1 : 0}
          placeholder="请输入"
          onChange={(inventoryCeiling) => {
            let exit = false;
            const newData = data.map(item => {
              if (item.skuId === record.skuId) {
                exit = true;
                return {
                  ...item,
                  inventoryCeiling,
                };
              }
              return item;
            });
            if (!exit) {
              newData.push({
                skuId: record.skuId,
                inventoryCeiling,
                inventoryFloor: record?.stockWarningMin
              });
            }
            setData(newData);
          }}
        />;
      }
    },
    {
      title: '操作',
      width: 70,
      align: 'center',
      dataIndex: 'action',
      render: (value, record) => {

        const sku = data.find(item => item.skuId === record.skuId);

        return <Space>
          <Button
            type="link"
            onClick={() => {
              let exit = false;
              const newData = data.map(item => {
                if (item.skuId === record.skuId) {
                  exit = true;
                  return {
                    ...item,
                    inventoryCeiling: null,
                    inventoryFloor: null,
                  };
                }
                return item;
              });
              if (!exit) {
                newData.push({
                  skuId: record.skuId,
                  inventoryCeiling: null,
                  inventoryFloor: null,
                });
              }
              setData(newData);
            }}
          >
            重置
          </Button>
          <Button
            type="link"
            disabled={!sku || (record.stockWarningMin === sku.inventoryFloor && record.stockWarningMax === sku.inventoryCeiling)}
            onClick={async () => {
              await add({
                data: {params: [{...sku, formId: sku.skuId, type: 'sku'}]}
              });
              setData(data.filter(item => item.skuId !== record.skuId));
            }}
          >
            保存
          </Button>
        </Space>;
      }
    },

  ];

  if (showBatch) {
    columns.splice(3, 0, {
      title: '配套数量',
      width: 140,
      dataIndex: 'number'
    });
  }

  const searchForm = () => {
    return <>
      <GroupSku
        onChange={(id, type) => {
          if (type === 'reset') {
            setSearchValue('');
            tableRef.current.reset();
            return;
          }
          tableRef.current.formActions.setFieldValue('categoryId', null);
          tableRef.current.formActions.setFieldValue('keyWord', null);
          tableRef.current.formActions.setFieldValue('partsId', null);
          switch (type) {
            case 'skuClass':
              setSearchValue('');
              tableRef.current.formActions.setFieldValue('categoryId', id);
              break;
            case 'skuName':
              setSearchValue(id);
              tableRef.current.formActions.setFieldValue('keyWord', id);
              break;
            case 'parts':
              setSearchValue('');
              setBomId(id);
              tableRef.current.formActions.setFieldValue('partsId', id);
              break;
            default:
              break;
          }
          tableRef.current.submit();
        }} />
      <div hidden>
        <FormItem name="keyWord" component={Input} />
        <FormItem name="partsId" component={Input} />
        <FormItem name="categoryId" component={Input} />
      </div>
      {
        showBatch && <Space align="center">
          <div style={{marginLeft: 24}}>批量设置：</div>
          <InputNumber
            value={bomSku.inventoryFloor}
            width={140}
            min={0}
            placeholder="下限"
            onChange={(inventoryFloor) => {
              setBomSku({
                ...bomSku,
                inventoryFloor,
                inventoryCeiling: bomSku.inventoryCeiling <= inventoryFloor ? null : bomSku.inventoryCeiling
              });
            }}
          />
          <InputNumber
            width={140}
            value={bomSku.inventoryCeiling}
            min={bomSku.inventoryFloor + 1}
            placeholder="上限"
            onChange={(inventoryCeiling) => {
              setBomSku({...bomSku, inventoryCeiling});
            }}
          />
          <Button loading={stockForewarnSaveLoading} style={{padding: 0}} type="link" onClick={() => {
            stockForewarnSaveRun({
              data: {
                'bomId': bomId,
                'InventoryFloor': bomSku.inventoryFloor,
                'InventoryCeiling': bomSku.inventoryCeiling
              }
            });
          }}>保存</Button>
        </Space>
      }
    </>;
  };

  return <>
    <Table
      cardHeaderStyle={{display: 'none'}}
      title={<Breadcrumb title="预警设置" />}
      onReset={() => setBomId()}
      contentHeight="calc(100vh - 175px)"
      formSubmit={(values) => {
        setShowBatch(values.partsId);
        return values;
      }}
      SearchButton
      noTableColumnSet
      loading={addLoading}
      searchForm={searchForm}
      api={skuV1List}
      ref={tableRef}
      rowKey="skuId"
      columns={columns}
      noRowSelection
    />

    <BottomButton textAlign="right">
      <Button disabled={data.length === 0} loading={addLoading} type="primary" onClick={async () => {
        await add({data: {params: data.map(item => ({...item, formId: item.skuId, type: 'sku'}))}});
        setData([]);
      }}>保存</Button>
    </BottomButton>
  </>;
};

export default Set;
