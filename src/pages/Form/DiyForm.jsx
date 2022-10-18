import React, {useEffect, useState} from 'react';
import {getSearchParams} from 'ice';
import {Card} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {MultipleContainers} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import {useRequest} from '@/util/Request';
import {formDetail, formEdit} from '@/pages/Form/url';
import Empty from '@/components/Empty';

const DiyForm = () => {

  const searchParams = getSearchParams();

  const [detail, setDetail] = useState();

  const {loading: detailLoaidng, run: getDetail} = useRequest(formDetail, {
    manual: true,
    onSuccess: (res) => {
      setDetail(res);
      console.log(res);
    }
  });

  const {loading: editlLoaidng, run: edit} = useRequest(formEdit, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
    }
  });

  useEffect(() => {
    if (searchParams.id) {
      getDetail({data: {styleId: searchParams.id}});
    }
  }, []);

  if (detailLoaidng) {
    return <ProSkeleton />;
  }

  if (!detail) {
    return <Empty />;
  }

  let data;
  let title = '';

  const otherData = [{key: 'card', filedName: 'Card'}];

  switch (detail.formType) {
    case 'PO':
      title = '采购单';
      data = [
        ...otherData,
        {key: 'coding', filedName: '采购单编号', inputType: 'input'},
        {key: 'date', filedName: '采购日期', inputType: 'date'},
        {key: 'currency', filedName: '币种', inputType: 'select'},
        {key: 'remark', filedName: '采购单备注', inputType: 'input'},
        {key: 'buyerId', filedName: '甲方公司名称', inputType: 'select'},
        {key: 'partyAAdressId', filedName: '甲方公司地址', inputType: 'select'},
        {key: 'partyAContactsId', filedName: '甲方委托代理', inputType: 'select'},
        {key: 'partyAPhone', filedName: '甲方联系电话', inputType: 'select'},
        {key: 'partyABankId', filedName: '甲方开户银行', inputType: 'select'},
        {key: 'partyABankAccount', filedName: '甲方开户账号', inputType: 'select'},
        {key: 'partyALegalPerson', filedName: '甲方法定代表人', inputType: 'show'},
        {key: 'partyABankNo', filedName: '甲方开户行号', inputType: 'show'},
        {key: 'partyACompanyPhone', filedName: '甲方公司电话', inputType: 'show'},
        {key: 'partyAFax', filedName: '甲方公司传真', inputType: 'show'},
        {key: 'partyAZipCode', filedName: '甲方邮政编码', inputType: 'show'},
        {key: 'sellerId', filedName: '乙方公司名称', inputType: 'select'},
        {key: 'partyBAdressId', filedName: '乙方公司地址', inputType: 'select'},
        {key: 'partyBContactsId', filedName: '乙方委托代理', inputType: 'select'},
        {key: 'partyBPhone', filedName: '乙方联系电话', inputType: 'select'},
        {key: 'partyBBankId', filedName: '乙方开户银行', inputType: 'select'},
        {key: 'partyBBankAccount', filedName: '乙方开户账号', inputType: 'select'},
        {key: 'partyBLegalPerson', filedName: '乙方法定代表人', inputType: 'show'},
        {key: 'partyBBankNo', filedName: '乙方开户行号', inputType: 'show'},
        {key: 'partyBCompanyPhone', filedName: '乙方公司电话', inputType: 'show'},
        {key: 'partyBFax', filedName: '乙方公司传真', inputType: 'show'},
        {key: 'partyBZipCode', filedName: '乙方邮政编码', inputType: 'show'},
        {key: 'detailParams', filedName: '采购物料', inputType: 'select'},
        {key: 'paperType', filedName: '票据类型', inputType: 'select'},
        {key: 'rate', filedName: '税率(%)', inputType: 'input'},
        {key: 'money', filedName: '采购总价', inputType: 'input'},
        {key: 'floatingAmount', filedName: '浮动金额', inputType: 'input'},
        {key: 'totalAmount', filedName: '总金额', inputType: 'input'},
        {key: 'freight', filedName: '是否含运费', inputType: 'radio'},
        {key: 'payMethod', filedName: '结算方式', inputType: 'input'},
        {key: 'payPlan', filedName: '付款计划', inputType: 'select'},
        {key: 'paymentRemark', filedName: '财务备注', inputType: 'select'},
        {key: 'deliveryWay', filedName: '交货方式', inputType: 'input'},
        {key: 'adressId', filedName: '交货地址', inputType: 'select'},
        {key: 'userId', filedName: '收货人', inputType: 'select'},
        {key: 'leadTime', filedName: '交货期(天)', inputType: 'input'},
        {key: 'deliveryDate', filedName: '交货日期', inputType: 'date'},
        {key: 'generateContract', filedName: '是否需要合同', inputType: 'radio'},
        {key: 'fileId', filedName: '上传合同', inputType: 'upload'},
        {key: 'templateId', filedName: '合同模板', inputType: 'select'},
        {key: 'contractCoding', filedName: '合同编码', inputType: 'input'},
        {key: 'labelResults', filedName: '合同模板中的其他字段', inputType: 'input'},
        {key: 'note', filedName: '其他约定项', inputType: 'input'},
      ];
      break;
    default:
      data = [
        ...otherData,
        {key: 'spuClass', filedName: '物料分类', inputType: 'input'},
        {key: 'standard', filedName: '物料编码', inputType: 'input'},
        {key: 'spu', filedName: '产品名称', inputType: 'input'},
        {key: 'spuCoding', filedName: '产品码', inputType: 'input'},
        {key: 'unitId', filedName: '单位', inputType: 'select'},
        {key: 'batch', filedName: '二维码生成方式', inputType: 'radio'},
        {key: 'specifications', filedName: '规格', inputType: 'input'},
        {key: 'maintenancePeriod', filedName: '养护周期', inputType: 'input'},
        {key: 'sku', filedName: '物料描述', inputType: 'input'},
        {key: 'brandIds', filedName: '品牌', inputType: 'select'},
        {key: 'images', filedName: '图片', inputType: 'upload'},
        {key: 'drawing', filedName: '图纸', inputType: 'upload'},
        {key: 'fileId', filedName: '附件', inputType: 'upload'},
        {key: 'model', filedName: '型号', inputType: 'input'},
        {key: 'nationalStandard', filedName: '国家标准', inputType: 'input'},
        {key: 'partNo', filedName: '零件号', inputType: 'input'},
        {key: 'materialId', filedName: '材质', inputType: 'input'},
        {key: 'weight', filedName: '重量', inputType: 'input'},
        {key: 'skuSize', filedName: '尺寸', inputType: 'input'},
        {key: 'color', filedName: '表色', inputType: 'input'},
        {key: 'level', filedName: '级别', inputType: 'input'},
        {key: 'heatTreatment', filedName: '热处理', inputType: 'input'},
        {key: 'packaging', filedName: '包装方式', inputType: 'input'},
        {key: 'viewFrame', filedName: '图幅', inputType: 'input'},
        {key: 'remarks', filedName: '备注', inputType: 'input'},
      ];
      break;
  }

  return <Card title={`${title}表单配置`}>
    <MultipleContainers
      vertical
      items={[{line: 0, column: 0, data}, {step: 0, line: 1, column: 0, data: []}]}
      onSave={(data) => {
        edit({data: {styleId: searchParams.id, typeSetting: data}});
      }}
    />
  </Card>;
};

export default DiyForm;
