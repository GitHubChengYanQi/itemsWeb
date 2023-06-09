import React, {useState, useEffect} from 'react';
import {message, Space, Upload} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';


const UpLoadImg = (props) => {
  const {value, onChange, button, type, onlyButton, text, imageType} = props;
  const [loading, setLoading] = useState(false); // loading 状态
  const [imageUrl, setImageUrl] = useState(''); // 图片地址
  const [oss, setOss] = useState({}); // OSS上传所需参数

  useEffect(() => {
    if (value) {
      // getImgDetail({data:{bannerId:value}});
      setImageUrl(value);
    } else {
      setImageUrl('');
    }
  }, [value]);

  const getSTSToken = {
    url: '/media/getToken', // 获取OSS凭证接口
    data: {}
  };

  // 获取OSS配置
  const {run: getOssObj} = useRequest(getSTSToken, {
    manual: true,
    formatResult: (e) => {
      return e;
    },
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


  // 按钮
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{marginTop: 8}}>{!loading ? '上传图片' : '上传中'}</div>
    </div>
  );


  return (
    // name 为发送到后台的文件名
    <Space align="start">
      <Upload
        maxCount={5}
        // multiple
        listType={type || 'picture-card'}
        className="avatar-uploader"
        showUploadList={false}
        data={oss}
        action={oss.host}
        beforeUpload={(file) => {
          if (!imageType || imageType.includes(file.name && file.name.split('.') && file.name.split('.')[file.name.split('.').length-1])) {
            setLoading(true);
            return new Promise((resolve, reject) => {
              getOssObj({params: {type: file.name}}).then(() => {
                resolve();
              }).catch(() => {
                reject();
              });
            });
          } else {
            message.warn('请上传正确格式的文件！');
            return false;
          }
        }}
        onChange={({event}) => {
          if (event && event.percent >= 100) {
            setLoading(false);
            message.success('上传成功！');
            setImageUrl(`${oss.host}/${oss.key}`);
            typeof onChange === 'function' && onChange(`${oss.host}/${oss.key}`,oss.mediaId);
          }
        }
        }
      >
        {button || ((imageUrl && !onlyButton) ?
          <img src={imageUrl} alt="" style={{width: '100%', height: '100%'}} /> : uploadButton)}
      </Upload>
      {text}
    </Space>
  );
};

export default UpLoadImg;
