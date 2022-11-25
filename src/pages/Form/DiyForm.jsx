import React, {useEffect, useState} from 'react';
import {getSearchParams, useHistory} from 'ice';
import {Button, Card, Drawer, message, Spin} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {CloseOutlined} from '@ant-design/icons';
import {MultipleContainers} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import {useRequest} from '@/util/Request';
import {formDetail, formEdit} from '@/pages/Form/url';
import Empty from '@/components/Empty';
import {POFormData, ProductionFormData, ProductionTaskFormData} from '@/pages/Form/formFileData';
import {isArray, isObject} from '@/util/Tools';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';
import CreateOrder from '@/pages/Order/CreateOrder';
import AddProductionPlan from '@/pages/Production/ProductionPlan/AddProductionPlan';

const DiyForm = () => {

  const searchParams = getSearchParams();

  const history = useHistory();

  const [detail, setDetail] = useState();

  const [module, setModule] = useState('pc');

  const [loading, setLoading] = useState();

  const [filedData, setFiledData] = useState([]);

  const [config, setConfig] = useState({});

  const [openPreview, setOpenPreview] = useState(false);

  const [currentStep, setCurrentStep] = useState({});

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
      const mobile = module === 'mobile';
      let newFileData = [];
      switch (searchParams.type) {
        case ReceiptsEnums.purchaseOrder:
          newFileData = POFormData;
          break;
        case ReceiptsEnums.production:
          newFileData = ProductionFormData;
          break;
        case ReceiptsEnums.productionTask:
          newFileData = ProductionTaskFormData;
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
          newInit.push({...item, data: setTable(item.data, keys,formFileds)});
        });
        setConfig({
          width: moduleInfo.width || (mobile ? 400 : 100),
          gutter: moduleInfo.gutter || (mobile ? 12 : 16),
          widthUnit: moduleInfo.widthUnit || (mobile ? 'px' : '%'),
        });
        setInit(newInit.length === 0 ? defaultInit : newInit);
      } else {
        setInit(defaultInit);
      }
      setFiledData(newFileData.filter(item => !keys.includes(item.key) && (mobile ? item.key !== 'card' : true)));
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
  let PreviewDom;
  let previewDomProps = {};

  switch (searchParams.type) {
    case ReceiptsEnums.purchaseOrder:
      title = '采购单';
      PreviewDom = CreateOrder;
      break;
    case ReceiptsEnums.production:
      title = '生产计划';
      PreviewDom = AddProductionPlan;
      previewDomProps = {
        currentStep,
        setCurrentStep
      };
      break;
    case ReceiptsEnums.productionTask:
      title = '生产任务';
      break;
    default:
      break;
  }

  return <Spin spinning={editlLoaing}>
    <Card
      title={`${title}表单配置`}
      extra={<Button onClick={() => history.goBack()}>返回</Button>}
    >
      <MultipleContainers
        {...config}
        vertical
        initSteps={init}
        items={[{line: 0, column: 0, data: filedData}, ...(isObject(init[0]).data || [])]}
        setModule={(value) => {
          setModule(value);
          setLoading(true);
          refresh();
        }}
        module={module}
        onPreview={setOpenPreview}
        onSave={(data, waitFileds) => {
          const disabledFileds = isArray(waitFileds).filter(item => item.disabled);
          if (disabledFileds.length > 0) {
            message.warn(`${disabledFileds.map(item => item.filedName).toString()}为必选字段！`);
            return;
          }
          const typeSetting = detail.typeSetting ? JSON.parse(detail.typeSetting) : {};
          edit({data: {formType: searchParams.type, typeSetting: {...typeSetting, [module]: data}}});
        }}
      />
    </Card>


    <Drawer
      destroyOnClose
      height="100%"
      placement="top"
      title={`${title}表单配置`}
      open={openPreview}
      onClose={() => setOpenPreview(null)}
      extra={<CloseOutlined style={{cursor: 'pointer'}} onClick={() => setOpenPreview(false)} />}
    >
      <div style={{textAlign: 'center'}}>
        <div style={{textAlign: 'initial',display:'inline-block'}}>
          {PreviewDom ? <PreviewDom previewData={openPreview} {...previewDomProps} /> : <Empty />}
        </div>
      </div>
    </Drawer>
  </Spin>;
};

export default DiyForm;
