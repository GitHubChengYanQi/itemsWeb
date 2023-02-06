/**
 * 清单列表页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useRef, useState} from 'react';
import {Button, Card, Descriptions} from 'antd';
import {useHistory, useParams} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import ProCard from '@ant-design/pro-card';
import {spuDetail} from '@/pages/Erp/spu/spuUrl';
import {useRequest} from '@/util/Request';
import Code from '@/pages/Erp/spu/components/Code';
import Empty from '@/components/Empty';
import Modal from '@/components/Modal';
import SkuTable from '@/pages/Erp/sku/SkuTable';
import Overflow from '@/components/Overflow';
import AddSku from '@/pages/Erp/spu/components/AddSku';


const SpuDetail = () => {

  const params = useParams();

  const history = useHistory();

  const [bomLoading, setBomLoading] = useState();

  const [state, setState] = useState();

  const [skuId, setSkuId] = useState();

  const partsAddRef = useRef();

  const formRef = useRef();

  const skuRef = useRef();

  const {loading, data} = useRequest(spuDetail, {
    manual: !params.cid,
    defaultParams: {
      data: {
        spuId: params.cid
      }
    },
  });


  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }


  if (!data) {
    return <Empty />;
  }


  const Type = () => {
    switch (data.productionType) {
      case 0:
        return '自制件';
      case 1:
        return '委派件';
      case 2:
        return '外购件';
      default:
        break;
    }
  };


  return (
    <>
      <Card title="产品详情" extra={<Button onClick={() => {
        history.goBack();
      }}>返回</Button>}>
        <div style={{margin: 'auto'}}>
          <ProCard className="h2Card" title="详细信息" headerBordered>
            <div style={{maxWidth: 1200, margin: 'auto'}}>
              <Overflow defaultHeight={400}>
                <Descriptions
                  column={1}
                  bordered
                  labelStyle={{width: 170, textAlign: 'right', backgroundColor: '#fff'}}>
                  <Descriptions.Item label="产品名称">
                    <Code source="spu" id={data.spuId} /> {data.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="系列">{data.category ? data.category.categoryName : '--'}</Descriptions.Item>
                  <Descriptions.Item
                    label="分类"> {data.spuClassificationResult ? data.spuClassificationResult.name : '--'}</Descriptions.Item>
                  <Descriptions.Item label="单位"> {data.unitResult ? data.unitResult.unitName : '--'}</Descriptions.Item>
                  <Descriptions.Item
                    label="养护周期"> {data.curingCycle ? `${data.curingCycle}天` : '--'}</Descriptions.Item>
                  <Descriptions.Item label="生产类型">{Type()}</Descriptions.Item>
                  <Descriptions.Item label="重要程度" width={120}>{data.important || '--'}</Descriptions.Item>
                  <Descriptions.Item label="产品重量" width={120}>{data.weight || '--'}</Descriptions.Item>
                  <Descriptions.Item
                    label="材质"
                    width={150}>{data.material ? data.material.name : '--'}</Descriptions.Item>
                  <Descriptions.Item label="易损">{data.vulnerability === 0 ? '易损' : '不易损'}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
                </Descriptions>
              </Overflow>
            </div>
          </ProCard>
          <ProCard className="h2Card" title="物料列表" headerBordered extra={<Button onClick={() => {
            partsAddRef.current.open(false);
          }}>添加型号</Button>}>
            <SkuTable isModal spuId={params.cid} ref={skuRef} />
          </ProCard>
        </div>
      </Card>


      <Modal
        width={900}
        title="型号"
        loading={setBomLoading}
        compoentRef={formRef}
        component={AddSku}
        skuId={skuId}
        setSkuId={setSkuId}
        onClose={() => {
          setSkuId();
        }}
        onSuccess={(res) => {
          setSkuId();
          skuRef.current.refresh();
          switch (state) {
            case 'addBom':
              skuRef.current.addBom(res.data);
              break;
            case 'addShip':
              skuRef.current.addShip(res.data);
              break;
            default:
              break;
          }
          partsAddRef.current.close();
        }}
        ref={partsAddRef}
        spuId={params.cid}
        footer={<>
          <Button loading={bomLoading} onClick={() => {
            formRef.current.submit();
            setState('addBom');
          }}>保存并添加BOM</Button>
          <Button loading={bomLoading} onClick={() => {
            formRef.current.submit();
            setState('addShip');
          }}>保存并添加工艺路线</Button>
          <Button hidden={skuId} type="primary" loading={bomLoading} onClick={() => {
            formRef.current.submit();
          }}>保存</Button>
        </>}
      />
    </>
  );
};

export default SpuDetail;
