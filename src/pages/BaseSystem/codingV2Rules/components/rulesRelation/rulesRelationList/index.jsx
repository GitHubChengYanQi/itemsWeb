/**
 * 编码规则和模块的对应关系列表页
 *
 * @author song
 * @Date 2021-10-25 14:05:08
 */

import React, {useRef} from 'react';
import {Checkbox, Table, Table as AntTable} from 'antd';
import Drawer from '@/components/Drawer';
import RulesRelationEdit from '../rulesRelationEdit';
import {useRequest} from '@/util/Request';
import {codingRulesList} from '@/pages/Erp/codingRules/codingRulesUrl';
import {rulesRelationAdd} from '@/pages/Erp/codingRules/components/rulesRelation/rulesRelationUrl';
import ProSkeleton from '@ant-design/pro-skeleton';

const {Column} = AntTable;

const RulesRelationList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);

  const {loading, data, refresh} = useRequest(codingRulesList);

  const {loading:addLoading,run} = useRequest(rulesRelationAdd, {
    manual: true, onSuccess: () => {
      refresh();
    }
  });

  const options = [
    {label: '工具编码', value: 1},
    {label: '质检方案编码', value: 2},
  ];

  if (loading || addLoading) {
    return (<ProSkeleton type="descriptions" />);
  }

  const dataSource = data && data.map((items, index) => {
    return {
      key: index,
      codingRulesId: items.name,
      moduleId: options.map((item, index) => {

        let checked = false;
        items.rulesRelationList.map((items,index)=>{
          if (items.moduleId === item.value){
            return checked = true;
          }else {
            return false;
          }
        });

        return (
          <Checkbox key={index} values={item.value} checked={checked} onChange={(checkedValue) => {
            run({
              data: {
                codingRulesId: items.codingRulesId,
                moduleId: checkedValue.target.values
              }
            });
          }}>{item.label}</Checkbox>
        );
      })
    };
  });

  return (
    <>
      <Table
        dataSource={dataSource}
      >
        <Column title="编码规则" dataIndex="codingRulesId" />
        <Column title="模块" dataIndex="moduleId" />

      </Table>
      <Drawer width={800} title="编辑" component={RulesRelationEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default RulesRelationList;
