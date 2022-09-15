import React, {useState} from 'react';
import {Divider, Menu} from 'antd';
import ListLayout from '@/layouts/ListLayout';
import QualityTable from '@/pages/Erp/qualityCheck/components/QualityTable';
import QualityPlanList from '@/pages/Erp/qualityCheck/components/qualityPlan/qualityPlanList';
import QualityTaskList from '@/pages/Erp/qualityCheck/components/qualityTask/qualityTaskList';


const QualityCheckList = () => {

  const [state, setState] = useState('1');

  const Left = () => {
    return (
      <>
        <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          onSelect={(value) => {
            setState(value.key);
          }}
          items={[{
            key: '1',
            label: '质检项',
          }, {
            key: '2',
            label: '质检方案',
          }, {
            key: '3',
            label: '质检任务',
          },]}
        />
        <Divider />
      </>);
  };

  const module = () => {
    switch (state) {
      case '1':
        return <QualityTable />;
      case '2':
        return <QualityPlanList />;
      case '3':
        return <QualityTaskList />;
      default:
        break;
    }
  };

  return (
    <ListLayout left={Left()}>
      {module()}
    </ListLayout>
  );
};
export default QualityCheckList;
