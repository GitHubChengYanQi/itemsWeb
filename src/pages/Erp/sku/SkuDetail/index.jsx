import React, {useRef} from 'react';
import {useHistory, useParams} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import {Button, Card, Col, Descriptions, Dropdown, Empty, Image, Menu, Row, Space, Tabs} from 'antd';
import {DeleteOutlined, FormOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';
import styles from './index.module.less';
import Breadcrumb from '@/components/Breadcrumb';
import {skuDetail} from '@/pages/Erp/sku/skuUrl';
import {isArray, isObject} from '@/util/Tools';
import Icon from '@/components/Icon';
import AddSkuModal from '@/pages/Erp/sku/SkuTable/AddSkuModal';
import PartsList from '@/pages/Erp/parts/PartsList';
import Supply from '@/pages/Erp/sku/SkuDetail/components/Supply';
import StockDetail from '@/pages/Erp/sku/SkuDetail/components/StockDetail';
import InStock from '@/pages/Erp/sku/SkuDetail/components/InStock';
import OutStock from '@/pages/Erp/sku/SkuDetail/components/OutStock';
import Stocktaking from '@/pages/Erp/sku/SkuDetail/components/Stocktaking';
import Maintenance from '@/pages/Erp/sku/SkuDetail/components/Maintenance';
import Allocation from '@/pages/Erp/sku/SkuDetail/components/Allocation';

const {TabPane} = Tabs;

const SkuDetail = ({value}) => {

  const params = useParams();
  const addRef = useRef(null);

  const history = useHistory();

  const {loading, data, refresh} = useRequest(skuDetail, {
    defaultParams: {
      data: {
        skuId: value || params.cid
      }
    }
  });

  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }

  if (!data) {
    return <Empty />;
  }

  const spuResult = isObject(data.spuResult);

  return (
    <div className={styles.detail}>
      <div className={styles.breadcrumb}>
        {!value && <Breadcrumb title="详情" />}
      </div>
      <div className={styles.info}>
        <Card
          title="基本信息"
          bordered={false}
          headStyle={{border: 'none'}}
          bodyStyle={{padding: '0px 24px'}}
          extra={<Space>
            <Button type="link">申请采购</Button>
            <Dropdown trigger="click" placement="bottom" overlay={
              <Menu items={[{
                key: '0',
                label: '编辑',
                onClick: () => addRef.current.open(data),
                icon: <FormOutlined />,

              }, {
                key: '1',
                label: '禁用',
                icon: <DeleteOutlined />,
                danger: true,
              },]} />
            }>
              <Button type="text">
                管理
              </Button>
            </Dropdown>
            <Button onClick={() => {
              history.push('/SPU/sku');
            }}><Icon type="icon-huifu" />返回</Button>
          </Space>}
        >
          <Row>
            <Col span={22}>
              <Descriptions column={4}>
                <Descriptions.Item label="物料编码">{data.standard}</Descriptions.Item>
                <Descriptions.Item label="名称">{spuResult.name} </Descriptions.Item>
                <Descriptions.Item label="型号">{data.skuName}</Descriptions.Item>
                <Descriptions.Item label="规格">{data.specifications || '-'}</Descriptions.Item>
                <Descriptions.Item label="单位">{isObject(data.unit).unitName || '-'}</Descriptions.Item>
                <Descriptions.Item label="分类">{isObject(spuResult.spuClassificationResult).name}</Descriptions.Item>
                <Descriptions.Item label="实物码">{data.batch ? '一批一码' : '一物一码'}</Descriptions.Item>
                <Descriptions.Item label="物料清单"><a>查看</a></Descriptions.Item>
                <Descriptions.Item label="创建人">{data.createUserName || '-'}</Descriptions.Item>
                <Descriptions.Item label="创建时间" span={3}>{data.createTime}</Descriptions.Item>
                <Descriptions.Item label="备注" span={4}>{data.remarks || '-'}</Descriptions.Item>
                <Descriptions.Item label="附件" span={4}>
                  <Space>
                    {isArray(data.filedUrls).map((item, index) => {
                      return <a
                        key={index}
                        href={data.filedUrls[0]}
                        target="_blank"
                        rel="noreferrer"
                      >附件{index + 1}</a>;
                    })}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={2}>
              <Image preview={{src: isObject(data.imgResults[0]).url}} src={isObject(data.imgResults[0]).thumbUrl} />
            </Col>
          </Row>
        </Card>
      </div>
      <div className={styles.info}>
        <Card
          title="详细信息"
          headStyle={{border: 'none'}}
          bodyStyle={{padding: '0px 24px'}}
        >
          <Descriptions column={4}>
            <Descriptions.Item label="材质">-</Descriptions.Item>
            <Descriptions.Item label="养护周期">{data.maintenancePeriod || 0} 天</Descriptions.Item>
            <Descriptions.Item label="重量">0</Descriptions.Item>
            <Descriptions.Item label="品牌">
              {isArray(data.brandResults).map(item => item.brandName).join('、')}
            </Descriptions.Item>
            <Descriptions.Item
              label="物料描述"
              span={4}
            >
              (
              {
                data.list &&
                data.list.length > 0 &&
                data.list[0].attributeValues ? <em>{data.list.map((items) => {
                  return `${items.itemAttributeResult.attribute}: ${items.attributeValues}`;
                }).toString()}</em> : '无'
              }
              )
            </Descriptions.Item>
            <Descriptions.Item
              label="图片"
              span={4}
            >
              <Image.PreviewGroup>
                {
                  isArray(data.imgResults).map((item, index) => {
                    return <Image
                      key={index}
                      width={34}
                      preview={{src: item.url}}
                      src={item.thumbUrl}
                    />;
                  })
                }
              </Image.PreviewGroup>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {!value && <div
        className={styles.info}>
        <Card>
          <Tabs
            defaultActiveKey="1"
            destroyInactiveTabPane
            items={[
              {key: '1', label: '关联物料清单', children: <PartsList value={data.skuId} showTable />},
              {key: '2', label: '关联供应商', children: <Supply skuId={data.skuId} />},
              {key: '3', label: '库存明细', children: <StockDetail />},
              {key: '4', label: '入库记录', children: <InStock />},
              {key: '5', label: '出库记录', children: <OutStock />},
              {key: '6', label: '盘点记录', children: <Stocktaking />},
              {key: '7', label: '养护记录', children: <Maintenance />},
              {key: '8', label: '调拨记录', children: <Allocation />},
            ]}
          />
        </Card>
      </div>}

      <AddSkuModal addRef={addRef} edit onSuccess={() => {
        refresh();
      }} />

    </div>

  );
};

export default SkuDetail;
