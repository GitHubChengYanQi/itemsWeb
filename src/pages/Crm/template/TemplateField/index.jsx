/**
 * 合同模板字段配置页
 *
 * @author
 * @Date 2021-07-21 08:22:02
 */

import React from 'react';
import {Input} from 'antd';
import Editor from '@/components/Editor';
import Select from '@/components/Select';
import {contractClassListSelect} from '@/pages/Crm/contract/components/contractClass/contractClassUrl';
import FileUpload from '@/components/FileUpload';

export const Name = (props) => {
  return (<Input   {...props} />);
};
export const Content = (props) => {
  return (<Editor module="contacts" placeholder="输入合同模板.."  {...props} />);
};

export const ContractClassId = (props) => {
  return (<Select api={contractClassListSelect} {...props} />);
};

export const Module = (props) => {
  return (<Select options={[
    {label:'入库模板',value:'inStock'},
    {label:'出库模板',value:'outStock'},
    {label:'盘点模板',value:'stocktaking'},
    {label:'养护模板',value:'curing'},
    {label:'调拨模板',value:'allocation'},
  ]} {...props} />);
};

export const UploadWord = (props) => {
  return (<FileUpload
    fileUpload
    title='上传合同'
    {...props}
    imageType={['DOCX','docx']}
    prompt='文档模板仅支持：2007以上版本.docx格式的word文档'
  />);
};
