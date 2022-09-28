import React, {useRef, useState} from 'react';
import {useHistory, useParams} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import {Button, Card, Col, Descriptions, Dropdown, Empty, Image, Menu, Row, Space, Tabs, Typography} from 'antd';
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
import {spuClassificationDetail} from '@/pages/Erp/spu/components/spuClassification/spuClassificationUrl';

const SkuDetail = ({value}) => {

  const params = useParams();
  const addRef = useRef(null);

  const history = useHistory();

  const [typeSetting, setTypeSetting] = useState([]);

  const {loading: skuFormLoading, run: getSkuForm} = useRequest(spuClassificationDetail, {
    manual: true,
    onSuccess: (res) => {
      setTypeSetting(res && res.typeSetting && JSON.parse(res.typeSetting) || []);
    }
  });

  const {loading, data, refresh} = useRequest(skuDetail, {
    defaultParams: {
      data: {
        skuId: value || params.cid
      }
    },
    onSuccess: (res) => {
      const spuClassificationId = res?.spuClass;
      if (spuClassificationId) {
        getSkuForm({data: {spuClassificationId}});
      }
    }
  });

  if (loading || skuFormLoading) {
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
              history.goBack();
            }}><Icon type="icon-huifu" />返回</Button>
          </Space>}
        >
          <Row>
            <Col span={22}>
              <Descriptions column={4}>
                {
                  typeSetting.filter(item => item.show).map((item, index) => {
                    let children;
                    switch (item.key) {
                      case 'standard':
                        children = <Typography.Text
                          copyable>{data.standard}
                        </Typography.Text>;
                        break;
                      case 'spuClass':
                        children = isObject(spuResult.spuClassificationResult).name;
                        break;
                      case 'spu':
                        children = spuResult.name;
                        break;
                      case 'batch':
                        children = data.batch ? '一批一码' : '一物一码';
                        break;
                      case 'unitId':
                        children = isObject(data.unit).unitName || '-';
                        break;
                      case 'weight':
                        children = `${data[item.key] || 0} kg`;
                        break;
                      case 'maintenancePeriod':
                        children = `${data[item.key] || 0} 天`;
                        break;
                      case 'sku':
                        children = <>(
                          {
                            data.list &&
                            data.list.length > 0 &&
                            data.list[0].attributeValues ? <em>{data.list.map((items) => {
                              return `${items.itemAttributeResult.attribute}: ${items.attributeValues}`;
                            }).toString()}</em> : '无'
                          }
                          )</>;
                        break;
                      case 'materialId':
                        children = isArray(data.materialResultList).map(item => item.name).join('、');
                        break;
                      case 'brandIds':
                        children = isArray(data.brandResults).map(item => item.brandName).join('、');
                        break;
                      case 'skuSize':
                        children = data.skuSize && data.skuSize.split(',').join('×') || '无';
                        break;
                      case 'images':
                        children = <Image.PreviewGroup>
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
                        </Image.PreviewGroup>;
                        break;
                      case 'fileId':
                        children = <Space>
                          {isArray(data.filedUrls).map((item, index) => {
                            return <a
                              key={index}
                              href={data.filedUrls[0]}
                              target="_blank"
                              rel="noreferrer"
                            >附件{index + 1}</a>;
                          })}
                        </Space>;
                        break;
                      default:
                        children = data[item.key] || '-';
                    }
                    return <Descriptions.Item key={index} label={item.filedName}>
                      {children}
                    </Descriptions.Item>;
                  })
                }
                <Descriptions.Item label="物料清单"><a>查看</a></Descriptions.Item>
                <Descriptions.Item label="创建人">{data.createUserName || '-'}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={2}>
              <Image preview={{src: isObject(data.imgResults[0]).url}} src={isObject(data.imgResults[0]).thumbUrl} />
            </Col>
          </Row>
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
