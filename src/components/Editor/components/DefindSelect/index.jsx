import React, {useRef} from 'react';
import {Button, Card, Dropdown, Menu, message, Space, Spin, Typography} from 'antd';
import {CheckOutlined, PlusOutlined} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import {useRequest} from '@/util/Request';
import Modal from '@/components/Modal';
import Defined from '@/components/Editor/components/Defined';

const DefindSelect = ({style, buttonStyle}) => {

  const definedRef = useRef();

  const {loading: listLoading, data, refresh} = useRequest({url: '/contractTemplete/list', method: 'POST'});

  const {loading: deleteLoading, run: deleteRun} = useRequest({url: '/contractTemplete/delete', method: 'POST'}, {
    manual: true,
    onSuccess: () => {
      refresh();
    }
  });

  const {loading: addLoading, run} = useRequest({url: '/contractTemplete/add', method: 'POST'}, {
    manual: true,
    onSuccess: () => {
      refresh();
      definedRef.current.close();
    }
  });

  const menu = (item) => {
    return <Menu items={[{
      key: 'update',
      label: <Button type="link" style={{padding: 0, width: '100%'}} onClick={() => {
        definedRef.current.open(item);
      }}>修改</Button>
    }, {
      key: 'delete',
      label: <Button type="link" style={{padding: 0, width: '100%'}} danger onClick={() => {
        deleteRun({data: {contractTemplateId: item.contractTemplateId}});
      }}>删除</Button>
    }]} />;
  };

  const grid = (item, idnex) => {
    return <Dropdown key={idnex} overlay={menu(item)} placement="bottomLeft">
      <Card.Grid style={style}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Typography.Text
            copyable={{
              icon: [<div style={{...buttonStyle, color: '#000'}}>{item.name}</div>,
                <div style={buttonStyle}><Space>已复制 <CheckOutlined /></Space></div>],
              text: `\${${item.name}}`,
              tooltips: false,
            }}
            level={5}
            style={{margin: 0, flexGrow: 1}}
          />
        </div>
      </Card.Grid>
    </Dropdown>;
  };

  const addVar = useRef();

  return <Spin spinning={listLoading || deleteLoading}>
    <ProCard
      headerBordered
      className="h3Card"
      title="合同约定条款变量"
      bodyStyle={{padding: 0}}
      extra={<Button onClick={() => {
        definedRef.current.open({});
      }}><PlusOutlined />添加自定义变量</Button>}>
      <Space wrap>
        {
          data && data.map((item, index) => {
            return grid(item, index);
          })
        }
      </Space>
    </ProCard>

    <Modal
      width={800}
      ref={definedRef}
      headTitle="添加自定义变量"
      component={Defined}
      compoentRef={addVar}
      footer={<Space>
        <Button
          loading={addLoading}
          type="primary"
          onClick={() => {
            const res = addVar.current.save();
            if (!res.name) {
              return message.warn('请输入标题!');
            }
            run({
              data: res
            });
          }}
        >保存
        </Button>
        <Button onClick={() => {
          definedRef.current.close();
        }}>取消</Button>
      </Space>}
    />
  </Spin>;
};

export default DefindSelect;
