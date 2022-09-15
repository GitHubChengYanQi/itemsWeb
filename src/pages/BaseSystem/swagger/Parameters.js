import React, {Fragment, useState} from 'react';
import {Button, Table, Tag, Modal} from 'antd';
import {getDefinitionModel} from '@/pages/BaseSystem/swagger/tools';
import Model from "@/pages/BaseSystem/swagger/Model";

const Parameters = (props) => {
  const {parameters, data: apiData} = props;

  const [visible, setVisible] = useState(false);

  return (
    <>
      <Table
        pagination={false}
        bordered
        rowKey="name"
        columns={[{
          dataIndex: 'name',
          title: '名称',
          key: 'name',
          width: 250,
          render: (text, record) => {
            return (
              <Fragment>
                <span style={{marginRight: 12}}>{text}</span>
                {record.required && <Tag color="#f50">required</Tag>}
              </Fragment>
            );
          }
        }, {
          dataIndex: 'description',
          title: '描述',
          key: 'description',
        }, {
          dataIndex: 'in',
          title: '参数类型',
          key: 'in',
          width: 150,
        }, {
          dataIndex: 'schema',
          title: '数据类型',
          key: 'schema',
          width: 220,
          render: (text, record) => {
            const [path, model] = getDefinitionModel(record.schema, apiData);
            return (
              <>
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
              </>
            );
          }
        }]}
        dataSource={parameters}
      />

    </>
  );
};

export default Parameters;
