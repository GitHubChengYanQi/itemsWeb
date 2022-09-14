import React from 'react';
import {Col, Descriptions, Row, Table, Table as AntTable} from 'antd';
import ProCard from '@ant-design/pro-card';
import ProSkeleton from '@ant-design/pro-skeleton';
import {instockOrderDetail} from '@/pages/Erp/instock/InstockUrl';
import {useRequest} from '@/util/Request';
import Code from '@/pages/Erp/spu/components/Code';
import Empty from '@/components/Empty';
import Render from '@/components/Render';
import Note from '@/components/Note';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';

const {Column} = AntTable;
const Instock = (props) => {

  const {value} = props;

  const {loading, data} = useRequest({...instockOrderDetail, data: {instockOrderId: value}});

  if (loading) {
    return <ProSkeleton type="descriptions" />;
  }

  if (!data) {
    return <Empty />;
  }

  return (
    <div>
      <ProCard className="h2Card" title="入库信息" headerBordered>
        <Row gutter={24}>
          <Col span={16}>
            <Descriptions column={1} bordered labelStyle={{width: 120}}>
              <Descriptions.Item label="入库单号"> {data.coding}</Descriptions.Item>
              <Descriptions.Item
                label="入库仓库"> {data.storehouseResult && data.storehouseResult.name}</Descriptions.Item>
              <Descriptions.Item label="负责人">{data.userResult && data.userResult.name}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Code source="instock" id={data.instockOrderId} image codeWidth={210} />
          </Col>
        </Row>
      </ProCard>
      <ProCard className="h2Card" headerBordered title="入库清单">
        <Table
          rowKey="instockListId"
          dataSource={data.instockListResults || []}
        >
          <Column title="物料编码" dataIndex="skuResult" render={(value) => {
            return <Render width={70}>{value && value.standard}</Render>;
          }} sorter />
          <Column title="物料名称" dataIndex="skuResult" render={(value, record) => {
            return <Note width={200}><SkuResultSkuJsons skuResult={{...value, spuResult: record.spuResult}} /></Note>;
          }} sorter />
          <Column title="计划数量" width={120} align="center" dataIndex="instockNumber" sorter />
          <Column title="核实数量" width={120} align="center" dataIndex="number" sorter />
          <Column title="未入数量" width={120} align="center" dataIndex="realNumber" sorter />
          <Column title="供应商" dataIndex="brandResult" render={(value) => {
            return <Render width={70}>{value && value.brandName}</Render>;
          }} sorter />
          <Column title="品牌" dataIndex="customerResult" render={(value) => {
            return <Render width={70}>{value && value.customerName}</Render>;
          }} sorter />
        </Table>
      </ProCard>
    </div>
  );
};

export default Instock;
