const otherData = [{key: 'card', filedName: 'Card'}];

export const POFormData = [
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
  {key: 'paymentDetail', filedName: '付款信息', inputType: 'select'},
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

export const ProductionFormData = [
  ...otherData,
  {key: 'coding', filedName: '计划编码', inputType: 'input', required: true, disabled: true},
  {key: 'theme', filedName: '计划主题', inputType: 'input', required: true, disabled: true},
  {key: 'time', filedName: '执行时间', inputType: 'select'},
  {key: 'userId', filedName: '负责人', inputType: 'select'},
  {key: 'remark', filedName: '备注', inputType: 'input'},
  {key: 'orderDetailParams', filedName: '生产明细', inputType: 'select', required: true, disabled: true},
];

export const ProductionTaskFormData = [
  ...otherData,
  {key: 'coding', filedName: '生产任务编码', inputType: 'input'},
  {key: 'shipName', filedName: '工序', inputType: 'input'},
  {key: 'userId', filedName: '负责人', inputType: 'select'},
  {key: 'date', filedName: '执行时间', inputType: 'select'},
  {key: 'userIdList', filedName: '成员', inputType: 'select'},
  {key: 'number', filedName: '生产数量', inputType: 'input'},
  {key: 'remake', filedName: '备注', inputType: 'input'},
];

export const InvoiceFormData = [
  ...otherData,
  {key: 'money', filedName: '金额', inputType: 'input', required: true, disabled: true},
  {key: 'enclosureId', filedName: '附件', inputType: 'input', required: true, disabled: true},
  {key: 'name', filedName: '发票名称', inputType: 'select'},
  {key: 'InvoiceDate', filedName: '发票日期', inputType: 'date'},
  {key: 'orderId', filedName: '关联订单', inputType: 'select'},
];
