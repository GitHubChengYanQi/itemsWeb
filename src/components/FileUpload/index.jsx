import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Image, message, Spin, Upload} from 'antd';
import {InboxOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';
import styles from './index.module.less';
import {isArray} from '@/util/Tools';

const FileUpload = ({
  value,
  fileUpload,
  onChange = () => {
  },
  prompt,
  show,
  privateUpload,
  maxCount,
  removeIcon = true,
  uploadTypes,
  fileUploadId = 'fileUploadId'
}, ref) => {

  const uploadRef = useRef();

  const [fileList, setFileList] = useState([]);

  const [preview, setPreview] = useState('');

  const {loading, run: getUrl} = useRequest({
    url: '/sop/getImgUrls',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setFileList(res.map((item, index) => {
        return {url: item, id: value.split(',')[index]};
      }));
    }
  });

  const {run: getMediaUrls} = useRequest({
    url: '/media/v1.2/getMediaUrls',
    method: 'POST',
  }, {manual: true});

  const initImgs = async () => {
    if (privateUpload) {
      const res = await getMediaUrls({
        data: {
          model: 'PRI',
          mediaIds: value.split(',')
        }
      });
      setFileList(res.map(item => ({
        id: item.mediaId,
        name: item.filedName,
        url: item.url,
        show: true
      })));
    } else {
      getUrl({
        data: {
          imgs: value.split(',')
        }
      });
    }
  };

  const refUpload = () => {
    const fileUploadDom = document.getElementById(fileUploadId);
    fileUploadDom.click();
  };

  const insertFiles = (insertFileList) => {
    setFileList([...fileList, ...insertFileList]);
  };

  useImperativeHandle(ref, () => ({
    upload: refUpload,
    insertFiles
  }));

  useEffect(() => {
    if (value && !fileUpload) {
      initImgs();
    } else {
      setFileList([]);
    }
  }, []);

  const [oss, setOss] = useState({});

  const {run} = useRequest({
    url: '/media/getToken',
    method: 'GET'
  }, {
    manual: true,
    onSuccess: (res) => {
      if (res.errCode === 0) {
        oss.key = res.data.key;
        oss.host = res.data.host;
        oss.policy = res.data.policy;
        oss.Signature = res.data.Signature;
        oss.mediaId = res.data.mediaId;
        oss.OSSAccessKeyId = res.data.OSSAccessKeyId;
        setOss({...oss});
      }
    },
    onError: () => {
      message.error('上传失败！');
    }
  });

  const {run: runV12} = useRequest({
    url: '/media/v1.2/getToken',
    method: 'GET'
  }, {
    manual: true,
    onSuccess: (res) => {
      if (res.errCode === 0) {
        oss.key = res.data.key;
        oss.host = res.data.host;
        oss.policy = res.data.policy;
        oss.Signature = res.data.Signature;
        oss.mediaId = res.data.mediaId;
        oss.OSSAccessKeyId = res.data.OSSAccessKeyId;
        setOss({...oss});
      }
    },
    onError: () => {
      message.error('上传失败！');
    }
  });

  const {loading: fileLoading, run: fileRun} = useRequest({
    url: '/system/upload',
    method: 'POST'
  }, {
    manual: true,
    onSuccess: (res) => {
      onChange(res.fileId);
    },
    onError: () => {
      message.error('上传失败！');
    }
  });

  if (loading) {
    return <Spin />;
  }

  return (
    <Spin spinning={fileLoading} tip="上传中...">
      <div className={!show ? styles.upload : ''}>
        <Upload
          id={fileUploadId}
          ref={uploadRef}
          showUploadList={{
            showRemoveIcon: !show && removeIcon
          }}
          onPreview={async (file) => {
            if (!file.name) {
              window.open(file.url);
              return;
            }
            let imgUrl = '';
            if (file.show) {
              imgUrl = file.url;
            } else {
              const res = await getMediaUrls({
                data: {
                  model: 'PRI',
                  mediaIds: [file.id]
                }
              });
              imgUrl = res[0].url;
            }

            if (imgUrl) {
              const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
              if (['jpg', 'jpeg', 'png', 'webp'].includes(fileSuffix)) {
                setPreview(imgUrl);
              } else {
                window.open(imgUrl);
              }
            }else {
              window.open(file.url);
            }
          }}
          className={show ? styles.showUpload : ''}
          listType="picture"
          action={oss && oss.host}
          data={oss}
          fileList={fileList.filter(item => item.id)}
          maxCount={maxCount || 5}
          onChange={(file) => {
            switch (file.file.status) {
              case 'removed':
                message.warning('已删除！');
                break;
              case 'uploading':
                // message.success("上传中！");
                break;
              case 'done':
                message.success('上传成功！');
                break;
              case 'error':
                message.error('上传失败！');
                break;
              default:
                break;
            }
            if (file.file.status === 'removed') {
              setFileList(file.fileList);
              onChange(file.fileList.map((item) => {
                return item.id;
              }).toString(), true);
              return;
            }

            const newFileList = file.fileList.map((item, index) => {
              if (index === file.fileList.length - 1) {
                return {...item, id: oss.mediaId, url: `${oss.host}/${oss.key}`};
              }
              return item;
            });

            setFileList(newFileList);


            if (file.file.status === 'done') {
              onChange(newFileList.map((item) => {
                return item.id;
              }).toString());
            }
          }}
          beforeUpload={async (file) => {
            const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            let flag = true;
            if (uploadTypes) {
              flag = uploadTypes.includes(fileSuffix);
            }
            if (flag) {
              if (fileUpload) {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fileRun(
                  {
                    data: formData
                  }
                );
                setFileList([{...file, id: res.fileId}]);
                return Upload.LIST_IGNORE;
              } else if (privateUpload) {
                const data = await runV12(
                  {
                    params: {
                      model: 'PRI',
                      type: file.name
                    }
                  }
                );
                setOss({...data});
              } else {
                const data = await run(
                  {
                    params: {
                      type: file.name
                    }
                  }
                );
                setOss({...data});
              }

            } else {
              message.warn('请上传正确格式的文件！');
              return Upload.LIST_IGNORE;
            }

          }}
        >
          <div hidden={show}>
            <p className={styles.icon}>
              <InboxOutlined />
            </p>
            <p className={styles.text}>单击或拖动文件到此区域以上载</p>
          </div>
        </Upload>
      </div>
      {prompt}
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
    </Spin>

  );
};

export default React.forwardRef(FileUpload);
