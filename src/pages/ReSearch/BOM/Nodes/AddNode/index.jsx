import React, {useState, useContext} from 'react';
import {Popover} from 'antd';
import Icon from '@/components/Icon';
import AddNodeList from '../AddNodeList';
import WFC from '../../OperatorContext';
import styles from './index.module.scss';


const AddNode = (props) => {

  const {onAddNode} = useContext(WFC);

  const [open, setOpen] = useState(false);

  function onOptionClick(type) {
    setOpen(false);
    onAddNode(type, props.pRef, props.objRef);
  }

  return (<div className={styles.addNodeBtnBox}>
    <div className="add-node-btn">
      <Popover
        open={open}
        placement="bottom"
        content={<AddNodeList
          onOptionClick={onOptionClick}
        />}
        trigger='click'
        onOpenChange={setOpen}
      >

        <div className="btn" onClick={() => {
          setOpen(true);
        }}>
          <Icon type="icon-add1" />
        </div>
      </Popover>
    </div>
  </div>);
};

export default AddNode;
