/**
 * 首页商品编辑页
 *
 * @author siqiang
 * @Date 2021-08-19 08:53:11
 */

import React, {useRef} from 'react';
import Form from '@/components/Form';
import {goodsDetail, goodsAdd, goodsEdit} from '../goodsUrl';
import * as SysField from '../goodsField';
import {Attachment, ImgUrl} from '../goodsField';

const {FormItem} = Form;

const ApiConfig = {
  view: goodsDetail,
  add: goodsAdd,
  save: goodsEdit
};

const GoodsEdit = ({...props}) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="goodId"
    >
      <FormItem label="商品名称" name="goodName" component={SysField.GoodName} required/>
      <FormItem label="商品标题" name="title" component={SysField.Title} required/>
      <FormItem label="商品副标题" name="subtitle" component={SysField.Subtitle} required/>
      <FormItem title="商品封面图片" name="imgUrl" component={SysField.ImgUrl} required/>
      <FormItem label="商品售价" name="price" component={SysField.Price} required/>
      <FormItem label="商品原价" name="lastPrice" component={SysField.LastPrice} required/>
      <FormItem label="品牌" name="brand" component={SysField.Pin} required/>
      <FormItem label="库存" name="inventoryNumber" component={SysField.Ku} required/>
      <FormItem label="销量" name="sales" component={SysField.Xiao} required/>
      <FormItem label="详情" name="details" component={SysField.Attachment}/>
    </Form>
  );
};

export default GoodsEdit;
