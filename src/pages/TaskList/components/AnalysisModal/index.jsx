import {Button, Space} from 'antd';
import React, {useRef, useState} from 'react';
import {useHistory} from 'ice';
import Modal from '@/components/Modal';
import AnalysisDetail from '@/pages/Erp/Analysis/AnalysisDetail';
import Documents from '@/pages/Workflow/Documents';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';

const AnalysisModal = ({showRef}) => {

  const [content, seContent] = useState({});

  const documentRef = useRef();

  return <>
    <Modal
      width="auto"
      headTitle="物料推荐"
      component={AnalysisDetail}
      onSuccess={(res) => {
        seContent(res);
      }}
      footer={<Space>
        <Button onClick={() => {
          showRef.current.close();
        }}>关闭</Button>
        <Button disabled={!Array.isArray(content.owe) || content.owe.length === 0} type="primary" onClick={() => {

          const skus = content.owe.map((item) => {
            return {
              skuId: item.skuId,
              applyNumber: item.lackNumber,
              skuResult: {...item,standard:item.strand, spuResult: {name: item.spuName}},
            };
          });
          showRef.current.close();
          documentRef.current.create(ReceiptsEnums.purchaseAsk, null, {skus});
        }}>发起采购</Button>
      </Space>}
      ref={showRef}
    />

    <Documents ref={documentRef} />
  </>;
};

export default AnalysisModal;
