import React, {useEffect, useState} from 'react';
import {getSearchParams, useHistory} from 'ice';
import {Button, Card, message, Spin, Tabs} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {isArray, isObject} from '@/util/Tools';
import {useRequest} from '@/util/Request';
import {formDetail, formEdit} from '@/pages/Form/url';
import {
  AllocationReportData,
  ComprehensiveReportData,
  inStockReportData, MaintenanceReportData, outStockReportData, StockingReportData
} from '@/pages/Form/formFileData';
import Empty from '@/components/Empty';
import {MultipleContainers} from '@/pages/Form/components/MultipleContainers/MultipleContainers';

const ReportSetting = () => {

  const searchParams = getSearchParams();

  const history = useHistory();

  const [detail, setDetail] = useState();

  const [module, setModule] = useState('inStock');

  const [loading, setLoading] = useState();

  const [filedData, setFiledData] = useState([]);

  const [config, setConfig] = useState({});

  const defaultInit = [{
    type: 'add',
    title: '',
    data: [{step: 0, line: 1, column: 0, data: []}],
  }];

  const [init, setInit] = useState(defaultInit);

  const setTable = (data = [], keys, formFiled) => {
    const column = [];
    data.forEach((rows = []) => {
      rows.forEach(item => {
        if (item.card) {
          column.push(item);
          const table = item.table || [];
          table.forEach(tableRows => {
            tableRows.forEach(item => {
              isArray(item.data).forEach(item => keys.push(item.key));
              column.push({...item, data: isArray(item.data).filter(item => formFiled.includes(item.key))});
            });
          });
        } else {
          isArray(item.data).forEach(item => keys.push(item.key));
          column.push({...item, data: isArray(item.data).filter(item => formFiled.includes(item.key))});
        }
      });
    });
    return column;
  };

  const {run: getDetail, refresh} = useRequest(formDetail, {
    manual: true,
    onSuccess: (res) => {
      const keys = [];
      let newFileData = [];
      switch (module) {
        case 'inStock':
          newFileData = inStockReportData;
          break;
        case 'outStock':
          newFileData = outStockReportData;
          break;
        case 'stocktaking':
          newFileData = StockingReportData;
          break;
        case 'curring':
          newFileData = MaintenanceReportData;
          break;
        case 'allocation':
          newFileData = AllocationReportData;
          break;
        case 'comprehensive':
          newFileData = ComprehensiveReportData;
          break;
        default:
          break;
      }
      const formFileds = newFileData.map(item => item.key);
      if (res.typeSetting) {
        const typeSetting = JSON.parse(res.typeSetting) || {};
        const moduleInfo = typeSetting[module] || {};
        const newInit = [];
        isArray(moduleInfo.steps).forEach(item => {
          newInit.push({...item, data: setTable(item.data, keys, formFileds)});
        });
        setConfig({
          width: 400,
          gutter: moduleInfo.gutter || 12,
          widthUnit: moduleInfo.widthUnit || 'px',
        });
        setInit(newInit.length === 0 ? defaultInit : newInit);
      } else {
        setInit(defaultInit);
      }
      setFiledData(newFileData.filter(item => !keys.includes(item.key)));
      setDetail(res || {});
      setLoading(false);
    }
  });

  const {loading: editlLoaing, run: edit} = useRequest(formEdit, {
    manual: true,
    onSuccess: () => {
      message.success('保存成功！');
    }
  });

  useEffect(() => {
    if (searchParams.type) {
      setLoading(true);
      getDetail({data: {formType: searchParams.type}});
    }
  }, []);

  if (!detail) {
    if (loading) {
      return <ProSkeleton />;
    }
    return <Empty />;
  }

  const tabs = [
    {label: '入库', key: 'inStock'},
    {label: '出库', key: 'outStock'},
    {label: '盘点', key: 'stocktaking'},
    {label: '养护', key: 'curring'},
    {label: '调拨', key: 'allocation'},
    {label: '综合', key: 'comprehensive'}
  ];

  return <Spin spinning={editlLoaing}>
    <Card
      bodyStyle={{padding: '0px 24px'}}
      title="统计图表配置"
      extra={<Button onClick={() => history.goBack()}>返回</Button>}
    >
      <Tabs
        centered
        activeKey={module}
        items={tabs}
        onChange={(value) => {
          setModule(value);
          setLoading(true);
          refresh();
        }}
      />
      {loading ? <ProSkeleton /> : <MultipleContainers
        report
        {...config}
        vertical
        initSteps={init}
        items={[{line: 0, column: 0, data: filedData}, ...(isObject(init[0]).data || [])]}
        onSave={(data) => {
          const typeSetting = detail.typeSetting ? JSON.parse(detail.typeSetting) : {};
          edit({data: {formType: searchParams.type, typeSetting: {...typeSetting, [module]: data}}});
        }}
      />}
    </Card>
  </Spin>;
};


export default ReportSetting;
