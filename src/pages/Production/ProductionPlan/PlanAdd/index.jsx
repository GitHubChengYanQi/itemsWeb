import React, {useEffect, useImperativeHandle, useState} from 'react';
import {Alert, Image, message, Space, Spin, Steps} from 'antd';
import {Sku} from 'MES-Apis/lib/Sku';
import classNames from 'classnames';
import {useRequest} from '@/util/Request';
import NewPartsList from '@/pages/Erp/parts/NewPartsList';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import store from '@/store';
import styles from './index.module.less';
import ProCard from '@ant-design/pro-card';
import InputNumber from '@/components/InputNumber';
import Message from '@/components/Message';

const getBoms = {
  url: '/bom/v2.0/getByBomId',
  method: 'POST'
};

const productionPlanAddByBomUrl = {
  url: '/productionPlan/addByBom',
  method: 'POST',
};

const PlanAdd = (
  {
    currentStep,
    setCurrentStep = () => {
    },
    onLoading = () => {
    },
    onSuccess = () => {
    },
  },
  ref
) => {

  const [dataSource] = store.useModel('dataSource');

  const steps = [
    {
      title: '选择BOM',
      key: 0
    },
    {
      title: '创建计划',
      key: 1
    }
  ];

  const [bomsLoading, setBomsLoading] = useState(false);

  const [bomTree, setBomTree] = useState({});

  const [bomId, setBomId] = useState('');

  const [number, setNumber] = useState(number);

  const [error, setError] = useState(false);

  const formatBoms = (bom, boms) => {
    return {
      ...bom,
      children: boms.filter(item => item.parentId === bom.bomId).map(item => {
        return formatBoms(item, boms);
      })
    };
  };

  const skuResultFormat = (item, skuImages) => {
    const skuResult = item.skuResult || {};
    const media = skuImages.find(mediaItem => mediaItem.mediaId === skuResult.images?.split(',')[0]) || {};
    return {
      ...item,
      skuResult: {
        ...skuResult,
        thumbUrl: media.thumbUrl
      }
    };
  };

  const getSkuImgs = (list) => {
    return new Promise((resolve, reject) => {
      Sku.getMediaUrls({
        mediaIds: list.map(item => item.skuResult?.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      }).then((res) => {
        return resolve(list.map(item => {
          return skuResultFormat(item, res?.data);
        }));
      }).catch(() => {
        reject();
      });
    });
  };

  const {run: getBomsRun} = useRequest(getBoms, {
    manual: true,
    onSuccess: async (res) => {
      const newBoms = await getSkuImgs(res);
      const parentBom = newBoms.find(item => item.parentId === 0) || {};
      setBomTree(formatBoms(parentBom, newBoms));
      setBomsLoading(false);
    },
    onError: () => {
      setBomsLoading(false);
    }
  });

  const {run: productionPlanAdd} = useRequest(productionPlanAddByBomUrl, {
    manual: true,
    onSuccess: () => {
      onSuccess();
      onLoading(false);
      Message.success('添加生产计划成功！');
    },
    onError: () => {
      onLoading(false);
      Message.error('添加生产计划失败！');
    }
  });

  const bomItem = (bom) => {
    const skuResult = bom.skuResult || {};
    const children = bom.children || [];
    return <div className={styles.bom}>
      <div className={styles.sku}>
        <Space>
          <Image
            style={{borderRadius: 4}}
            width={65}
            src={skuResult.thumbUrl || dataSource?.publicInfo?.imgLogo}
          />
          <div>
            {SkuResultSkuJsons({skuResult})}
            <div>
              版本号：{bom.version}
            </div>
            <div>
              数量：{bom.number}
            </div>
          </div>
        </Space>

      </div>
      <div className={styles.details}>
        {
          children.map((item, index) => {
            return <div key={index} className={styles.detail}>
              <div className={classNames(
                styles.detailItem,
                index === 0 && styles.first,
                index === children.length - 1 && styles.end
              )}>
                {bomItem(item)}
              </div>
            </div>;
          })
        }
      </div>
    </div>;
  };

  const submit = () => {
    if (number > 0) {
      onLoading(true);
      productionPlanAdd({
        data: {
          'productionPlanDetailParams': [
            {
              'partsId': bomId,
              'planNumber': number
            }
          ]
        }
      });
    } else {
      message.warn('请输入生产数量！');
      setError(true);
    }

  };

  useImperativeHandle(ref, () => ({
    submit
  }));

  useEffect(() => {
    setError(false);
  }, []);

  return <div style={{padding: 24}}>
    <Steps
      progressDot
      current={currentStep}
      items={steps}
      onChange={(current) => {
        if (current > currentStep) {
          return;
        }
        setCurrentStep(current);
      }}
    />
    <div
      hidden={currentStep !== 0}
      style={{
        width: 800,
        height: 'calc(100vh - 250px)',
        overflow: 'auto'
      }}
    >
      <NewPartsList
        selectOne
        onSelectOne={(bom) => {
          setCurrentStep(1);
          setBomId(bom.bomId);
          setBomsLoading(true);
          getBomsRun({
            data: {
              bomId: bom.bomId,
              number: 1
            }
          });
        }}
      />
    </div>

    <div
      hidden={currentStep !== 1}
      style={{width: 800, overflow: 'auto', padding: 24}}
    >
      <ProCard
        title="生产数量"
        headerBordered
        className="h2Card"
        extra={<InputNumber
          status={(error && !(number > 0)) ? 'error' : ''}
          value={number}
          onChange={setNumber}
          placeholder="请输入生产数量"
        />}
        bodyStyle={{padding: 8}}
      />
      <ProCard
        headerBordered
        title="生产信息"
        className="h2Card"
        bodyStyle={{padding: 0}}
      >
        <div
          style={{
            height: 'calc(100vh - 430px)',
            overflow: 'auto'
          }}
        >
          {
            bomsLoading ?
              <Spin tip="Loading...">
                <Alert
                  message="正在获取Bom信息"
                  description="请稍后..."
                  type="info"
                />
              </Spin>
              :
              <div>
                {bomItem(bomTree)}
              </div>
          }
        </div>
      </ProCard>
    </div>
  </div>;
};

export default React.forwardRef(PlanAdd);
