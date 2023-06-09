/**
 * 竞争对手报价字段配置页
 *
 * @author
 * @Date 2021-09-06 16:08:01
 */

import React, {useRef} from 'react';
import {Button, Input,  Select as AntdSelect} from 'antd';
import * as apiUrl from '../competitorQuoteUrl';
import Select from '@/components/Select';
import {useRequest} from '@/util/Request';
import CompetitorEdit from '@/pages/Crm/competitor/competitorEdit';
import Modal from '@/components/Modal';
import InputNumber from '@/components/InputNumber';

export const CompetitorsQuote = (props) =>{
  return (<InputNumber min={0} step={10000} max={1000000000}  {...props}/>);
};

export const Competitor = (props) => {
  return (<Select width={200} api={apiUrl.competitorListSelect} {...props} />);
};

export const CompetitorId = (props) =>{
  const {competitorId} = props;
  if (competitorId){
    props.onChange(competitorId);
  }
  const ref = useRef(null);

  const {loading,data,run:getData} = useRequest(apiUrl.competitorListSelect);

  return (
    <>
      <AntdSelect disabled={competitorId} allowClear showSearch style={{width:200}} options={data || []} loading={loading} {...props}   filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}  />
      <Button type="primary" className='customerName' onClick={()=>{
        ref.current.open(false);}}>
        新增对手
      </Button>
      <Modal onSuccess={() => {
        ref.current.close();
        getData();
      }} ref={ref} title='竞争对手' component={CompetitorEdit} width={1300} position={(res)=>{
        props.onChange(res && res.data && res.data.competitorId);
      }}/>
    </>
  );
};

export const QuoteStatus = (props) =>{
  return (<AntdSelect options={[{label:'无需审批',value:0},{label:'待询价',value:1},{label:'询价中',value:2}]} {...props}/>);
};
export const CampType = (props) =>{
  return (<AntdSelect options={[{label:'我的报价',value:0},{label:'对手报价',value:1}]} {...props}/>);
};
export const BusinessId = (props) =>{
  const {businessId} = props;
  if (businessId){
    props.onChange(businessId);
  }
  return (<Select disabled={businessId} api={apiUrl.BusinessNameListSelect}  {...props}/>);
};
export const QuoteType = (props) =>{
  return (<Input  {...props}/>);
};
export const QuoteDate = (props) =>{
  return (<Input  {...props}/>);
};
