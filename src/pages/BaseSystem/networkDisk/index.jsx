import React, {useRef, useState} from 'react';
import {Button, Typography, Popover} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.less';
import Modal from '@/components/Modal';
import TranserUsers from '@/pages/BaseSystem/user/components/TranserUsers';
import Add from '@/pages/BaseSystem/networkDisk/Add';
import Table from '@/components/Table';
import {detailUrl, listUrl} from '@/pages/BaseSystem/networkDisk/url';
import {useRequest} from '@/util/Request';

const NetworkDisk = () => {

  const authRef = useRef();

  const addSpaceRef = useRef();

  const [openPopover, setOpenPopover] = useState(false);

  const {loading: detailLoading, run: detailRun} = useRequest(detailUrl, {
    manual: true,
    onSuccess:(res)=>{
      console.log(res);
    }
  });

  const columns = [
    {
      title: '空间名称', dataIndex: 'spaceName', render: (value) => {
        return <Typography.Paragraph
          style={{display: 'inline-block', margin: '0 12px'}}
          editable={{
            onChange: () => {
              console.log();
            },
          }}
        >
          {value}
        </Typography.Paragraph>;
      }
    },
    {
      title: '操作', width: 100, align: 'center', dataIndex: 'spaceId', render: (value) => {
        return <div>
          <Popover
            open={openPopover === value}
            content={<>
              <TranserUsers />
              <div className={styles.save}>
                <Button size="small" type="primary">保存</Button>
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
        tableBorder
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
      addSpaceRef.current.close();
    }} />
  </div>;
};

export default NetworkDisk;
