import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'ice';
import {Button, Card, notification, Space} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import WorkFlow from '@/pages/ReSearch/BOM/WorkFlow';
import {useRequest} from '@/util/Request';

const Detail = ({
  addChildren,
  skuId,
  value: id,
  onSuccess = () => {
  },
  onBack = () => {
  }
}) => {

  const params = useParams();

  const history = useHistory();

  const [value, onChange] = useState();

  const {loading: detailLoading, run: detailRun} = useRequest({
    url: '/shipRoute/shipDetail',
    method: 'GET'
  }, {
    manual: true,
    onSuccess: (res) => {
      onChange(res);
    }
  });

  const {loading, run} = useRequest({
    url: '/shipRoute/add',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      notification.success({
        message: '保存成功！',
      });
      if (addChildren) {
        onSuccess(res);
        return;
      }
      history.push('/SPU/processRoute');
    },
    onError: () => {
      notification.success({
        message: '保存失败！',
      });
    }
  });

  useEffect(() => {
    if (id || params.id && params.id !== 'add') {
      detailRun({
        params: {
          id: id || params.id,
        }
      });
    }
  }, []);

  if (detailLoading) {
    return <ProSkeleton type="descriptions" />;
  }


  return <>
    <Card
      bodyStyle={{padding: 0}}
      extra={<Space>
        <Button loading={loading} type="primary" onClick={() => {
          run({
            data: value
          });
        }}>保存</Button>
        <Button onClick={() => {
          if (addChildren) {
            onBack();
            return;
          }
          history.push('/SPU/processRoute');
        }}>返回</Button>
      </Space>}
    />
    <Card
      style={{height: '90vh', overflowY: 'auto'}}
    >
      <WorkFlow value={value} skuId={skuId} onChange={onChange} />
    </Card>
  </>;
};

export default Detail;
