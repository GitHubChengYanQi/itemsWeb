import React, {useEffect, useState} from 'react';
import {getSearchParams, useHistory} from 'ice';
import {Button, Card, message, Spin} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {MultipleContainers} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import {useRequest} from '@/util/Request';
import {formDetail, formEdit} from '@/pages/Form/url';
import Empty from '@/components/Empty';
import {POFormData, ProductionFormData} from '@/pages/Form/formFileData';
import {isArray, isObject} from '@/util/Tools';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';

const DiyForm = () => {

  const searchParams = getSearchParams();

  const history = useHistory();

  const [detail, setDetail] = useState();

  const [initItems, setInitItems] = useState([]);

  const [module, setModule] = useState('pc');

  const [loading, setLoading] = useState();

  const [filedData, setFiledData] = useState([]);

  const [config, setConfig] = useState({});

  const [init, setInit] = useState([{type: 'add', title: '', data: [{step: 0, line: 1, column: 0, data: []}],}]);

  const setTable = (data = [], keys) => {
    const column = [];
    data.forEach((rows = []) => {
      rows.forEach(item => {
        if (item.card) {
          column.push(item);
          const table = item.table || [];
          table.forEach(tableRows => {
            tableRows.forEach(item => {
              isArray(item.data).forEach(item => keys.push(item.key));
              column.push(item);
            });
          });
        } else {
          isArray(item.data).forEach(item => keys.push(item.key));
          column.push(item);
        }
      });
    });
    return column;
  };

  const {run: getDetail, refresh} = useRequest(formDetail, {
    manual: true,
    onSuccess: (res) => {
      const keys = [];
      const mobile = module === 'mobile';
      if (res.typeSetting) {
        const typeSetting = JSON.parse(res.typeSetting) || {};
        const moduleInfo = typeSetting[module] || {};
        const newInit = [];
        isArray(moduleInfo.steps).forEach(item => {
          newInit.push({...item, data: setTable(item.data, keys)});
        });
        setConfig({
          width: moduleInfo.width || (mobile ? 400 : 100),
          gutter: moduleInfo.gutter || (mobile ? 12 : 16),
          widthUnit: moduleInfo.widthUnit || (mobile ? 'px' : '%'),
        });
        setInit(newInit);
      }
      let newFileData = [];
      let data = [];
      switch (searchParams.type) {
        case ReceiptsEnums.purchaseOrder:
          data = POFormData;
          newFileData = POFormData.filter(item => !keys.includes(item.key) && (mobile ? item.key !== 'card' : true));
          break;
        case ReceiptsEnums.production:
          data = ProductionFormData;
          newFileData = ProductionFormData.filter(item => !keys.includes(item.key) && (mobile ? item.key !== 'card' : true));
          break;
        default:
          break;
      }
      setInitItems([{line: 0, column: 0, data}, {step: 0, line: 1, column: 0, data: []}]);
      setFiledData(newFileData);
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

  if (loading) {
    return <ProSkeleton />;
  }

  if (!detail) {
    return <Empty />;
  }

  let title = '';

  switch (searchParams.type) {
    case ReceiptsEnums.purchaseOrder:
      title = '采购单';
      break;
    case ReceiptsEnums.production:
      title = '生产计划';
      break;
    default:
      break;
  }

  return <Spin spinning={editlLoaing}>
    <Card title={`${title}表单配置`} extra={<Button onClick={() => history.goBack()}>返回</Button>}>
      <MultipleContainers
        {...config}
        vertical
        initSteps={init}
        items={[{line: 0, column: 0, data: filedData}, ...(isObject(init[0]).data || [])]}
        initItems={initItems}
        setModule={(value) => {
          setModule(value);
          setLoading(true);
          refresh();
        }}
        module={module}
        onSave={(data) => {
          const typeSetting = detail.typeSetting ? JSON.parse(detail.typeSetting) : {};
          edit({data: {formType: searchParams.type, typeSetting: {...typeSetting, [module]: data}}});
        }}
      />
    </Card>
  </Spin>;
};

export default DiyForm;
