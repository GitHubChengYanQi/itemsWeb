import React, {useRef, useState} from 'react';
import {Button, Progress, Tag} from 'antd';
import {CheckCircleOutlined, SyncOutlined} from '@ant-design/icons';
import Table from '@/components/Table';
import {useRequest} from '@/util/Request';
import PrintCardTemplate from '@/pages/Production/ProductionPlan/PlanDetail/components/PrintCardTemplate';
import Modal from '@/components/Modal';
import {rateTool} from '@/util/Tools';

const list = {url: '/productionCard/list', method: 'POST'};
const miniAppGetWxaCodeUnLimit = {url: '/miniApp/getWxaCodeUnLimit', method: 'POST'};

const ProductionCard = (
  {
    productionPlanId,
    bomCount
  }
) => {

  const listRef = useRef();

  const printRef = useRef();

  const [imgUrl, setImgUrl] = useState('');

  const [cardListLength, setCardListLength] = useState(0);

  const {loading, run} = useRequest(miniAppGetWxaCodeUnLimit, {
    manual: true,
    onSuccess: (res) => {
      setImgUrl(`data:image/png;base64,${res.toString('base64')}`);
      printRef.current.open(true);
    }
  });

  const [cardItem, setCardItem] = useState({});

  const columns = [
    {title: '卡片编码', dataIndex: 'cardCoding'},
    {
      title: '状态', dataIndex: 'status', width: 80, align: 'center', render(value) {
        if (value === 99) {
          return <Tag icon={<CheckCircleOutlined />} color="success">
            完成
          </Tag>;
        } else {
          return <Tag icon={<SyncOutlined />} color="processing">
            进行中
          </Tag>;
        }
      }
    },
    {
      title: 'Bom数', dataIndex: 'doneBomCount', width: 80, align: 'center', render() {
        return bomCount / cardListLength;
      }
    },
    {
      title: '已生产', dataIndex: 'doneBomCount', width: 80, align: 'center', render(value) {
        return <div style={{color: '#52c41a'}}>{value}</div>;
      }
    },
    {
      title: '生产进度', dataIndex: 'cardCoding', align: 'center', render(value, render) {
        return <Progress
          strokeColor="#52c41a"
          percent={rateTool((render.doneBomCount || 0), bomCount / cardListLength, true)}
        />;
      }
    },
    {
      title: '操作', width: 70, align: 'center', dataIndex: 'productionCardId', render(value, record) {
        return <>
          <Button loading={cardItem.productionCardId === value ? loading : false} type="link" onClick={() => {
            setCardItem(record);
            run({
              data: {
                scene: value,
                page: 'Production/ProductionCard/index',
                checkPath: false,
                envVersion: process.env.NODE_ENV === 'production' ? 'release' : 'develop',
                width: 100,
              }
            });
          }}>打印卡片</Button>
        </>;
      }
    }
  ];

  return <>
    <Table
      onResponse={(res) => {
        setCardListLength(res.count);
      }}
      formSubmit={(values) => {
        return {...values, sourceId: productionPlanId};
      }}
      contentHeight
      noTableColumnSet
      noRowSelection
      tableBorder
      ref={listRef}
      headStyle={{display: 'none'}}
      bodyStyle={{padding: 0}}
      rowKey="productionCardId"
      columns={columns}
      api={list}
    />

    <Modal
      headTitle="生产卡片"
      ref={printRef}
      footer={<>
        <Button onClick={() => printRef.current.close()}>取消</Button>
        <Button type="primary" onClick={() => {
          const newWindow = window.open('');
          newWindow.document.body.innerHTML = document.getElementById('printCardTemplate').innerHTML;
          newWindow.print();
          newWindow.close();
        }}>打印</Button>
      </>}
    >
      <PrintCardTemplate imgUrl={imgUrl} cardItem={cardItem} />
    </Modal>
  </>;
};

export default ProductionCard;
