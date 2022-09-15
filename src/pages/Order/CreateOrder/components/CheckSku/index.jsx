import React, {useImperativeHandle, useRef} from 'react';
import {Input, Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import {useSetState} from 'ahooks';
import InputNumber from '@/components/InputNumber';
import Table from '@/components/Table';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {toBuyPlanList} from '@/pages/Purshase/ToBuyPlan/Url';
import SelectSku from '@/pages/Erp/sku/components/SelectSku';
import {supplyList} from '@/pages/Crm/supply/supplyUrl';
import {skuList} from '@/pages/Erp/sku/skuUrl';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const CheckSku = ({
  value = [],
  type,
  customerId,
  ...props
}, ref) => {

  const {pathname} = props.location;

  const module = (record) => {
    const skuResult = record.skuResult || {};
    if (type === 'supplySku') {
      return {
        api: toBuyPlanList,
        coding: skuResult.standard,
        skuResult: <SkuResultSkuJsons skuResult={record.skuResult} />,
        brandResult: record.brandResult && record.brandResult.brandName || '无指定品牌',
        stockNumber: record.stockNumber,
        applyNumber: null,
        unitResult: skuResult.spuResult && skuResult.spuResult.unitResult && skuResult.spuResult.unitResult.unitName,
      };
    }
    switch (pathname) {
      case '/purchase/toBuyPlan/createOrder':
        return {
          api: toBuyPlanList,
          coding: skuResult.standard,
          skuResult: <SkuResultSkuJsons skuResult={record.skuResult} />,
          brandResult: record.brandResult && record.brandResult.brandName || '无指定品牌',
          stockNumber: record.stockNumber,
          applyNumber: null,
          unitResult: skuResult.spuResult && skuResult.spuResult.unitResult && skuResult.spuResult.unitResult.unitName,
        };
      case '/purchase/order/createOrder':
        return {
          api: skuList,
          coding: record.standard,
          skuResult: <SkuResultSkuJsons skuResult={record} />,
          brandResult: '无指定品牌',
          stockNumber: null,
          applyNumber: null,
          unitResult: record.spuResult && record.spuResult.unitResult && record.spuResult.unitResult.unitName,
        };
      default:
        return <></>;
    }
  };

  const [skus, setSkus] = useSetState({
    data: value || []
  });


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
          label="物料"
          name="skuId"
          placeholder="请选择物料"
          component={SelectSku}
        />
        <FormItem
          label="库存数量低于"
          name="number"
          component={InputNumber}
        />
        <FormItem
          hidden
          name="customerId"
          value={customerId}
          component={Input}
        />
      </>
    );
  };

  const result = (record) => {
    if (type === 'supplySku') {
      return {
        key: record.key,
        skuId: record.skuId,
        coding: record.skuResult.standard,
        skuResult: record.skuResult,
        brandId: record.brandId,
        defaultBrandResult: record.brandResult && record.brandResult.brandName,
        preordeNumber: record.applyNumber,
        unitId: record.skuResult && record.skuResult.spuResult && record.skuResult.spuResult.unitId,
      };
    }
    switch (pathname) {
      case '/purchase/toBuyPlan/createOrder':
        return {
          key: record.key,
          skuId: record.skuId,
          coding: record.skuResult.standard,
          skuResult: record.skuResult,
          brandId: record.brandId,
          defaultBrandResult: record.brandResult && record.brandResult.brandName,
          preordeNumber: record.applyNumber,
          unitId: record.skuResult && record.skuResult.spuResult && record.skuResult.spuResult.unitId,
        };
      case '/purchase/order/createOrder':
        return {
          key: record.key,
          skuId: record.skuId,
          coding: record.standard,
          skuResult: record,
          preordeNumber: 0,
          unitId: record.spuResult && record.spuResult.unitId,
        };
      default:
        return <></>;
    }
  };

  const key = (item) => {
    return item.skuId + (item.brandId || '');
  };

  return (
    <>
      <Table
        api={type === 'sku' ? module({}).api : supplyList}
        NoChildren
        contentHeight
        branch={(data) => {
          return data && data.map((item) => {
            return {
              ...item,
              key: key(item),
            };
          });
        }}
        formActions={formActionsPublic}
        rowKey="key"
        pageSize={5}
        noSort
        searchForm={searchForm}
        ref={tableRef}
        rowSelection={{
          selectedRowKeys: skus.data.map((item) => {
            return item.key;
          }),
          onSelect: (record, selected) => {
            if (selected) {
              const array = skus.data.filter(() => true);
              array.push(result(record));
              setSkus({data: array});
            } else {
              const array = skus.data.filter((item) => {
                return item.key !== key(record);
              });
              setSkus({data: array});
            }
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            if (selected) {
              const ids = skus.data.map((item) => {
                return item.key;
              });
              const array = selectedRows.filter((item) => {
                return item && !ids.includes(key(item));
              }).map((item) => {
                return result(item);
              });
              setSkus({data: skus.data.concat(array)});
            } else {
              const deleteIds = changeRows.map((item) => {
                return key(item);
              });
              const array = skus.data.filter((item) => {
                return !deleteIds.includes(item.key);
              });
              setSkus({data: array});
            }
          }
        }
        }
      >
        <Column title="序号" width={70} align="center" render={(value, record, index) => {
          return <>{index + 1}</>;
        }} />
        <Column title="物料编号" width={120} dataIndex="skuResult" render={(value, record) => {
          return module(record).coding;
        }} />
        <Column
          title="物料"
          sorter={(a, b) => {
            const aSort = a.spuResult && a.spuResult.spuClassificationResult && a.spuResult.spuClassificationResult.name;
            const bSort = b.spuResult && b.spuResult.spuClassificationResult && b.spuResult.spuClassificationResult.name;
            return aSort.length - bSort.length;
          }}
          dataIndex="skuResult"
          render={(value, record) => {
            return module(record).skuResult;
          }}
        />
        <Column
          title="品牌 / 厂家"
          dataIndex="brandResult"
          render={(value, record) => {
            return <div style={{minWidth:100}}>{module(record).brandResult}</div>;
          }} />
        <Column title="库存数量" width={100} dataIndex="stockNumber" />
        {/* <Column title="在途数量" width={100} dataIndex="stockNumber" /> */}
        <Column title="预购数量" width={100} dataIndex="applyNumber" />
        <Column
          title="单位"
          width={100}
          dataIndex="skuResult"
          render={(value, record) => {
            return module(record).unitResult;
          }} />

      </Table>
    </>
  );
};

export default React.forwardRef(CheckSku);
