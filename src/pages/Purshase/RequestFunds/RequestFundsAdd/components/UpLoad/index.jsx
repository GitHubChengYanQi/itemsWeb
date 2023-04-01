import React, {useEffect, useRef, useState} from 'react';
import {Button, Checkbox, Image, Space, Spin, Upload} from 'antd';
import FileUpload from '@/components/FileUpload';
import Modal from '@/components/Modal';
import {useRequest} from '@/util/Request';
import styles from './index.module.less';
import {isArray} from '@/util/Tools';
import Empty from '@/components/Empty';
import Note from '@/components/Note';

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
        openSelectList('paymentRecord');
      }}>付款附件</Button>
      <Button loading={getAllFileLoading} type="link" onClick={() => {
        openSelectList('invoiceBill');
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
          const newIds = value ? checkedList.filter(item => {
            const ids = value.split(',');
            return !ids.find(id => id === item);
          }) : checkedList;
          onChange(value ? `${value},${newIds.join(',')}` : newIds.join(','));
          fileRef.current.insertFiles(newIds.map((item) => {
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
                      <div className={styles.show} onClick={async () => {
                        if (!item.filedName) {
                          window.open(item.url);
                          return;
                        }
                        const res = await getMediaUrls({
                          data: {
                            model: 'PRI',
                            mediaIds: [item.mediaId]
                          }
                        });
                        if (isArray(res).length > 0) {
                          const fileSuffix = item.filedName.substring(item.filedName.lastIndexOf('.') + 1).toLowerCase();
                          if (['jpg', 'jpeg', 'png', 'webp'].includes(fileSuffix)) {
                            setPreview(res[0].url);
                          } else {
                            window.open(res[0].url);
                          }
                        }
                      }}>
                        <Image
                          preview={false}
                          src={item.url}
                          width={50}
                          height={50}
                          style={{minWidth: 50}}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                        />
                        <Note value={item.filedName} />
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
