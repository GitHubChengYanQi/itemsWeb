import React, {useRef, useState} from 'react';
import {Button, Typography, Popover, Spin} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.less';
import Modal from '@/components/Modal';
import TranserUsers from '@/pages/BaseSystem/user/components/TranserUsers';
import Add from '@/pages/BaseSystem/networkDisk/Add';
import Table from '@/components/Table';
import {
  detailUrl,
  getUserResultByOpenIds,
  listUrl,
  rename,
  spaceAclAdd,
  spaceAclDel
} from '@/pages/BaseSystem/networkDisk/url';
import {useRequest} from '@/util/Request';
import Message from '@/components/Message';
import {isArray} from '@/util/Tools';

const NetworkDisk = () => {

  const authRef = useRef();

  const addSpaceRef = useRef();

  const listRef = useRef();

  const [openPopover, setOpenPopover] = useState(false);

  const [newAuth, setNewAuth] = useState([]);

  const {loading: getUsersLoading, data: users = [], run: getUsers} = useRequest(getUserResultByOpenIds, {
    manual: true,
    onSuccess: (res) => {
      setNewAuth(res.map(item => item.userId));
    }
  });

  const {loading: detailLoading, run: detailRun} = useRequest(detailUrl, {
    manual: true,
    onSuccess: (res) => {
      getUsers({
        data: {
          openIds: isArray(res?.wxCpSpaceInfo?.spaceInfo?.authList?.authInfo).map(item => item.userId)
        }
      });
      setOpenPopover(res.spaceId);
    }
  });

  const {run: renameRun} = useRequest(rename, {
    manual: true,
    onSuccess: () => {
      Message.success('修改成功！');
      listRef.current.refresh();
    },
    onError: () => {
      Message.error('修改失败！');
    }
  });

  const {loading: spaceAclAddLoading, run: spaceAclAddRun} = useRequest(spaceAclAdd, {
    manual: true,
  });

  const {loading: spaceAclDelLoading, run: spaceAclDelRun} = useRequest(spaceAclDel, {
    manual: true,
  });

  const columns = [
    {
      title: '类型', width: 100, dataIndex: 'type', render: (value) => {
        switch (value) {
          case 'order':
            return '订单';
          case 'paymentRecord':
            return '付款';
          case 'invoiceBill':
            return '发票';
          default:
            return '-';
        }
      }
    },
    {
      title: '空间名称', dataIndex: 'spaceName', render: (value, record) => {
        return <Typography.Paragraph
          style={{display: 'inline-block', margin: '0 12px'}}
          editable={{
            onChange: (value) => {
              renameRun({
                data: {
                  spaceId: record.spaceId,
                  spaceName: value
                }
              });
            },
          }}
        >
          {value}
        </Typography.Paragraph>;
      }
    },
    {
      title: '操作', width: 120, align: 'center', dataIndex: 'spaceId', render: (value) => {
        return <div>
          <Popover
            open={openPopover === value}
            content={getUsersLoading ? <Spin /> : <>
              <TranserUsers
                value={newAuth}
                onChange={setNewAuth}
              />
              <div className={styles.save}>
                <Button
                  loading={spaceAclAddLoading || spaceAclDelLoading}
                  size="small"
                  type="primary"
                  onClick={async () => {
                    const addUsers = newAuth.filter(item => !users.find(user => user.userId === item));
                    const delUsers = users.filter(user => !newAuth.find(item => user.userId === item));

                    if (addUsers.length > 0){
                      await spaceAclAddRun({data: {spaceId: value, userIds: addUsers}});
                    }
                    if (delUsers.length > 0){
                      await spaceAclDelRun({data: {spaceId: value, userIds: delUsers.map(item => item.userId)}});
                    }

                    Message.success('修改成功！');
                    listRef.current.refresh();
                    setOpenPopover(false);
                  }}>保存</Button>
              </div>
            </>}
            title="设置空间权限"
            trigger="click"
            placement="bottom"
            onOpenChange={(open) => {
              if (!open) {
                setOpenPopover(null);
              }
            }}
          >
            <Button
              loading={detailLoading}
              type="link"
              onClick={() => {
                detailRun({
                  data: {spaceId: value}
                });
              }}
            >权限</Button>
          </Popover>
        </div>;
      }
    }
  ];

  return <div className={styles.networkDisk}>
    <Breadcrumb title="网盘管理" />

    <div className={styles.content}>
      <div className={styles.header}>
        <Button type="primary" onClick={() => {
          addSpaceRef.current.open(true);
        }}><PlusOutlined /> 添加</Button>
      </div>
      <Table
        noTableColumnSet
        noRowSelection
        tableBorder
        ref={listRef}
        headStyle={{display: 'none'}}
        bodyStyle={{padding: 0}}
        rowKey="spaceId"
        columns={columns}
        api={listUrl}
      />
    </div>

    <Modal
      ref={authRef}
    />

    <Add addSpaceRef={addSpaceRef} onSuccess={() => {
      listRef.current.submit();
      addSpaceRef.current.close();
    }} />
  </div>;
};

export default NetworkDisk;
