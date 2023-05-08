import React, {useRef} from 'react';
import {Input, Radio as AntRadio} from 'antd';
import {menuAdd, menuSave, menuTree, menuView} from '@/Config/ApiUrl/system/menu';
import Form from '@/components/Form';
import Cascader from '@/components/Cascader';
import Radio from '@/components/Radio';
import {dictRadioByCode} from '@/Config/ApiUrl/system/dict';

const {FormItem} = Form;

const ApiConfig = {
  view: menuView,
  add: menuAdd,
  save: menuSave
};

const MenuEdit = ({...props}) => {

  const formRef = useRef(null);

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="menuId"
      onError={() => {
      }}
      onSubmit={(values) => {
        if (Array.isArray(values.pids) && values.pids.length > 0) {
          values.pid = values.pids[values.pids.length - 1];
        } else {
          values.pid = values.pids;
        }
        return values;
      }}
    >
      <FormItem label="名称" required name="name" component={Input} />
      <FormItem label="分类" required name="systemType" component={Radio} api={dictRadioByCode} options={{
        defaultParams: {
          data: {
            dictTypeCode: 'SYSTEM_TYPE'
          }
        }
      }} />
      <FormItem label="编码" required name="code" component={Input} />
      <FormItem label="上级" required name="pids" component={Cascader} allowClear={false} api={menuTree} />
      <FormItem
        label="菜单"
        name="menuFlag"
        initialValue='N'
        component={AntRadio.Group}
        options={[{label: '是', value: 'Y'}, {label: '否', value: 'N'}]}
      />
      <FormItem
        label="移动端菜单"
        name="type"
        initialValue='0'
        component={AntRadio.Group}
        options={[{label: '是', value: '1'}, {label: '否', value: '0'}]}
      />
      <FormItem
        label="小程序菜单"
        name="miniapp"
        initialValue={0}
        component={AntRadio.Group}
        options={[{label: '是', value: 2}, {label: '否', value: 0}]}
      />
      <FormItem label="图标" name="icon" component={Input} />
      <FormItem label="请求地址" required name="url" component={Input} />
      <FormItem label="排序" name="sort" component={Input} />
    </Form>
  );
};

export default MenuEdit;
