import React, {useRef, useState} from 'react';
import * as SysField from '@/pages/Erp/instock/InstockField';
import {createFormActions} from '@formily/antd';
import { Button, message, Modal,  Table as AntTable} from 'antd';
import Icon from '@/components/Icon';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import {instock, instockEdit} from '@/pages/Erp/instock/InstockUrl';
import Form from '@/components/Form';
import {useRequest} from '@/util/Request';
import ProCard from '@ant-design/pro-card';
import InstockListTable from '@/pages/Erp/instock/InstockList/components/InstockListTable';
import Cascader from '@/components/Cascader';
import {storehousePositionsTreeView} from '@/pages/Erp/storehouse/components/storehousePositions/storehousePositionsUrl';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const Instock = (props) => {

  const [show, setShow] = useState();

  const [position, setPosition] = useState();

  const tableRef = useRef(null);
  const instockRef = useRef(null);

  const [items, setItems] = useState();

  const {run} = useRequest(instockEdit, {
    manual: true, onSuccess: () => {
      setShow(false);
      tableRef.current.submit();
      instockRef.current.tableRef.current.submit();
    }
  });

  const searchForm = () => {

    return (
      <FormItem name="instockOrderId" value={props.value} component={SysField.barcode} />
    );
  };


  return (
    <div style={{padding: 24}}>
      <ProCard className="h2Card" headerBordered title="入库清单">
        <Table
          title={<Breadcrumb />}
          api={instock}
          formActions={formActionsPublic}
          headStyle={{display: 'none'}}
          rowKey="instockListId"
          contentHeight
          rowSelection
          isModal={false}
          searchForm={searchForm}
          ref={tableRef}
        >
          <Column title="仓库名称" fixed dataIndex="storehouseId" render={(text, record) => {
            return (
              <>
                {record.storehouseResult && record.storehouseResult.name}
              </>
            );
          }} sorter />
          <Column title="物料" render={(text, record) => {
            return (
              <>
                {record.sku && record.sku.skuName}
                &nbsp;/&nbsp;
                {record.spuResult && record.spuResult.name}
                &nbsp;&nbsp;
                <em style={{color: '#c9c8c8', fontSize: 10}}>
                  (
                  {
                    record.backSkus
                    &&
                    record.backSkus.map((items, index) => {
                      return <span key={index}>
                        {items.itemAttribute.attribute}：{items.attributeValues.attributeValues}
                      </span>;
                    })
                  }
                  )
                </em>
              </>
            );

          }} sorter />
          <Column title="品牌" dataIndex="brandId" render={(text, record) => {
            return (
              <>
                {record.brandResult && record.brandResult.brandName}
              </>
            );
          }} sorter />
          <Column title="入库数量" width={120} align="center" dataIndex="number" sorter />
          <Column title="原价" width={120} align="center" dataIndex="costPrice" sorter />
          <Column title="售价" width={120} align="center" dataIndex="sellingPrice" sorter />
          <Column title="操作" width={120} render={(text, record) => {
            return (
              <Button style={{margin: '0 10px'}} disabled={record.number === 0} onClick={async () => {
                setItems(record);
                setShow(true);
              }}><Icon type="icon-ruku" />{record.number === 0 ? '已入库' : '入库'}</Button>
            );
          }} />
        </Table>
      </ProCard>

      <Modal
        visible={show}
        title='选择库位'
        onCancel={()=>{
          setShow(false);
        }}
        onOk={async ()=>{
          if (position) {
            await run({
              data: {
                ...items,
                storehousePositionsId: position,
              }
            });
          } else {
            message.error('请选择库位！');
          }
        }}
      >
        <Cascader
          width="100%"
          defaultParams={{params: {ids: items && items.storeHouseId}}}
          api={storehousePositionsTreeView}
          onChange={(value) => {
            setPosition(value);
          }} value={position} />
      </Modal>
      <ProCard className="h2Card" headerBordered title="入库明细">
        <InstockListTable ref={instockRef} value={props.value} />
      </ProCard>
    </div>
  );
};

export default Instock;
