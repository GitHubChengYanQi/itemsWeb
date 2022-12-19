/**
 * 列表页
 *
 * @author Captain_Jazz
 * @Date 2022-03-15 08:54:48
 */

import React, {useState} from 'react';
import {Button, Divider, Image, Input, Pagination, Space, Spin} from 'antd';
import {config} from 'ice';
import cookie from 'js-cookie';
import {commonMediaList, getMediaPath} from '../commonMediaUrl';
import {useRequest} from '@/util/Request';
import UpLoadImg from '@/components/Upload';
import styles from './index.module.less';


const CommonMediaList = ({
  getImg = () => {
  },
}) => {

  const token = cookie.get('tianpeng-token');

  const [name, setName] = useState();

  const [current, setCurrent] = useState(1);

  const {loading, data, refresh, run} = useRequest({
    ...commonMediaList,
    params: {limit: 10, page: 1},
    data: {types: ['png', 'PNG', 'jpeg', 'JPEG', 'jpg', 'JPG', 'gif', 'GIF']}
  },{
    response: true,
  });

  const {loading: insertLoading, run: insertRun} = useRequest(getMediaPath,
    {
      manual: true,
      onSuccess: (res) => {
        getImg(res);
      }
    });

  const runList = (pageSize, number, name) => {
    run({
      params: {limit: pageSize, page: number},
      data: {
        fieldName: name,
        types: ['png', 'PNG', 'jpeg', 'JPEG', 'jpg', 'JPG', 'gif', 'GIF']
      }
    });
  };

  return (
    <>
      <Space>
        图片名称：
        <Input
          value={name}
          placeholder="请输入图片名称"
          onChange={(value) => {
            setName(value.target.value);
          }} />
        <Button type="primary" onClick={() => {
          runList(10, 1, name);
        }}>查询</Button>
      </Space>
      <Divider />
      <Spin spinning={loading || insertLoading}>
        <Space wrap size={16}>
          <UpLoadImg
            onlyButton
            onChange={() => {
              refresh();
            }} />
          {data && data.data && data.data.map((item, index) => {
            const url = `${config.baseURI}media/getUrlByMediaId?mediaId=${item.mediaId}`;
            return <Image
              alt={item.filedName}
              title={item.filedName}
              style={{cursor: 'pointer'}}
              preview={false}
              key={index}
              src={`${url}&xOssProcess=image/resize,m_fill,h_100,w_100&authorization=${token}`}
              className={styles.img}
              height={100}
              width={100}
              onClick={() => {
                insertRun({
                  params: {
                    mediaId: item.mediaId
                  }
                });
              }} />;
          })}
        </Space>
        <Divider />
        <div style={{textAlign: 'center'}}>
          <Pagination current={current} size="small" total={data && data.count} onChange={(number, pageSize) => {
            setCurrent(number);
            runList(pageSize, number, name);
          }} showSizeChanger showQuickJumper />
        </div>
      </Spin>
    </>
  );
};

export default CommonMediaList;
