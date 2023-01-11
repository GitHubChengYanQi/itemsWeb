import React, {useEffect, useRef, useState} from 'react';
import {Button, Input, message, Space} from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import Table from '@/components/Table';
import {useRequest} from '@/util/Request';
import {stockForewarnSave} from '@/pages/Erp/StockForewarn/url';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {skuList} from '@/pages/Erp/sku/skuUrl';
import Render from '@/components/Render';
import InputNumber from '@/components/InputNumber';
import BottomButton from '@/components/BottomButton';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import {skuPriceAdd, skuPriceAddBatch, skuPriceList} from '@/pages/Erp/StockMoney/url';

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

  const [buttonState, setButtonState] = useState({});

  const [priceList, setPricelist] = useState({});

  const {run: add} = useRequest(skuPriceAdd, {
    manual: true
  });

  const {loading: addLoading, run: AddBatch} = useRequest(skuPriceAddBatch, {
    response: true,
    manual: true,
  });

  const {run: getPriceList} = useRequest(skuPriceList,{
    manual: true,
    onSuccess: (data) => {
      const tmp = {};
      data .forEach((item) => {
        tmp[`${item.skuId}`] = item.price;
      });
      setPricelist(tmp);
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
        return <Render text={value?.spuClassificationResult?.name}/>;
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
          value={sku ? sku.price : priceList[record.skuId]}
          width={140}
          min={0}
          precision={2}
          placeholder="请输入"
          onChange={(price) => {
            let newData = [...data];
            const index = data.findIndex(item =>item.skuId === record.skuId);
            if (index !== -1) newData.splice(index, 1);
            newData.push({
              skuId: record.skuId,
              price,
            });
            const tmp = {};

            newData = newData.filter(item => {
              if (item.skuId === record.skuId && priceList[item.skuId] === item.price) {
                tmp[`${item.skuId}`] = false;
                return false;
              } else {
                tmp[`${item.skuId}`] = true;
                return item;
              }
            });

            setButtonState({...buttonState, ...tmp});
            setData(newData);
          }}
        />;
      }
    },
    {
      title: '操作', width: 70, align: 'center', dataIndex: 'action', render: (text, record) => {
        return <Button
          disabled={!buttonState[record.skuId]}
          type="link"
          onClick={async () => {
            const sku = data.find(item => item.skuId === record.skuId);

            await add({data: {...sku}});

            const index = data.findIndex(item => item.skuId === record.skuId);
            const newData = [...data];
            if(index!==-1)newData.splice(index,1);
            setData(newData);
            const tmp = {};
            newData.forEach(item => {
              tmp[`${item.skuId}`] = true;
            });
            setButtonState(tmp);
            message.success('设置成功!');
            tableRef.current.refresh();
          }}
        >
          保存
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
      }}/>
      <div hidden>
        <FormItem name="skuName" component={Input}/>
        <FormItem name="spuClass" component={Input}/>
        <FormItem name="partsSkuId" component={Input}/>
      </div>
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
      title={<Breadcrumb/>}
      onReset={() => setBomId()}
      contentHeight="calc(100vh - 175px)"
      formSubmit={(values) => {
        setShowBatch(values);
        return values;
      }}
      format={(list) => {
        setList(list);
        const skuIds = list.map(item=>item.skuId);
        getPriceList({
          data:{skuIds}
        });
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
      <Button disabled={data.length === 0} loading={addLoading} type="primary" onClick={async () => {
        // 批量保存
        await AddBatch({data: {skuPriceParamList: data}});
        setData([]);
        setButtonState({});
        message.success('设置成功!');
        tableRef.current.refresh();
      }}>保存</Button>
    </BottomButton>
  </>;
};

export default StockMoney;
