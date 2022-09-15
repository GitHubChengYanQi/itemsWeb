import React, {useState} from 'react';
import {getDefinitionModel, splitPath} from '@/pages/BaseSystem/swagger/tools';
import {Button, Modal, Table} from 'antd';

const loopData = (modelObj, apiData) => {
  const {properties: model} = modelObj;
  if (!model) return [];
  const data = Object.keys(model).map((key) => {
    const item = {
      name: key,
      type: model[key].type,
      description: model[key].description,
    };
    const [path, models] = getDefinitionModel(model[key], apiData);
    if (path && models.properties) {
      // item.children = loopData(models, apiData);
      item.$ref = path;
      item.models = models;
    } else {
      item.$ref = '';
      item.models = model[key].items?model[key].items.type:'';
    }

    return item;
  });
  return data;
};

const Model = ({modelObj, data: apiData}) => {

  const [visible, setVisible] = useState(false);

  if (!modelObj.properties) {
    return (<h2>暂无数据</h2>);
  }
  const dataSource = loopData(modelObj, apiData);

  return (
    <Table
      rowKey="name"
      dataSource={dataSource}
      pagination={false}
      columns={[
        {
          dataIndex: 'name',
          title: '名称',
          width: 180,
          render: (text, values) => {
            return (
              <span>
                {values.name}
                {/* {values.type === 'array' && '[]'} */}
              </span>
            );
          }
        },
        {
          dataIndex: 'type',
          title: '类型',
          width: 180,
          render: (text, values) => {
            const model = values.models;
            const path = values.$ref;
            if (values.$ref && model) {
              return(<>
                <Button type="link" onClick={() => {
                  setVisible(model);
                }}>{path}</Button>
                <Modal
                  title={path}
                  open={visible}
                  onOk={() => {
                    setVisible(false);
                  }}
                  onCancel={() => {
                    setVisible(false);
                  }}
                  okText="确认"
                  cancelText="取消"
                  cancelButtonProps={{style:{display:'none'}}}
                  width={900}
                >
                  <Model modelObj={visible} data={apiData}/>
                </Modal>
              </>);
            } else {
              return (
                <span>{values.type}{values.models&&<>[{values.models}]</>}</span>
              );
            }
          }
        },
        {
          dataIndex: 'description',
          title: '描述'
        }
      ]}
    />
  );
};

export default Model;
