import React, {useRef} from 'react';
import {useHistory} from 'ice';
import {Button, Card} from 'antd';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import ProcessList from '@/pages/Workflow/Process/processList';

const Design = () => {


  const history = useHistory();

  const processRef = useRef();

  const orderData = [
    {name: '入库单', type: ReceiptsEnums.instockOrder},
    {name: '异常单', type: ReceiptsEnums.instockError},
    {name: '出库单', type: ReceiptsEnums.outstockOrder},
    {name: '盘点单', type: ReceiptsEnums.stocktaking},
    {name: '养护单', type: ReceiptsEnums.maintenance},
    {name: '调拨单', type: ReceiptsEnums.allocation},
    {name: '采购单', type: ReceiptsEnums.purchaseOrder},
    {name: '销售单', type: ReceiptsEnums.saleOrder},
    {name: '生产计划', type: ReceiptsEnums.production},
    {name: '生产任务', type: ReceiptsEnums.productionTask},
    {name: '发票管理', type: ReceiptsEnums.invoice},
    {name: '付款管理', type: ReceiptsEnums.payment},
  ];

  return <>
    <Card title={<Breadcrumb />} bodyStyle={{overflow:'auto'}}>
      <div style={{width: 1200, margin: 'auto'}}>
        {
          orderData.map((item, index) => {
            return <Card.Grid
              key={index}
              style={{textAlign: 'center', width: '33%', padding: 0, display: 'inline-block'}}
            >
              <div style={{padding: 24}}>
                {item.name}
              </div>
              <div style={{display: 'flex'}}>
                <Button
                  type="link"
                  style={{padding: 0, flexGrow: 1}}
                  onClick={() => {
                    processRef.current.open(item.type);
                  }}>流程设置</Button>
                <Button
                  type="link"
                  style={{padding: 0, flexGrow: 1}}
                  onClick={() => {
                    history.push(`/BASE_SYSTEM/Design/setting?type=${item.type}`);
                  }}>状态设置</Button>
                <Button
                  type="link"
                  style={{padding: 0, flexGrow: 1}}
                  onClick={() => {
                    history.push(`/BASE_SYSTEM/Design/permissions?type=${item.type}`);
                  }}>权限设置</Button>
                <Button
                  type="link"
                  style={{padding: 0, flexGrow: 1}}
                  onClick={() => {
                    history.push(`/form/config?type=${item.type}`);
                  }}>表单设置</Button>
              </div>
            </Card.Grid>;
          })
        }
      </div>
    </Card>

    <Modal
      noTitle
      headTitle="流程管理"
      width={1000}
      component={ProcessList}
      ref={processRef}
    />

  </>;
};

export default Design;
