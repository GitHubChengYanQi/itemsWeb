import React from 'react';
import {Descriptions} from 'antd';
import {useRequest} from '@/util/Request';
import ProSkeleton from '@ant-design/pro-skeleton';

const DescAddress = (props) => {
  const {data} = props;


  if (data) {
    return (
      <>
        <Descriptions>
          <Descriptions.Item label="公司名称">{data.customerId ? data.customerId : '未填写'  }</Descriptions.Item>
          <Descriptions.Item label="省市区">{data.province ?  data.province : '未填写'}/{data.city ?  data.city : '未填写'}/{data.area ?  data.area : '未填写'}</Descriptions.Item>
          <Descriptions.Item label="详细地址">{data.address ? data.address : '未填写'}</Descriptions.Item>
          <Descriptions.Item label="报修人">{data.people ? data.people : '未填写'  }</Descriptions.Item>
          <Descriptions.Item label="报修人手机号">{data.telephone ? data.telephone : '未填写'}</Descriptions.Item>
          <Descriptions.Item label="报修人职务">{data.position ? data.position : '未填写'}</Descriptions.Item>
        </Descriptions>
      </>
    );
  }else {
    return <>暂无信息</>;
  }

};

export default DescAddress;