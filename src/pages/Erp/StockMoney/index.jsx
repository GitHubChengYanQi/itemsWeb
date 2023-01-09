import React, {useEffect, useRef, useState} from 'react';
import {Button, Input, message, Space} from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import Table from '@/components/Table';
import {useRequest} from '@/util/Request';
import {stockForewarnAdd, stockForewarnSave} from '@/pages/Erp/StockForewarn/url';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {skuList} from '@/pages/Erp/sku/skuUrl';
import Render from '@/components/Render';
import InputNumber from '@/components/InputNumber';
import BottomButton from '@/components/BottomButton';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';

const {FormItem} = Form;

const StockMoney = () => {

  const tableRef = useRef();

  const [list, setList] = useState([]);

  const [data, setData] = useState([]);

  const [batchSku, setBatchSku] = useState({});

  const [bomId, setBomId] = useState();

  const [showBatch, setShowBatch] = useState({});

  const [loading, setLoading] = useState(false);

  const batch = Object.keys(showBatch).filter(item => showBatch[item]).length > 0;

  const {loading: addLoading, run: add} = useRequest(stockForewarnAdd, {
    response: true,
    manual: true,
    onSuccess: () => {
      setData([]);
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

  const columns = [
    {title: '物料编码', width: 200, sorter: true, dataIndex: 'standard'},
    {
      title: '物料分类', width: 140, dataIndex: 'spuResult', render: (value) => {
        return <Render text={value?.spuClassificationResult?.name} />;
      }
    },
    {
      title: '物料', dataIndex: 'spuName', sorter: true, render: (value, record) => {
        return SkuResultSkuJsons({skuResult: record});
      }
    },
    {
      title: '金额',
      width: 140,
      align: 'center',
      dataIndex: 'stockForewarnResult',
      render: (stockForewarnResult, record) => {
        const sku = data.find(item => item.skuId === record.skuId);

        return <InputNumber
          value={sku ? sku.price : stockForewarnResult?.price}
          width={140}
          min={0}
          precision={2}
          placeholder="请输入"
          onChange={(price) => {
            let exit = false;
            const newData = data.map(item => {
              if (item.skuId === record.skuId) {
                exit = true;
                return {
                  ...item,
                  price,
                };
              }
              return item;
            });
            if (!exit) {
              newData.push({
                skuId: record.skuId,
                price,
              });
            }
            setData(newData);
          }}
        />;
      }
    },
    {
      title: '操作', width: 70, align: 'center', dataIndex: 'action', render: (text, record) => {
        return <Button
          type="link"
          onClick={() => {
            let exit = false;
            const newData = data.map(item => {
              if (item.skuId === record.skuId) {
                exit = true;
                return {
                  ...item,
                  price: null,
                };
              }
              return item;
            });
            if (!exit) {
              newData.push({
                skuId: record.skuId,
                price: null,
              });
            }
            setData(newData);
          }}
        >
          重置
        </Button>;
      }
    },

  ];

  const searchForm = () => {
    return <>
      <GroupSku onChange={(id, type, otherData = {}) => {
        if (type === 'reset') {
          tableRef.current.reset();
          return;
        }
        tableRef.current.formActions.setFieldValue('spuClass', null);
        tableRef.current.formActions.setFieldValue('skuName', null);
        tableRef.current.formActions.setFieldValue('partsSkuId', null);
        switch (type) {
          case 'skuClass':
            tableRef.current.formActions.setFieldValue('spuClass', id);
            break;
          case 'skuName':
            tableRef.current.formActions.setFieldValue('skuName', id);
            break;
          case 'parts':
            setBomId(id);
            tableRef.current.formActions.setFieldValue('partsSkuId', otherData.skuId);
            break;
          default:
            break;
        }
        tableRef.current.submit();
      }} />
      <div hidden>
        <FormItem name="skuName" label="基础物料" component={Input} />
        <FormItem name="spuClass" label="基础物料" component={Input} />
        <FormItem name="partsSkuId" label="基础物料" component={Input} />
      </div>
      {
        batch > 0 && <Space align="center">
          <div style={{marginLeft: 24}}>批量设置：</div>
          <InputNumber
            value={batchSku.price}
            width={140}
            precision={2}
            min={0}
            placeholder="金额"
            onChange={(price) => {
              const newData = list.map(item => ({
                skuId: item.skuId,
                price
              }));
              setData(newData);
              setBatchSku({...batchSku, price});
            }}
          />
          <Button loading={stockForewarnSaveLoading} style={{padding: 0}} type="link" onClick={() => {
            // 条件保存
            // partsSkuId 清单物料id ，清单id为 bomId
            // spuClass 分类id
            // skuName 物料名称
            // 哪个存在表示批量设置哪个
            console.log(showBatch);
            // stockForewarnSaveRun({
            //   data: {
            //     'bomId': bomId,
            //     'price': batchSku.price,
            //   }
            // });
          }}>确定</Button>
        </Space>
      }
    </>;
  };

  useEffect(() => {
    if (batch && typeof batchSku.price === 'number') {
      const newData = list.map(item => ({
        skuId: item.skuId,
        price: batchSku.price
      }));
      setData(newData);
    }
  }, [loading]);

  return <>
    <Table
      onLoading={setLoading}
      cardHeaderStyle={{display: 'none'}}
      title={<Breadcrumb />}
      onReset={() => setBomId()}
      contentHeight="calc(100vh - 175px)"
      formSubmit={(values) => {
        setShowBatch(values);
        return values;
      }}
      format={(list) => {
        setList(list);
        return list;
      }}
      SearchButton
      noTableColumnSet
      loading={addLoading}
      searchForm={searchForm}
      api={skuList}
      ref={tableRef}
      rowKey="skuId"
      columns={columns}
      noRowSelection
    />

    <BottomButton textAlign="right">
      <Button disabled={data.length === 0} loading={addLoading} type="primary" onClick={() => {
        // 批量保存
        console.log(data);
        // add({data: {params: data.map(item => ({...item, formId: item.skuId, type: 'sku'}))}});
      }}>保存</Button>
    </BottomButton>
  </>;
};

export default StockMoney;
