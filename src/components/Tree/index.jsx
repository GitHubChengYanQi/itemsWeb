import React from 'react';
import {Tree as AntdTree} from 'antd';
import {useRequest} from '@/util/Request';


const Tree = (props) => {
  const {
    value, onChange = () => {
    }, api, ...other
  } = props;
  if (!api) {
    throw new Error('Table component: api cannot be empty,But now it doesn\'t exist!');
  }
  const {data} = useRequest(api);

  if (data) {
    return (<AntdTree
      onCheck={(values,checkInfo) => {
        onChange(values,checkInfo.checkedNodes);
      }}
      defaultExpandedKeys={['0']}
      // selectable={false}
      checkable
      checkedKeys={value}
      treeData={data}
      {...other}
    />);
  } else {
    return null;
  }

};

export default Tree;
