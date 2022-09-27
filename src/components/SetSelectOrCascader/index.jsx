import React, {useRef} from 'react';
import {useBoolean} from 'ahooks';
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
      case 'tree':
        return <Cascader
          resh={state}
          options={options}
          disabled={disabled}
          width={width}
          api={api}
          addLabel={title || '新增'}
          onAdd={() => {
            ref.current.open(false);
            setFalse();
          }}
          {...props}
        />;
      default:
        return <Select
          resh={state}
          options={options}
          disabled={disabled}
          width="100%"
          api={api}
          addLabel={title || '新增'}
          onAdd={() => {
            ref.current.open(false);
            setFalse();
          }}
          {...props}
        />;
    }
  };

  return (
    <div>
      {getModule()}
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
        onSuccess={() => {
          ref.current.close();
          setTrue();
        }} />
    </div>);
};

export default SetSelectOrCascader;
