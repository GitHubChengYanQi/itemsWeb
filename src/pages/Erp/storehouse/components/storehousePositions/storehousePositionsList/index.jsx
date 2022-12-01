/**
 * 仓库库位表列表页
 *
 * @author song
 * @Date 2021-10-29 09:22:25
 */

import React, {useRef, useState} from 'react';
import {SearchOutlined} from '@ant-design/icons';
import {Button, Card, Divider, Input, Space, Table as AntTable, Drawer as AntDrawer} from 'antd';
import cookie from 'js-cookie';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import {
  storehousePositionsDelete,
} from '../storehousePositionsUrl';
import StorehousePositionsEdit from '../storehousePositionsEdit';
import Breadcrumb from '@/components/Breadcrumb';
import Code from '@/pages/Erp/spu/components/Code';
import {useRequest} from '@/util/Request';
import TableSort from '@/components/Table/components/TableSort';
import UpdateSort from '@/components/Table/components/UpdateSort';
import StorehousePositionsBindList
  from '@/pages/Erp/storehouse/components/storehousePositionsBind/storehousePositionsBindList';
import DeptTree from '@/components/DeptTree';
import Import from '@/pages/Erp/sku/SkuTable/Import';
import {config} from 'ice';
import Note from '@/components/Note';

const {baseURI} = config;

const {Column} = AntTable;

const StorehousePositionsList = (props) => {

  const token = cookie.get('tianpeng-token');

  const {value} = props;
  const ref = useRef(null);
  const bindRef = useRef(null);
  const [deptVisible, setDeptVisible] = useState();

  const [depts, setDepts] = useState([]);

  // 排序
  const [sorts, setSorts] = useState([]);

  const {run: deptRun} = useRequest({
    url: '/storehousePositionsDeptBind/add',
    method: 'POST'
  }, {
    manual: true,
    onSuccess: () => {
      setDeptVisible(false);
    }
  });

  const {run: getDeptRun} = useRequest({
    url: '/storehousePositionsDeptBind/getDeptIds',
    method: 'GET'
  }, {
    manual: true,
    onSuccess: (res) => {
      setDepts(res || []);
    }
  });

  const [name, setName] = useState();
  const actions = () => {
    return (
      <Space>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </Space>
    );
  };

  const {loading, data, run, refresh} = useRequest({
    url: `/storehousePositions/treeView?ids=${value}`,
    method: 'GET',
  },);

  const dataSourcedChildren = (data) => {
    if (!Array.isArray(data.children) || data.children.length === 0) {
      return {...data, children: null};
    }
    return {
      ...data, children: data.children.map((item) => {
        return dataSourcedChildren(item);
      })
    };
  };

  return (
    <>
      <Card title={<Space>
        <Input placeholder="库位名称" onChange={(value) => {
          setName(value.target.value);
        }} />
        <Button htmlType="submit" type="primary" onClick={() => {
          run({
            params: {
              name,
            }
          });
        }}><SearchOutlined />查询</Button>
        <UpdateSort
          disabled={sorts.length === 0}
          type="positions"
          sorts={sorts}
          success={() => {
            refresh();
            setSorts([]);
          }}
        />
      </Space>} extra={actions()}>
        <AntTable
          dataSource={data && data.map((item) => {
            return dataSourcedChildren(item);
          }) || []}
          loading={loading}
          rowKey="value"
          pagination={false}
        >
          <Column title="库位名称" dataIndex="label" render={(value, record) => {
            return (
              <Space>
                <Code style={{width: 24, height: 24}} source="storehousePositions" id={record.value} />
                <Note width={200}>{value}</Note>
              </Space>
            );
          }} />
          <Column
            title="序号"
            dataIndex="sort"
            width={100}
            align="center"
            render={(text, item) => {
              return <TableSort
                rowKey={item.value}
                sorts={sorts}
                value={text || 0}
                onChange={(value) => {
                  setSorts(value);
                }} />;
            }} />
          <Column title="操作" align="right" render={(value, record) => {
            if (record.value !== '0') {
              return (
                <>
                  {
                    !record.children && <Button type="link" onClick={() => {
                      bindRef.current.open(record.value);
                    }}>绑定物料</Button>
                  }
                  <Button type="link" onClick={async () => {
                    await getDeptRun({
                      params: {
                        positionId: record.value
                      }
                    });
                    setDeptVisible(record.value);
                  }}>设置权限</Button>
                  <EditButton onClick={() => {
                    ref.current.open(record.value);
                  }} />
                  <DelButton api={storehousePositionsDelete} value={record.value} onSuccess={() => {
                    refresh();
                  }} />
                </>
              );
            }
          }} />
        </AntTable>
      </Card>
      <Drawer width={800} title="编辑" component={StorehousePositionsEdit} onSuccess={() => {
        refresh();
        ref.current.close();
      }} ref={ref} storehouse={value} />

      <Drawer width={800} title="物料信息" component={StorehousePositionsBindList} onSuccess={() => {
        bindRef.current.close();
      }} ref={bindRef} />

      <AntDrawer
        open={deptVisible}
        width={800}
        title="设置权限"
        destroyOnClose
        onClose={() => {
          setDeptVisible(false);
          setDepts([]);
        }}
      >
        <DeptTree value={depts} onChange={setDepts} />
        <div style={{textAlign: 'center', margin: 16}}>
          <Space>
            <Button disabled={depts.length === 0} type="primary" onClick={() => {
              deptRun({
                data: {
                  storehousePositionsId: deptVisible,
                  deptId: depts.toString(),
                }
              });
            }}>确定</Button>
            <Button onClick={() => {
              setDepts([]);
              setDeptVisible(false);
            }}>取消</Button>
          </Space>
        </div>
      </AntDrawer>
    </>
  );
};

export default StorehousePositionsList;
