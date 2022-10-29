import React, {useEffect, useState} from 'react';
import {getSearchParams, useHistory} from 'ice';
import {Button, Card, message, Spin} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {MultipleContainers} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import {useRequest} from '@/util/Request';
import {formDetail, formEdit} from '@/pages/Form/url';
import Empty from '@/components/Empty';
import {POFormData} from '@/pages/Form/formFileData';
import {isArray, isObject} from '@/util/Tools';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';

const DiyForm = () => {

  const searchParams = getSearchParams();

  const history = useHistory();

  const [detail, setDetail] = useState();

  const [initItems, setInitItems] = useState([]);

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

  const {loading: detailLoaidng, run: getDetail} = useRequest(formDetail, {
    manual: true,
    onSuccess: (res) => {
      const keys = [];
      if (res.typeSetting) {
        const typeSetting = JSON.parse(res.typeSetting) || {};
        const newInit = [];
        isArray(typeSetting.steps).forEach(item => {
          newInit.push({...item, data: setTable(item.data, keys)});
        });
        setConfig({width: typeSetting.width, gutter: typeSetting.gutter, widthUnit: typeSetting.widthUnit});
        setInit(newInit);
      }
      let newFileData = [];
      let data = [];
      switch (res.formType) {
        case ReceiptsEnums.purchaseOrder:
          data = POFormData;
          newFileData = POFormData.filter(item => !keys.includes(item.key));
          break;
        default:
          break;
      }
      setInitItems([{line: 0, column: 0, data}, {step: 0, line: 1, column: 0, data: []}]);
      setFiledData(newFileData);
      setDetail(res);
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
      getDetail({data: {formType: searchParams.type}});
    }
  }, []);

  if (detailLoaidng) {
    return <ProSkeleton />;
  }

  if (!detail) {
    return <Empty />;
  }

  let title = '';

  switch (detail.formType) {
    case ReceiptsEnums.purchaseOrder:
      title = '采购单';
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
        onSave={(data) => {
          edit({data: {formType: searchParams.type, typeSetting: data}});
        }}
      />
    </Card>
  </Spin>;
};

export default DiyForm;
