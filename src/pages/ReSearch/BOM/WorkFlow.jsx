import React, {useEffect, useRef, useState} from 'react';
import {Button, Form, Input, Modal, Space} from 'antd';
import Drawer from '@/components/Drawer';
import EndNode from './Nodes/EndNode';
import Render from './Nodes/Render';
import {OptionTypes, NodeTemplates, NodeTypes} from './Nodes/Constants';
import WFC from './OperatorContext';
import ZoomLayout from './Nodes/ZoomLayout';
import Setps from './Nodes/Setps';
import styles from './index.module.scss';
import Select from '@/components/Select';
import {partsDetail, partsListSelect} from '@/pages/Erp/parts/PartsUrl';
import FileUpload from '@/components/FileUpload';
import {request} from '@/util/Request';
import AddProcess from '@/pages/ReSearch/BOM/components/AddProcess';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';


const WorkFlow = ({value, onChange, type, module}) => {

  const ref = useRef();

  const refStart = useRef();

  const defaultConfig = {
    'pkId': 'start',
    'nodeName': '生产产品',
    'type': '0',
    'childNode': null,  // 下级步骤
    'conditionNodeList': [] // 分支
  };

  const [config, setConfig] = useState(value || defaultConfig);

  const [currentNode, setCurrentNode] = useState();

  const [startData, setStartData] = useState();

  function updateNode() {
    typeof onChange === 'function' && onChange({...config});
    setConfig({...config});
  }

  // let currentNode = null;

  // 链表操作: 几种行为， 添加行为，删除行为，点击行为     pRef.childNode -> objRef.childNode -> 后继
  // 添加节点

  function onAddNode(type, pRef, objRef) {

    const o = objRef.childNode;

    if (type === OptionTypes.APPROVER) {
      objRef.childNode = {...NodeTemplates[OptionTypes.APPROVER], childNode: o};
    }
    if (type === OptionTypes.NOTIFIER) {
      objRef.childNode = {...NodeTemplates[OptionTypes.NOTIFIER], childNode: o};
    }
    if (type === OptionTypes.CONDITION) {
      objRef.childNode = {
        ...NodeTemplates[OptionTypes.CONDITION],
        conditionNodeList: [
          {
            ...NodeTemplates[OptionTypes.BRANCH],
            nodeName: '条件1',
            auditType: 'branch',
            stepType: 'branch',
            childNode: o
          },
          {...NodeTemplates[OptionTypes.BRANCH], nodeName: '条件2', auditType: 'branch', stepType: 'branch',},
        ]
      };
    }
    if (type === OptionTypes.BRANCH) {
      objRef.conditionNodeList.push({...NodeTemplates[NodeTypes.BRANCH], auditType: 'branch', stepType: 'branch'});
    }
    updateNode();
  }

  // 删除节点
  function onDeleteNode(pRef, objRef, type, index) {
    Modal.confirm({
      centered: true,
      title: '是否删除节点?',
      onOk: () => {
        if (type === NodeTypes.BRANCH) {
          objRef.conditionNodeList.splice(index, 1);
        } else {
          const newObj = objRef.childNode;
          pRef.childNode = newObj;
        }
        updateNode();
      }
    });
  }


  // 获取节点
  function onSelectNode(pRef, objRef) {
    setCurrentNode({
      current: objRef,
      prev: pRef
    });

    switch (objRef.type) {
      case '1':
      case '3':
        ref.current.open(true);
        break;
      default:
        break;
    }

  }

  useEffect(() => {
    if (value) {
      setConfig({...value});
    }
  }, [value]);

  return (
    <WFC.Provider value={{config, updateNode, onAddNode, onDeleteNode, onSelectNode}}>
      <section className={styles.dingflowDesign}>
        <ZoomLayout>
          <Render
            config={config}
            data={currentNode}
            onContentClick={() => {
              refStart.current.open(false);
            }} />
          <EndNode />
        </ZoomLayout>
      </section>
      <Drawer title="步骤设置" ref={ref} width={800}>
        <Setps
          type={type}
          module={module}
          onChange={(value) => {
            ref.current.close();
            updateNode();
          }}
          onClose={() => {
            ref.current.close();
          }}
        />
      </Drawer>

      <Drawer title="生产产品" ref={refStart} width={800}>
        <AddProcess
          onClose={()=>{
            refStart.current.close();
          }}
          value={startData}
          onChange={(value) => {
            setStartData(value);
            setCurrentNode({
              name:  <SkuResultSkuJsons skuResult={value.skuResult} />,
            });
            refStart.current.close();
          }}
        />
      </Drawer>
    </WFC.Provider>
  );
};

export default WorkFlow;
