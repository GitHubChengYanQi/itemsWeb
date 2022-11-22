import React, {useImperativeHandle, useRef, useState} from 'react';
import ProSkeleton from '@ant-design/pro-skeleton';
import Modal from '@/components/Modal';
import Message from '@/components/Message';
import ProcessSteps from '@/pages/Process/Action/components/ProcessSteps';
import {useRequest} from '@/util/Request';
import {
  actionPurchaseAsk,
  createPurcaseAsk,
  PurchaseAskFooter
} from '@/pages/Workflow/Documents/components/Module/purchaseAsk';
import {
  actionInstockAsk,
  createInstockAsk,
  CreateInstockFooter
} from '@/pages/Workflow/Documents/components/Module/instock';
import Comments from '@/pages/Workflow/Documents/components/Comments';
import {createPurcaseOrder, PurchaseOrderFooter} from '@/pages/Workflow/Documents/components/Module/purchaseOrder';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';

const getTaskIdApi = {url: '/activitiProcessTask/getTaskIdByFromId', method: 'GET'};
const auditDetail = {url: '/audit/detail', method: 'GET'};

const Documents = ({
  onSuccess = () => {
  }
}, ref) => {

  // ref
  // 单据弹窗Ref
  const modalRef = useRef();
  // 添加ref
  const addRef = useRef();

  // state
  // 当前单据的type
  const [type, setType] = useState();
  // 创建单据传入的数据
  const [createData, setCreateData] = useState({});
  // 操作单据传入的数据
  const [actionData, setActionData] = useState({});
  // 单据内容
  const [document, setDocument] = useState();
  // 单据创建loading
  const [addLoading, setAddLoading] = useState();
  // 单据弹窗loading
  const [modalProps, setModalProps] = useState({width: 500, title: '创建单据', footer: []});
  // 审批流程组件props
  const [processProps, setProcessProps] = useState({data: null, createName: '', type: '', card: false});
  // 是否是创建单据
  const [createDocument, setCreateDocument] = useState(true);

  // function
  // 获取当前节点
  const getCurrentNode = (data) => {
    if (!data) {
      return {};
    }
    if (data.logResult && data.logResult.status === -1) {
      if (data.stepType === 'route') {
        return data.conditionNodeList.map((item) => {
          return getCurrentNode(item.childNode);
        });
      }
      return data;
    }
    return getCurrentNode(data.childNode);
  };

  // request
  // 通过formId获取taskId
  const {run: getTaskId} = useRequest(getTaskIdApi, {manual: true});
  // 审批详情接口
  const {loading, data, run, refresh} = useRequest(
    auditDetail,
    {
      manual: true,
      onSuccess: (res) => {
        if (!res) {
          return Message.error('参数错误！');
        }
        const node = getCurrentNode(res.stepsResult);
        const currentNode = Array.isArray(node) ? node : [node];
        switch (res.type) {
          case ReceiptsEnums.purchaseAsk:
            actionPurchaseAsk({
              setModalProps,
              setDocument,
              res,
            });
            break;
          case ReceiptsEnums.instockOrder:
            console.log(1);
            actionInstockAsk({
              setModalProps,
              setDocument,
              res,
            });
            break;
          default:
            break;
        }
        setType(res.type);
        setActionData({res, currentNode});
        setProcessProps({data: res.stepsResult, createName: res.createName, card: true});
        setCreateDocument(false);
        modalRef.current.open(true);
      }
    },
  );


  // 创建单据
  const create = (type, value, data) => {
    switch (type) {
      case ReceiptsEnums.purchaseAsk:
        createPurcaseAsk({
          setModalProps,
          setDocument,
          modalRef,
          setAddLoading,
          addRef,
          value,
          data,
          onSuccess
        });
        break;
      case ReceiptsEnums.instockOrder:
        createInstockAsk({
          setModalProps,
          setDocument,
          modalRef,
          setAddLoading,
          addRef,
          value,
          data,
          onSuccess
        });
        break;
      case 'purchaseOrder':
      case 'SO':
        createPurcaseOrder({
          setModalProps,
          setDocument,
          modalRef,
          setAddLoading,
          addRef,
          data,
          onSuccess,
          title: type === 'purchaseOrder' ? '创建采购单' : '创建销售单',
          orderModule: type === 'purchaseOrder' ? 'PO' : 'SO'
        });
        break;
      default:
        break;
    }
    setType(type);
    setCreateData({value, data});
    setProcessProps({type, card: true});
    setCreateDocument(true);
    modalRef.current.open(true);
  };

  // 单据操作
  const action = async (id, formId, type) => {
    if (!(id || (formId && type))) {
      return Message.warning('参数不正确！');
    }
    if (formId) {
      const taskId = await getTaskId({params: {formId, type}});
      if (!taskId) {
        return Message.warning('参数不正确！');
      }
      run({params: {taskId}});
    } else {
      run({params: {taskId: id,}});
    }
  };

  useImperativeHandle(ref, () => ({
    create,
    action,
  }));

  const footer = () => {
    switch (type) {
      case ReceiptsEnums.purchaseAsk:
        return <PurchaseAskFooter
          value={createData.value}
          addRef={addRef}
          modalRef={modalRef}
          addLoading={addLoading}
          createDocument={createDocument}
          res={actionData.res}
          run={run}
          currentNode={actionData.currentNode}
        />;
      case ReceiptsEnums.instockOrder:
        return <CreateInstockFooter
          value={createData.value}
          addRef={addRef}
          modalRef={modalRef}
          addLoading={addLoading}
          run={run}
          res={actionData.res}
          createDocument={createDocument}
        />;
      case 'purchaseOrder':
      case 'SO':
        return <PurchaseOrderFooter
          value={createData.value}
          addRef={addRef}
          modalRef={modalRef}
          addLoading={addLoading}
          run={run}
          res={actionData.res}
          createDocument={createDocument}
        />;
      default:
        break;
    }
  };

  return <>
    <Modal
      width={modalProps.width}
      headTitle={modalProps.title}
      ref={modalRef}
      footer={footer()}
    >
      {
        loading ?
          <ProSkeleton type="descriptions" />
          :
          <div style={{padding: 24}}>
            {document}
            <ProcessSteps {...processProps} />
            {!createDocument && data &&
            <Comments
              taskId={data.processTaskId}
              data={data.remarks}
              refresh={refresh}
            />}
          </div>
      }
    </Modal>

  </>;
};

export default React.forwardRef(Documents);
