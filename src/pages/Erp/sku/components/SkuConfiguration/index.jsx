import React, {useState} from 'react';
import {AutoComplete, Button, Input, Space} from 'antd';
import {useSetState} from 'ahooks';
import {DeleteOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';

const SkuConfiguration = ({
  value,
  onChange = () => {
  },
  title,
  spuId,
  category,
  details,
  onGetSku = () => {
  }
}) => {

  const [datas, setDatas] = useSetState({data: value || []});

  const [visible, setVisible] = useState(-1);

  const {run} = useRequest({
    url: '/sku/skuByMd5',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      if (Array.isArray(res) && res.length > 0) {
        onGetSku(res[0]);
      } else {
        onGetSku(null);
      }
    }
  });

  const change = (array) => {
    if (spuId) {
      const sku = array.filter((item) => {
        return item.label && item.value;
      });

      if (sku.length > 0) {
        run({
          data: {
            spuId,
            sku
          }
        });
      }
    }

    onChange(array);
    setDatas({data: array});
  };

  const optionsValue = (items) => {

    if (details && details.tree) {
      const values = details.tree.filter((item) => {
        return item.k === items.label;
      });
      if (values && values.length > 0) {
        return details.tree && details.tree.filter((item) => {
          return item.k === items.label;
        })[0].v.map((item) => {
          return {
            label: item.name,
            value: item.name,
          };
        });
      } else {
        return [];
      }
    } else if (category) {
      const values = category.filter((item) => {
        return item.attribute && (item.attribute.attribute === items.label);
      });
      if (values && values.length > 0) {
        return values[0].value.map((item) => {
          return {
            label: item.attributeValues,
            value: item.attributeValues,
          };
        });
      }
    } else {
      return [];
    }

  };

  const sname = (name) => {
    if (!name) {
      return false;
    }
    return datas.data.filter(item => {
      return item.label === name;
    }).length > 1;
  };

  return <>
    {
      datas.data.map((items, index) => {
        return <div
          key={index}
          onBlur={() => {
          }}
          onFocus={() => {
          }}
          style={{cursor: 'pointer'}}
          onMouseOver={() => {
            setVisible(index);
          }}
          onMouseOut={() => {
            setVisible(-1);
          }}>
          <div style={{backgroundColor: '#f7f8fa', padding: 8}}>
            <Space>
              名称：
              <AutoComplete
                value={items.label}
                style={{border: sname(items.label) && 'solid 1px red'}}
                disabled={items.disabled}
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                options={
                  category
                    ?
                    category.map((item) => {
                      const attribute = item.attribute && item.attribute.attribute;
                      return {
                        label: attribute,
                        value: attribute,
                        disabled: datas.data.filter((item) => {
                          return item.label === attribute;
                        }).length > 0
                      };
                    })
                    : [
                      {
                        label: '材质',
                        value: '材质',
                        disabled: datas.data.filter((item) => {
                          return item.label === '材质';
                        }).length > 0
                      },
                      {
                        label: '长',
                        value: '长',
                        disabled: datas.data.filter((item) => {
                          return item.label === '长';
                        }).length > 0
                      },
                      {
                        label: '宽',
                        value: '宽',
                        disabled: datas.data.filter((item) => {
                          return item.label === '宽';
                        }).length > 0
                      },
                      {
                        label: '高',
                        value: '高',
                        disabled: datas.data.filter((item) => {
                          return item.label === '高';
                        }).length > 0
                      },
                      {
                        label: '重量',
                        value: '重量',
                        disabled: datas.data.filter((item) => {
                          return item.label === '重量';
                        }).length > 0
                      },
                      {
                        label: '体积',
                        value: '体积',
                        disabled: datas.data.filter((item) => {
                          return item.label === '体积';
                        }).length > 0
                      },
                    ]}
                onChange={(value) => {
                  if (value) {
                    const array = datas.data;
                    array[index] = {...array[index], label: value};
                    change(array);
                  } else {
                    const array = datas.data;
                    array[index] = {label: null, value: null};
                    change(array);
                  }
                }}
              >
                <Input />
              </AutoComplete>

              <Button type="link" hidden={visible === -1 || visible !== index} style={{padding: 0}} onClick={() => {
                datas.data.splice(index, 1);
                change(datas.data);
              }}>
                <DeleteOutlined />
              </Button>
            </Space>
          </div>
          <div style={{padding: 8}}>
            <Space>
              内容：
              <AutoComplete
                options={optionsValue(items)}
                disabled={!items.label}
                value={items.value}
                onChange={(value) => {
                  const array = datas.data;
                  array[index] = {...array[index], value};
                  change(array);
                }}
              >
                <Input />
              </AutoComplete>
            </Space>
          </div>
        </div>;
      })
    }

    <Button onClick={() => {
      const array = datas.data;
      array.push({
        label: null,
        value: null,
      });
      setDatas({
        data: array
      });
    }}>{title || '添加'}</Button>
  </>;
};

export default SkuConfiguration;
