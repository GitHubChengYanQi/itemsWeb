import React from 'react';
import {Form, Radio, Space, Spin} from 'antd';
import {useSetState} from 'ahooks';
import Cascader from '@/components/Cascader';
import {spuClassificationTreeVrew} from '@/pages/Erp/spu/components/spuClassification/spuClassificationUrl';
import {useRequest} from '@/util/Request';
import {spuListSelect} from '@/pages/Erp/parts/PartsUrl';
import {spuDetail} from '@/pages/Erp/spu/spuUrl';
import Select from '@/components/Select';

const AddSpu = () => {

  const [config, setConfig] = useSetState({
    list: [],
    tree: []
  });
  console.log(config);

  const {loading: spuLoading, data: spuData, run: spuRun} = useRequest(spuListSelect, {manual: true});

  const {loading: detailLoading, data: detailData, run: detailRun} = useRequest(spuDetail,
    {
      manual: true,
      onSuccess: (res) => {
        setConfig({
          list: res && res.sku && res.sku.list || [],
          tree: res && res.sku && res.sku.tree || [],
        });
      }
    });

  const checkConfig = (k, v) => {
    // console.log(k, v, config.list);
    const newConfigList = config.list.filter((item) => {
      return item[`s${k}`] === v;
    });
    // console.log(newConfigList, config.tree);
    const newConfigTree = config.tree.map((item) => {
      const newV = item.v.map((itemV) => {
        const vList = newConfigList.filter((itemList) => {
          return itemList[`s${item.k_s}`] === itemV.id;
        });
        if (vList.length > 0) {
          return itemV;
        }
        return {
          ...itemV,
          disabled: true,
        };
      });
      return {
        ...item,
        v: newV
      };
    });
    setConfig({...config, tree: newConfigTree});
  };

  return <div style={{padding: '24px 20%'}}>
    <Form>
      <Form.Item name="coding" label="物料编码">
        <Cascader api={spuClassificationTreeVrew} onChange={(value) => {
          spuRun({
            data: {
              spuClassificationId: value,
            }
          });
        }} />
      </Form.Item>
      <Form.Item name="class" label="选择分类">
        <Cascader api={spuClassificationTreeVrew} onChange={(value) => {
          spuRun({
            data: {
              spuClassificationId: value,
            }
          });
        }} />
      </Form.Item>
      <Form.Item label="选择产品">
        {spuLoading ?
          <Spin />
          :
          <Select value={detailData && detailData.spuId} options={spuData || []} onChange={(value) => {
            detailRun({
              data: {
                spuId: value,
              }
            });
          }} />}
      </Form.Item>
      <Form.Item>
        {
          detailLoading
            ?
            <div style={{textAlign: 'center'}}>
              <Spin />
            </div>
            :
            config.tree.map((item, index) => {
              return <div key={index} style={{padding: 8}}>
                <Space>
                  <div>
                    {item.k}：
                  </div>
                  <Radio.Group key={index} onChange={(value) => {
                    console.log(value.target);
                    checkConfig(item.k_s, value.target.value);
                  }}>
                    {
                      item.v.map((itemV, indexV) => {
                        return <Radio.Button
                          key={indexV}
                          disabled={itemV.disabled}
                          style={{margin: '0 8px'}}
                          value={itemV.id}>
                          {itemV.name}
                        </Radio.Button>;
                      })
                    }
                  </Radio.Group>
                </Space>
              </div>;
            })
        }
      </Form.Item>
    </Form>
  </div>;
};

export default AddSpu;
