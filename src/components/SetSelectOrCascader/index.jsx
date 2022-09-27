import React, {useRef} from 'react';
import {useBoolean} from 'ahooks';
import {Button, Space} from 'antd';
import Cascader from '@/components/Cascader';
import Select from '@/components/Select';
import TreeSelect from '@/components/TreeSelect';
import Drawer from '@/components/Drawer';


const SetSelectOrCascader = ({
  disabled,
  options,
  component,
  title,
  height,
  moduleType,
  placement,
  width,
  api,
  tableTitle,
  drawerWidth,
  ...props
}) => {

  const ref = useRef();

  const [state, {setTrue, setFalse}] = useBoolean();

  const getModule = () => {
    switch (moduleType) {
      case 'cascader':
        return <Cascader resh={state} options={options} disabled={disabled} width={width} api={api} {...props} />;
      case 'tree':
        return <TreeSelect disabled={disabled} options={options} resh={state} width={width} api={api}  {...props} />;
      default:
        return <Select resh={state} options={options} disabled={disabled} width={width} api={api} {...props} />;
    }
  };

  return (
    <Space>
      {getModule()}
      <Button onClick={() => {
        ref.current.open(false);
        setFalse();
      }}>{title || '设置分类'}</Button>
      <Drawer
        height={height}
        width={drawerWidth}
        placement={placement}
        value={false}
        component={component}
        ref={ref}
        onClose={() => {
          ref.current.close();
          setFalse();
        }}
        onSuccess={(res) => {
          ref.current.close();
          setTrue();
        }} />
    </Space>);
};

export default SetSelectOrCascader;
