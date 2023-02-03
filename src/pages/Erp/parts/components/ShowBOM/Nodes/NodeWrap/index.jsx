import React from 'react';
import {NodeTypes} from '../Constants';
import AddNode from '../AddNode';
import styles from './index.module.scss';

function NodeWrap(props) {

  return (
    <div id={props.domId}>
      <div className={styles.nodeWrap}>
        <div className={'node-wrap-box ' + (props.type === NodeTypes.START ? 'start-node' : '')}>
          <div className="title" style={props.titleStyle}>
            {props.title}
          </div>
          <div className="content" onClick={props.onContentClick}>
            {props.children}
          </div>
        </div>
        <AddNode objRef={props.objRef} />
      </div>
    </div>
  );
}

export default NodeWrap;
