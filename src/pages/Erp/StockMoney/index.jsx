import React, {useRef, useState} from 'react';
import {Button, Input, message} from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import Table from '@/components/Table';
import {useRequest} from '@/util/Request';
import Form from '@/components/Form';
import {skuV1List} from '@/pages/Erp/sku/skuUrl';
import Render from '@/components/Render';
import InputNumber from '@/components/InputNumber';
import BottomButton from '@/components/BottomButton';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import {skuPriceAdd, skuPriceAddBatch} from '@/pages/Erp/StockMoney/url';
import SearchValueFormat from '@/components/SearchValueFormat';

const {FormItem} = Form;

const StockMoney = () => {

  const tableRef = useRef();

  const [data, setData] = useState([]);

  const [buttonState, setButtonState] = useState({});

  const [searchValue, setSearchValue] = useState('');

  const {run: add} = useRequest(skuPriceAdd, {
    manual: true
  });

  const {loading: addLoading, run: AddBatch} = useRequest(skuPriceAddBatch, {
    response: true,
    manual: true,
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
      title: '金额',
      width: 140,
      align: 'center',
      dataIndex: 'price',
      render: (value, record) => {
        const sku = data.find(item => item.skuId === record.skuId);
        return <InputNumber
          value={sku ? sku.price : value}
          width={140}
          min={0}
          precision={2}
          placeholder="请输入"
          addonAfter="元"
          onChange={(price) => {
            let newData = [...data];
            const index = data.findIndex(item => item.skuId === record.skuId);
            if (index !== -1) newData.splice(index, 1);
            newData.push({
              skuId: record.skuId,
              price,
            });
            const tmp = {};

            newData = newData.filter(item => {
              if (item.skuId === record.skuId && (value || 0) === (item.price || 0)) {
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
            if (index !== -1) newData.splice(index, 1);
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
    </>;
  };

  return <>
    <Table
      cardHeaderStyle={{display: 'none'}}
      title={<Breadcrumb />}
      contentHeight="calc(100vh - 175px)"
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
