import React, {useState} from 'react';
import {Select as AntSelect, Spin} from 'antd';
import {useRequest} from '@/util/Request';
import {partsList} from '@/pages/Erp/parts/PartsUrl';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';

const BomComparison = (
  {
    comparisonParts,
    onComparisonParts = () => {
    },
    comparisonSku,
    onParts = () => {
    },
    addSku = () => {
    }
  }) => {

  const params = {limit: 20, page: 1};

  const [value, onChange] = useState();

  const [parts, setParts] = useState([]);

  const [openDrawer, setOpenDrawer] = useState();

  const {loading: listLoading, data: list, run: getList} = useRequest({...partsList, params});

  const options = (!listLoading && list) ? list.map((item) => {
    const skuResult = item.skuResult || {};
    return {
      label: <SkuResultSkuJsons skuResult={skuResult} />,
      value: item.partsId
    };
  }) : [];

  return <>
    {!openDrawer && <AntSelect
      value={value}
      allowClear
      placeholder="搜索BOM"
      style={{width: '100%'}}
      showSearch
      filterOption={false}
      notFoundContent={listLoading && <div style={{textAlign: 'center'}}><Spin /></div>}
      options={options}
      onSearch={(string) => {
        getList({
          data: {
            skuName: string,
          },
          params
        });
      }}
      onChange={(value) => {
        if (!value) {
          onComparisonParts([]);
        }
        onChange(value);
      }}
    />}

    {value && <PartsEdit
      addSku={addSku}
      comparison
      comparisonSku={comparisonSku}
      comparisonParts={comparisonParts}
      openDrawer={setOpenDrawer}
      parts={parts}
      onParts={onParts}
      setParts={(newParts) => {
        onComparisonParts(newParts);
        setParts(newParts);
      }}
      show
      firstEdit
      value={value}
    />}
  </>;
};

export default BomComparison;
