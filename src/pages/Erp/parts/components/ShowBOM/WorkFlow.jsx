import React, {useEffect, useState} from 'react';
import {Modal} from 'antd';
import EndNode from './Nodes/EndNode';
import Render from './Nodes/Render';
import {OptionTypes, NodeTemplates, NodeTypes} from './Nodes/Constants';
import WFC from './OperatorContext';
import ZoomLayout from './Nodes/ZoomLayout';
import styles from './index.module.scss';


const WorkFlow = ({value, onChange}) => {


  const defaultConfig = {
    'pkId': 'start',
    'nodeName': '适用物料',
    'type': '0',
    'childNode': null,  // 下级步骤
    'conditionNodeList': [] // 分支
  };

  const [config, setConfig] = useState(value || defaultConfig);

  const [currentNode, setCurrentNode] = useState({});

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

    // switch (objRef.type) {
    //   case '0':
    //     refStart.current.open(false);
    //     break;
    //   case '1':
    //   case '3':
    //     ref.current.open(true);
    //     break;
    //   default:
    //     break;
    // }

  }

  useEffect(() => {
    if (value) {
      setConfig(value);
      // if (value.processRoute && value.processRoute.partsId) {
      //   partsIdBom(value.processRoute.partsId);
      // }
    }
  }, [value]);

  useEffect(() => {
    setTimeout(() => {
      const dingflowDesign = document.getElementById('dingflowDesign');
      const bomStartNode = document.getElementById('bomStartNode');
      if (dingflowDesign) {
        dingflowDesign.scrollTo(bomStartNode.offsetLeft - (dingflowDesign.clientWidth / 2) + 110, 0);
      }
    }, 0);
  }, []);

  return (
    <WFC.Provider value={{config, updateNode, onAddNode, onDeleteNode, onSelectNode}}>
      <section id="dingflowDesign" className={styles.dingflowDesign}>
        <ZoomLayout>
          <Render
            config={config}
          />
          <EndNode />
        </ZoomLayout>
      </section>
    </WFC.Provider>
  );
};

export default WorkFlow;
