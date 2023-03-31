import React, {useEffect, useRef, useState} from 'react';
import {Button, Checkbox, Image, Space, Spin, Upload} from 'antd';
import FileUpload from '@/components/FileUpload';
import Modal from '@/components/Modal';
import {useRequest} from '@/util/Request';
import styles from './index.module.less';
import {isArray} from '@/util/Tools';
import Empty from '@/components/Empty';

const UpLoad = ({value, onChange, orderId}) => {

  const modalRef = useRef();
  const fileRef = useRef();

  const {run: getMediaUrls} = useRequest({
    url: '/media/v1.2/getMediaUrls',
    method: 'POST',
  }, {manual: true});

  const {loading: getAllFileLoading, data: allFiles = {}, run: getAllFiles} = useRequest({
    url: '/order/getAllFile',
    method: 'POST',
  }, {manual: true});


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [preview, setPreview] = useState('');

  const openSelectList = async (type) => {
    setLoading(true);
    setCheckedList([]);
    modalRef.current.open(true);
    let mediaIds = [];
    switch (type) {
      case 'order':
        if (allFiles.orderFiles) {
          mediaIds = allFiles.orderFiles.split(',');
        }
        break;
      case 'invoiceBill':
        if (allFiles.invoiceBillFiles) {
          mediaIds = allFiles.invoiceBillFiles.split(',');
        }
        break;
      case 'paymentRecord':
        if (allFiles.paymentRecordFiles) {
          mediaIds = allFiles.paymentRecordFiles.split(',');
        }
        break;
      default:
        break;
    }
    const newData = await getMediaUrls({
      data: {
        model: 'PRI',
        mediaIds
      }
    });
    setLoading(false);
    setData(newData || []);
  };

  useEffect(() => {
    getAllFiles({
      data: {orderId}
    });
  }, []);

  return <div>
    <div>
      <Button loading={getAllFileLoading} type="link" onClick={() => {
        openSelectList('order');
      }}>订单附件</Button>
      <Button loading={getAllFileLoading} type="link" onClick={() => {
        openSelectList('invoiceBill');
      }}>付款附件</Button>
      <Button loading={getAllFileLoading} type="link" onClick={() => {
        openSelectList('paymentRecord');
      }}>发票附件</Button>
    </div>

    <FileUpload ref={fileRef} privateUpload value={value} onChange={onChange} maxCount={5} />

    <Modal
      headTitle="选择附件"
      ref={modalRef}
      footer={<Space>
        <Checkbox indeterminate={checkedList.length > 0 && checkedList.length !== data.length} onChange={() => {
          setCheckedList(checkedList.length === data.length ? [] : data.map(item => item.mediaId));
        }} checked={checkedList.length === data.length}>
          全选
        </Checkbox>
        <Button type="primary" onClick={() => {
          modalRef.current.close();
          onChange(value ? `${value},${checkedList.join(',')}` : checkedList.join(','));
          fileRef.current.insertFiles(checkedList.map((item) => {
            const file = data.find(fileItem => fileItem.mediaId === item) || {};
            return {
              id: item,
              name: file.filedName,
              url: file.url
            };
          }));
        }}>插入</Button>
      </Space>}
    >
      <div style={{padding: 16}}>
        {
          loading ?
            <div style={{textAlign: 'center', padding: 12}}><Spin /></div>
            :
            <>
              {data.length === 0 && <Empty description="暂无附件" />}
              <Checkbox.Group value={checkedList} onChange={(checkedValue) => {
                setCheckedList(checkedValue);
              }} className={styles.list}>
                {
                  data.map((item, index) => {
                    return <div align="center" key={index} className={styles.checkboxItem}>
                      <Checkbox value={item.mediaId} key={index} />
                      <div className={styles.show}>
                        <Upload
                          showUploadList={{
                            showRemoveIcon: false
                          }}
                          onPreview={async (file) => {
                            if (!file.name) {
                              window.open(file.url);
                              return;
                            }
                            const res = await getMediaUrls({
                              data: {
                                model: 'PRI',
                                mediaIds: [file.id]
                              }
                            });
                            if (isArray(res).length > 0) {
                              const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
                              if (['jpg', 'jpeg', 'png', 'webp'].includes(fileSuffix)) {
                                setPreview(res[0].url);
                              } else {
                                window.open(res[0].url);
                              }
                            }
                          }}
                          listType="picture"
                          fileList={[{url: item.url, name: item.filedName, id: item.mediaId}]}
                          className={styles.upload}
                        />
                      </div>
                    </div>;
                  })
                }
              </Checkbox.Group>
            </>
        }
      </div>
    </Modal>

    <Image
      width={200}
      src={preview}
      style={{
        display: 'none',
      }}
      preview={{
        visible: preview,
        src: preview,
        onVisibleChange: (value) => {
          setPreview(value ? preview : '');
        },
      }}
    />
  </div>;
};

export default UpLoad;
