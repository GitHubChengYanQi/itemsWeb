import React, {useState} from 'react';
import {Button, Dropdown, List, Modal, Spin} from 'antd';
import * as pako from 'pako';
import {EllipsisOutlined} from '@ant-design/icons';
import Empty from '@/components/Empty';
import {useRequest} from '@/util/Request';
import {add, deleteItem, detail, list} from '@/components/Form/components/DraftUrl';
import Message from '@/components/Message';
import DatePicker from '@/components/DatePicker';

const Enc = require('enc');

const Draft = (
  {
    type,
    getValues = () => {
    },
    onChange = () => {
    },
    name,
    disabled,
  }) => {

  const save = (values) => {
    const deflate = pako.deflate(JSON.stringify(values));
    return Enc.base64.encode(deflate);
  };

  const decode = (base64) => {
    const strData = atob(base64);
    const charData = strData.split('').map((x) => {
      return x.charCodeAt(0);
    });
    const binData = new Uint8Array(charData);
    const data = pako.inflate(binData, {to: 'string'});
    return JSON.parse(data);
  };

  const {loading: listLoading, data: listDta, refresh, run: listRun} = useRequest({
    ...list,
    data: {type},
    params: {limit: 5, page: 1}
  });

  const {loading: deleteLoading, run: deleteRun} = useRequest(deleteItem, {
    manual: true,
    onSuccess: () => {
      Message.success('删除草稿成功！');
      refresh();
    }
  });

  const {loading: detailLoading, run: detailRun} = useRequest(detail, {
    manual: true,
    onSuccess: (res) => {
      const data = decode(res.info);
      onChange(data);
    }
  });

  const {loading: addLoading, run: addRun} = useRequest(add, {
    manual: true,
    onSuccess: () => {
      Message.success('储存草稿成功！');
      refresh();
    }
  });

  const [visible, setVisible] = useState();

  if (!type) {
    return <></>;
  }

  const menu = () => {
    if (listLoading) {
      return <Spin />;
    }

    if (!listDta) {
      return <Empty />;
    }

    return <div style={{backgroundColor: '#fff'}}>
      <DatePicker
        width="100%"
        RangePicker
        onChange={(time) => {
          listRun({
            data: {dates: time}
          });
        }} />

      <List bordered>
        {
          listDta.length === 0 && <div style={{paddingBottom: 16}}><Empty description="暂无草稿" /></div>
        }
        {
          listDta.map((item, index) => {
            return <List.Item
              key={item.draftsId}
            >
              <div style={{display: 'flex', alignItems: 'center',width:'100%'}}>
                <div style={{flexGrow: 1}}>{index + 1}.</div>
                <div style={{marginLeft: 8, flexGrow: 1}}>
                  {item.name || item.createTime}
                </div>
                <Button type="link" style={{padding: '0 8px', marginLeft: 24}} onClick={() => {
                  setVisible(false);
                  Modal.confirm({
                    title: '是否使用此草稿？',
                    content: `草稿创建时间 【${item.createTime}】`,
                    onOk: () => detailRun({data: {draftsId: item.draftsId}})
                  });
                }}>使用草稿</Button>
                <Button type="link" style={{padding: '0 8px'}} danger onClick={() => {
                  setVisible(false);
                  Modal.confirm({
                    title: '是否删除此草稿？',
                    content: `草稿创建时间 【${item.createTime}】`,
                    onOk: () => {
                      deleteRun({data: {draftsId: item.draftsId}});
                    }
                  });
                }}>删除</Button>
              </div>
            </List.Item>;
          })
        }
      </List>
    </div>;
  };


  return <>
    <Dropdown.Button
      placement="topRight"
      open={visible}
      trigger="click"
      buttonsRender={() => {
        return [
          <Button
            disabled={disabled}
            type="primary"
            loading={addLoading || detailLoading || deleteLoading}
            ghost
            onClick={() => {
              Modal.confirm({
                title: '是否储存此草稿？',
                onOk: async () => {
                  addRun({
                    data: {
                      info: save(await getValues()),
                      name,
                      type,
                    }
                  });
                }
              });

            }}
          >存草稿</Button>,
          <Button type="primary" ghost><EllipsisOutlined /></Button>
        ];
      }}
      onOpenChange={setVisible}
      overlay={menu}
    />
  </>;
};

export default Draft;
