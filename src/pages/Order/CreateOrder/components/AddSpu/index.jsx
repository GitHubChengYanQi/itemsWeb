import React, {useState} from 'react';
import {Checkbox, Descriptions, Spin} from 'antd';
import {useSetState} from 'ahooks';
import Cascader from '@/components/Cascader';
import {useRequest} from '@/util/Request';
import {spuDetail} from '@/pages/Erp/spu/spuUrl';
import store from '@/store';
import SelectSku from '@/pages/Erp/sku/components/SelectSku';

const AddSpu = (
  {
    value,
    onChange,
    noSkuIds,
  }) => {

  const [checkConfig, setCheckConfig] = useState([]);

  const [state] = store.useModel('dataSource');

  const [skuClassId, setSkuClassId] = useState();

  const [config, setConfig] = useSetState({
    list: [],
    tree: []
  });

  const change = (value) => {
    onChange(value);
  };

  const onConfig = (k, v, config) => {

    let newCheckConfig = [];
    if (!k) {
      newCheckConfig = checkConfig;
    } else if (v) {
      newCheckConfig = [...checkConfig.filter((item) => {
        return item.k !== k;
      }), {k, v}];
    } else {
      newCheckConfig = [...checkConfig.filter((item) => {
        return item.k !== k;
      })];
    }

    setCheckConfig(newCheckConfig);

    const newConfigList = config.list.filter((item) => {
      return newCheckConfig.filter((checkIitem) => {
        return item[`s${checkIitem.k}`] === checkIitem.v;
      }).length === newCheckConfig.length;
    });

    const onSku = [];

    newConfigList.map((itemList) => {
      const trees = config.tree.filter((itemTree) => {
        return itemList[`s${itemTree.k_s}`];
      });
      if (newCheckConfig.length > 0 && trees.length === newCheckConfig.length) {
        onSku.push(itemList);
      }
      return null;
    });

    if (onSku.length === 1) {
      change(onSku[0].id);
    } else if (newConfigList.length === 1) {
      if (v) {
        const check = [];
        config.tree.map((itemTree) => {
          if (newConfigList[0][`s${itemTree.k_s}`]) {
            check.push({
              k: itemTree.k_s,
              v: newConfigList[0][`s${itemTree.k_s}`]
            });
          }
          return null;
        });
        setCheckConfig(check);
        newCheckConfig = check;
      }
      change(newConfigList[0].id);
    } else if (config.list.length > 0 && !newConfigList.map(item => item.id).includes(value)) {
      change(null);
    }

    const newConfigTree = config.tree.map((itemK) => {
      return {
        ...itemK,
        v: itemK.v.map((itemV) => {
          return {
            ...itemV,
            checked: newCheckConfig.filter((item) => {
              return item.v === itemV.id;
            })[0],
            disabled: newConfigList.filter((itemList) => {
              return itemList[`s${itemK.k_s}`] === itemV.id;
            }).length === 0
          };
        })
      };
    });
    setConfig({...config, tree: newConfigTree});
  };

  const {loading: detailLoading, run: detailRun} = useRequest(spuDetail,
    {
      manual: true,
      onSuccess: (res) => {
        const config = {
          list: res && res.sku && res.sku.list || [],
          tree: res && res.sku && res.sku.tree || [],
        };
        onConfig(null, null, config);
      }
    });


  return <div style={{padding: '24px 10%'}}>
    <Descriptions column={1}>
      <Descriptions.Item label="物料分类">
        <Cascader
          width="100%"
          value={skuClassId}
          changeOnSelect={false}
          placeholder="请选择物料分类"
          options={state.skuClass}
          onChange={(value) => {
            change(null);
            setConfig({
              list: [],
              tree: []
            });
            setSkuClassId(value);
          }} />
      </Descriptions.Item>
      <Descriptions.Item label="物料名称">
        <SelectSku
          width="100%"
          value={value}
          spuClassId={skuClassId}
          skuIds={noSkuIds}
          getSkuDetail={(res) => {
            const array = [];
            if (res.spuId) {
              detailRun({
                data: {
                  spuId: res.spuId
                }
              });
              res.list && res.list.map((item) => {
                return array.push({
                  k: item.attributeId,
                  v: item.attributeValuesId,
                });
              });
              setCheckConfig(array);
            }
          }}
          onChange={change}
          onSpuId={(value) => {
            change(null);
            detailRun({
              data: {
                spuId: value,
              }
            });
          }}
        />
      </Descriptions.Item>
      <Descriptions.Item label="物料描述">
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {config.tree.length === 0 && '无描述'}
          {
            detailLoading
              ?
              <div style={{textAlign: 'center'}}>
                <Spin />
              </div>
              :
              config.tree && config.tree.map((item, index) => {
                return <div key={index} style={{padding: 8}}>
                  <div style={{display: 'flex'}}>
                    <div>
                      {item.k}：
                    </div>
                    {
                      item.v.map((itemV, indexV) => {
                        return <Checkbox
                          checked={itemV.checked}
                          onChange={(value) => {
                            onConfig(item.k_s, value.target.checked && value.target.id, config);
                          }}
                          key={indexV}
                          disabled={itemV.disabled}
                          id={itemV.id}>
                          {itemV.name}
                        </Checkbox>;
                      })
                    }
                  </div>
                </div>;
              })
          }
        </div>
      </Descriptions.Item>
    </Descriptions>

  </div>;
};

export default AddSpu;
