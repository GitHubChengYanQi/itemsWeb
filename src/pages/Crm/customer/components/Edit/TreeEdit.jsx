import React, {useState} from 'react';
import {Button, Popover} from 'antd';
import Cascader from '@/components/Cascader';
import {crmIndustryDetail, crmIndustryTreeView} from '@/pages/Crm/crmIndustry/crmIndustryUrl';
import {useRequest} from '@/util/Request';

const TreeEdit = ({value:values, onChange,val}) => {

  const [value, setValue] = useState(values);
  const [change,setChange] = useState(val);
  const [visiable,setVisiable] = useState();

  const {run} = useRequest(crmIndustryDetail,{manual:true});


  return (
    <div style={{display:'inline-block',cursor:'pointer'}}>
      <Popover open={visiable} onOpenChange={(visible)=>{
        setVisiable(visible);
      }} placement="bottom" title={
        <Cascader api={crmIndustryTreeView} value={value} onChange={(value) => {
          setValue(value);
        }} />
      } content={<Button type="primary" style={{width: '100%'}} onClick={async () => {
        const name = await run({
          data:{
            industryId:value,
          }
        });
        setChange(name && name.industryName);
        setVisiable(false);
        onChange && typeof onChange === 'function' && onChange(value);
      }}>保存</Button>} trigger="click">
        {change || '未填写'}
      </Popover>
    </div>
  );
};

export default TreeEdit;
