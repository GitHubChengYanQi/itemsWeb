import React, {useEffect, useRef, useState} from 'react';
import {Button, Descriptions, List, Space, Spin, Tag} from 'antd';
import Drawer from '@/components/Drawer';
import SopDetailList from '@/pages/ReSearch/sop/sopDetail/sopDetailList';
import {useRequest} from '@/util/Request';
import {skuList} from '@/pages/Erp/sku/skuUrl';
import Empty from '@/components/Empty';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import Modal from '@/components/Modal';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import {partsGetDetails} from '@/pages/Erp/parts/PartsUrl';
import Detail from '@/pages/ReSearch/Detail';
import PartsEditV2 from '@/pages/Erp/parts/PartsEditV2';


export const Tool = (props) => {
  const {value} = props;
  if (!Array.isArray(value)) {
    return <>请选择工序</>;
  }
  return (<Space>
    {
      value.map((item, index) => {
        return <Tag key={index} color={item.isCommon && 'blue'}>{item.toolResult && item.toolResult.name}</Tag>;
      })
    }
  </Space>);
};

export const Sop = (props) => {
  const {value, sopId} = props;
  const ref = useRef();
  return value ?
    <Space>
      {value.name}
      <Button disabled={!sopId} onClick={() => {
        ref.current.open(false);
      }}>查看</Button>
      <Drawer ref={ref} onSuccess={() => {
        ref.current.close();
      }} headTitle="作业指导" component={SopDetailList} id={sopId} />
    </Space>
    :
    '请选择工序';
};

export const ShipNote = (props) => {
  return props.value ? props.value : '无';
};

export const SkuShow = (props) => {
  const {skus = [], onChange, productionType} = props;

  const skuIds = [];
  const partIds = [];
  skus && skus.map((item) => {
    if (item && item.skuId) {
      skuIds.push(item.skuId);
    }
    if (item && item.partsId) {
      partIds.push(item.partsId);
    }
    return null;
  });

  const {loading, data, run} = useRequest(skuList, {
    manual: true, onSuccess: (res) => {
      onChange(res.map((item) => {
        return {skuResult: item};
      }));
    }
  });

  const {loading: partsLoading, data: partsData, run: partsRun} = useRequest(partsGetDetails, {
    manual: true,
    onSuccess: onChange
  });

  useEffect(() => {
    if (productionType === 'in' && skuIds.length > 0) {
      run({
        data: {
          skuIds
        },
      });
    } else if (productionType === 'out' && partIds.length > 0) {
      partsRun({
        data: {
          partIds
        },
      });
    }

  }, [skuIds.length, partIds.length, productionType]);

  if (loading || partsLoading) {
    return <Spin />;
  }

  if (productionType === 'in' ? !data : !partsData) {
    return <Empty />;
  }

  return <List
    bordered
    dataSource={productionType === 'in' ? data : partsData}
    renderItem={(item) => {
      const sku = skus && skus.filter((items) => {
        return items && (items.skuId === item.skuId);
      });
      let number = 0;
      if (sku.length > 0) {
        number = sku[0].num;
      }

      return productionType === 'in' ?
        <List.Item>
          <Space direction="vertical">
            <SkuResultSkuJsons skuResult={item} />
            <div>
              数量：{number}
            </div>
          </Space>
        </List.Item>
        :
        <List.Item>
          <Space direction="vertical">
            <Descriptions column={1}>
              <Descriptions.Item label="产出物料">
                <strong><SkuResultSkuJsons skuResult={item.skuResult} /></strong>
              </Descriptions.Item>
              <Descriptions.Item label="产出数量">
                <strong>{number}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="投入物料">
                <Space direction="vertical">
                  {
                    item.parts && item.parts.map((item, index) => {
                      return <Space key={index}>
                        <strong><SkuResultSkuJsons key={index} skuResult={item.skuResult} /></strong>
                        <div>投入数量：<strong>{item.number * (number || 0)}</strong></div>
                      </Space>;
                    })
                  }
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </List.Item>;
    }}
  />;
};

export const Bom = ({value, equals,spuSkuId, skuId, onChange}) => {

  const [loading, setLoading] = useState();

  const refAdd = useRef();

  const formRef = useRef();

  if (equals) {
    return null;
  }

  const bomType = () => {
    if (value){
      return <Button style={{color: 'green', padding: 0}} type="link" onClick={() => {
        refAdd.current.open(value);
      }}>有BOM</Button>;
    }else {
      return <Button style={{color: 'red', padding: 0}} type="link" onClick={() => {
        refAdd.current.open(false);
      }}>无BOM</Button>;
    }
  };

  return <>
    {bomType()}
    <Drawer
      placement='top'
      height='100%'
      type={1}
      title="清单"
      bom={{copy:true}}
      defaultValue={{
        item: {skuId}
      }}
      sku
      loading={setLoading}
      compoentRef={formRef}
      spuSkuId={spuSkuId}
      component={PartsEditV2}
      onSuccess={(res) => {
        onChange(res && res.partsId);
        refAdd.current.close();
      }}
      ref={refAdd}
      footer={<>
        <Button type="primary" loading={loading} onClick={() => {
          formRef.current.submit();
        }}>保存</Button>
      </>}
    />
  </>;

};

export const ShowShip = ({value, skuId,onChange}) => {

  const ref = useRef();

  const type = () => {
    if (value) {
      return <Button style={{color: 'green', padding: 0}} type="link" onClick={() => {
        ref.current.open(value);
      }}>有工艺</Button>;
    } else {
      return <Button style={{color: 'blue', padding: 0}} type="link" onClick={() => {
        ref.current.open(false);
      }}>无工艺</Button>;
    }
  };

  return <>

    {type()}

    <Drawer
      bodyStyle={{padding: 0}}
      push={false}
      headTitle="添加子工艺路线"
      height="100%"
      placement="top"
      addChildren
      skuId={skuId}
      component={Detail}
      ref={ref}
      onSuccess={(res) => {
        onChange(res);
        ref.current.close();
      }}
      onBack={() => {
        ref.current.close();
      }}
    />
  </>;
};


