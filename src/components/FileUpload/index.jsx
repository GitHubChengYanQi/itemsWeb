import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Space, Spin, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';

const FileUpload = ({
  value,
  onChange = () => {
  },
  title,
  prompt,
  maxCount,
  refresh,
  imageType,
}) => {

  const [fileList, setFileList] = useState([]);


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

  useEffect(() => {
    if (value) {
      getUrl({
        data: {
          imgs: value.split(',')
        }
      });
    } else {
      setFileList([]);
    }
  }, [refresh]);

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
    }
  });

  if (loading) {
    return <Spin />;
  }


  return (
    <Space direction="vertical" style={{width: '100%'}} size="large">
      <Upload
        action={oss && oss.host}
        data={oss}
        fileList={fileList}
        maxCount={maxCount || 5}
        listType="picture"
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
            }).toString());
            return;
          }

          if (file.fileList.length === 1) {
            setFileList([{...file.fileList[0], id: oss.mediaId}]);
            onChange([oss.mediaId].toString());
          } else {
            const array = [];
            for (let i = 0; i < file.fileList.length; i++) {
              if (i === file.fileList.length - 1) {
                array.push({...file.fileList[i], id: oss.mediaId});
              } else {
                array.push(file.fileList[i]);
              }
            }
            setFileList(array);
            onChange(array.map((item) => {
              return item.id;
            }).toString());
          }
        }}
        beforeUpload={async (file) => {
          if (!imageType || imageType.includes(file.name && file.name.split('.') && file.name.split('.')[file.name.split('.').length-1])) {
            const data = await run(
              {
                params: {
                  type: file.name
                }
              }
            );
            setOss({...data});
          } else {
            message.warn('请上传正确格式的文件！');
            return Upload.LIST_IGNORE;
          }

        }}
      >
        <Space>
          <Button icon={<UploadOutlined />}>{title || '上传附件'}</Button>{prompt}
        </Space>
      </Upload>

    </Space>
  );
};

export default FileUpload;
