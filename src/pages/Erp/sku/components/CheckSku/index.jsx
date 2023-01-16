import React, {useImperativeHandle, useRef, useState} from 'react';
import {Button, Input} from 'antd';
import {createFormActions} from '@formily/antd';
import {useSetState} from 'ahooks';
import {skuV1List} from '@/pages/Erp/sku/skuUrl';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import SkuEdit from '@/pages/Erp/sku/skuEdit';
import Form from '@/components/Form';
import SkuDetail from '@/pages/Erp/sku/SkuDetail';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import Render from '@/components/Render';
import SearchValueFormat from '@/components/SearchValueFormat';

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
        <GroupSku
          onChange={(id, type) => {
            if (type === 'reset') {
              tableRef.current.reset();
              return;
            }
            tableRef.current.formActions.setFieldValue('categoryId', null);
            tableRef.current.formActions.setFieldValue('keyWord', null);
            tableRef.current.formActions.setFieldValue('partsId', null);
            switch (type) {
              case 'skuClass':
                tableRef.current.formActions.setFieldValue('categoryId', id);
                break;
              case 'skuName':
                tableRef.current.formActions.setFieldValue('keyWord', id);
                break;
              case 'parts':
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
      </>
    );
  };

  const render = (value, record, index, formActions) => {
    return <Render>
      <SearchValueFormat
        searchValue={formActions.getFieldValue('keyWord')}
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
      render: (value, record, index, formActions) => {
        return render(`${value} ${record.skuName ? ` / ${record.skuName}` : ''}${record.specifications ? ` / ${record.specifications}` : ''}`, record, index, formActions);
      }
    },
  ];


  return (
    <>
      <Table
        columns={columns}
        api={skuV1List}
        contentHeight
        formActions={formActionsPublic}
        actions={!noCreate && <Button type="primary" onClick={() => {
          refAdd.current.open(false);
        }}>创建物料</Button>}
        SearchButton
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
              array.push(record);
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
      />

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
