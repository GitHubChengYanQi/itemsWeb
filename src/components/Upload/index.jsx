import React, {useState, useEffect} from 'react';
import {message, Space, Upload} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';


const UpLoadImg = (props) => {
  const {value, onChange, button, type, text, imageType} = props;
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

  // 上传前获取上传OSS所需参数 - 传入上传文件类型："png", "jpg", "gif", "mp4", "mp3","flac"
  const beforUpLoad = (imgType) => {
    if (imageType && imageType.includes(imgType)) {
      setLoading(true);
      return new Promise((resolve) => {
        getOssObj({params: {type: imgType}}).then(res => {
          resolve();
        });
      });
    } else {
      message.warn('请上传正确格式的文件！');
      return false;
    }

  };

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
      setLoading(false);
    }
  });


  // 按钮
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{marginTop: 8}}>上传图片</div>
    </div>
  );


  return (
    // name 为发送到后台的文件名
    <Space align="start">
      <Upload
        listType={type || 'picture-card'}
        className="avatar-uploader"
        showUploadList={false}
        data={oss}
        action={oss.host}
        beforeUpload={(file) => {
          return beforUpLoad(file.type.split('/')[1]);
        }}
        onChange={({event}) => {
          if (event && event.percent >= 100) {
            setImageUrl(`${oss.host}/${oss.key}`);
            typeof onChange === 'function' && onChange(`${oss.host}/${oss.key}`);
          }
        }
        }
      >
        {button || (imageUrl ? <img src={imageUrl} alt="" style={{width: '100%', height: '100%'}} /> : uploadButton)}
      </Upload>
      {text}
    </Space>
  );
};

export default UpLoadImg;
