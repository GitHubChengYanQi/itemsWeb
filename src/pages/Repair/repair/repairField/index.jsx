/**
 * 报修字段配置页
 *
 * @author siqiang
 * @Date 2021-08-20 17:11:20
 */

import React, {useEffect, useState} from 'react';
import { Input, Modal, Select as AntSelect, Upload} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import UpLoadImg from '@/components/Upload';
import Select from '@/components/Select';
import DatePicker from '@/components/DatePicker';
import {useRequest} from '@/util/Request';
import InputNumber from '@/components/InputNumber';
import Cascader from '@/components/Cascader';
import * as apiUrl from '../repairUrl';
import {bannerList} from '../repairUrl';

export const CompanyId = (props) => {
  return (<Select api={apiUrl.companyIdSelect} {...props} />);
};

export const Img = (props) => {


  const {banner} = props;

  const [imgs, setImgs] = useState({});

  const {data: bannerData, run: bannerRun} = useRequest({...bannerList}, {manual: true});

  const banners = bannerData ? bannerData.map((items, index) => {
    return {
      url: items.imgUrl || null,
    };
  }) : [];

  useEffect(() => {
    if (banner) {
      bannerRun(
        {
          data: {difference: banner}
        }
      );
    }
  }, []);



  const img = [imgs.one || null, imgs.two || null, imgs.three || null];




  props.onChange(img);


  return (
    <>
      <UpLoadImg value={banners.length>0 && banners[0].url} onChange={(value) => {
        setImgs({...imgs, one: {imgUrl: value, title: '报修设备图片'}});
      }}
      />
      <UpLoadImg value={banners.length>1 && banners[1].url} onChange={(value) => {
        setImgs({...imgs, two: {imgUrl: value, title: '报修设备图片'}});
      }} />
      <UpLoadImg value={banners.length>2 && banners[2].url} onChange={(value) => {
        setImgs({...imgs, three: {imgUrl: value, title: '报修设备图片'}});
      }} />
    </>
  );
};

export const ItemImgUrl = (props) => {

  const {banner} = props;

  const {data: bannerData, run: bannerRun} = useRequest({...bannerList}, {manual: true});

  const banners = bannerData ? bannerData.map((items, index) => {
    return {
      name: items.title || null,
      url: items.imgUrl || null,
      status: 'done',
      type: items.imgUrl && items.imgUrl.split('.')[items.imgUrl.split('.').length - 1],
    };
  }) : [];

  useEffect(() => {
    if (banner) {
      bannerRun(
        {
          data: {difference: banner}
        }
      );
    }
  }, []);

  const [oss, setOss] = useState({});

  const {data, run} = useRequest({url: '/media/getToken', method: 'GET'}, {
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


  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const [state, setState] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: banners ||
      [
        {
          name: '报修设备照片',
          status: 'done',
          type: 'png',
          url: 'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/png/20210818/20210818948181.png'
        }
      ],
  });

  const handleCancel = () => setState({previewVisible: false});

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };


  const {previewVisible, previewImage, fileList, previewTitle} = state;

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );

  const beforUpLoad = (imgType) => {
    return new Promise((resolve) => {
      run({params: {type: imgType}}).then(res => {
        resolve();
      });
    });
  };


  return (
    <>
      <Upload
        data={oss}
        action="https://gpkx.oss-cn-beijing.aliyuncs.com"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={(file) => {
          return beforUpLoad(file.type.split('/')[1]);
        }}
        onChange={async ({fileList}) => {
          const imgs = [];
          for (let i = 0; i < fileList.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            const ossToken = await run(
              {
                params: {
                  type: fileList[0].type && fileList[0].type.split('/')[1]
                }
              }
            );
            setOss({...ossToken});
            imgs.push({imgUrl: `${ossToken.host}/${ossToken.key}`, title: '报修设备照片'});
          }
          props.onChange(imgs);

          setState({fileList});
        }}
      >
        {state.fileList && state.fileList.length >= 3 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{width: '100%'}} src={previewImage} />
      </Modal>
    </>
  );
};
export const Items = (props) => {
  return (<Select api={apiUrl.itemIdSelect} {...props} />);
};
export const ItemId = (props) => {

  const {repair, state,...other} = props;


  const delivery = repair ? repair.map((value, index) => {
    return {
      label: value.itemsResult.name,
      value: value.deliveryDetailsId
    };
  }) : null;

  if (state) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      props.onChange(null);
    }, [repair]);
  }


  return (<AntSelect options={delivery}  {...other} />);
};
export const ServiceType = (props) => {
  return (<AntSelect style={{width: 200}} options={[{label: '设备项修', value: '设备项修'}]} {...props} />);
};
export const ExpectTime = (props) => {
  return (<DatePicker {...props} />);
};
export const Comment = (props) => {
  return (<Input.TextArea {...props} />);
};

export const Money = (props) => {
  return (<InputNumber min={0} {...props} />);
};
export const QualityType = (props) => {
  return (<AntSelect
    style={{width: 200}}
    options={[{label: '质保内', value: '质保内'}, {label: '质保外', value: '质保外'}]}  {...props} />);
};
export const ContractType = (props) => {
  return (<AntSelect
    style={{width: 200}}
    options={[{label: '合同内', value: '合同内'}, {label: '合同外', value: '合同外'}]} {...props} />);
};

export const CustomerId = (props) => {

  const {customerId, onChange,...other} = props;


  const {loading, data, run} = useRequest({
    ...apiUrl.companyIdSelect,
    data: {}
  });



  return (<AntSelect options={data} loading={loading} {...props} onChange={(value) => {
    onChange(value);
    customerId(value);
  }} />);

};
export const ImgUrl = (props) => {
  return (<UpLoadImg {...props} />);
};
export const Province = (props) => {
  return (<Cascader {...props} placeholder="请选择地区" />);
};
export const Address = (props) => {
  return (<Input {...props} />);
};
export const People = (props) => {
  return (<Input {...props} />);
};
export const Position = (props) => {
  return (<Input {...props} />);
};
export const Telephone = (props) => {
  return (<Input {...props} />);
};
