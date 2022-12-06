import React, {useEffect, useState} from 'react';
import {Tree} from '@alifd/next';
import {useRequest} from '@/Config/BaseRequest';
import {roleTree} from '@/Config/ApiUrl/system/role';

const TreeNode = Tree.Node;


const RoleTree = ({value, onChange, ...other}) => {

  const [checkedKeys, setCheckedKeys] = useState([]);

  const {request} = useRequest(roleTree);
  const {data} = request();

  const renderNode = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item.value} label={item.label}>
            {renderNode(item.children)}
          </TreeNode>
        );
      } else {
        return (<TreeNode label={item.label} key={item.value}/>);
      }
    });
  };

  useEffect(() => {
    if (!value || value === undefined) {
      setCheckedKeys([]);
    }else{
      setCheckedKeys(value);
    }
  }, [value]);

  return (
    <>
      {data && <Tree
        selectable={false}
        checkable
        multiple
        defaultExpandAll
        {...other}
        checkedKeys={checkedKeys}
        onCheck={(checkedKeys) => {
          setCheckedKeys([...checkedKeys]);
          typeof onChange === 'function' && onChange(checkedKeys);
          // console.log(checkedKeys);
        }}
      >
        {renderNode(data.data)}
      </Tree>}
    </>
  );
};


export default RoleTree;
