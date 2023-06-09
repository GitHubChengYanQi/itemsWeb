/**
 * 项目表接口配置
 *
 * @author cheng
 * @Date 2021-07-19 15:13:58
 */

export const businessAdd = {
  url: '/crmBusiness/add',
  method: 'POST',
  rowKey:'businessId'
};

export const businessEdit = {
  url: '/crmBusiness/edit',
  method: 'POST',
  rowKey:'businessId'
};

export const businessDelete = {
  url: '/crmBusiness/delete',
  method: 'POST',
  rowKey:'businessId'
};
export const businessBatchDelete = {
  url: '/crmBusiness/batchDelete',
  method: 'POST',
  rowKey:'businessId'
};



export const businessDetail = {
  url: '/crmBusiness/detail',
  method: 'POST',
  rowKey:'businessId'
};

export const businessList = {
  url: '/crmBusiness/list',
  method: 'POST',
  rowKey:'businessId'
};

// 项目名称

export const BusinessNameListSelect = {
  url: '/crmBusiness/listSelect',
  method: 'POST',
};
//  负责人姓名
export const UserIdSelect = {
  url: '/rest/mgr/Select',
  method: 'POST',
};

// 客户名称
export const CustomerNameListSelect = {
  url: '/customer/listSelect',
  method: 'POST',
};
// 产品名称
export const NameListSelect = {
  url: '/stock/listSelect',
  method: 'POST',
};
// 机会来源
export const OrgNameListSelect = {
  url: '/origin/listSelect',
  method: 'POST',
};
// 立项日期
export const TimeListSelect2 = {
  url: '/crmBusiness/listSelect2',
  method: 'POST',
};
// 项目金额
export const OpportunityAmountListSelect3 = {
  url: '/crmBusiness/listSelect3',
  method: 'POST',
};
// 销售流程
export const SalesIdListSelect = {
  url: '/crmBusinessSales/listSelect',
  method: 'POST',
};
// 产品合计
export const TotalProductsListSelect4 = {
  url: '/crmBusiness/listSelect4',
  method: 'POST',
};




// 主线索
export const MainCableListSelect6 = {
  url: '/crmBusiness/listSelect6',
  method: 'POST',
};

// 创建者
export const CreateUserListSelect7 = {
  url: '/crmBusiness/listSelect7',
  method: 'POST',
};
// 修改者
export const UpdateUserListSelect8 = {
  url: '/crmBusiness/listSelect8',
  method: 'POST',
};




// 阶段变更时间
export const ChangeTimeListSelect17 = {
  url: '/crmBusiness/listSelect17',
  method: 'POST',
};
// 输单原因
export const ReasonListSelect18 = {
  url: '/crmBusiness/listSelect18',
  method: 'POST',
};

// 产品明细显示
export const crmBusinessDetailedList = {
  url: '/crmBusinessDetailed/list',
  method: 'POST',
  rowKey:'id'
};
export const contractList = {
  url: '/contractDetail/list',
  method: 'POST',
  rowKey:'id'
};

// 产品明细删除
export const crmBusinessDetailedDelete = {
  url: '/crmBusinessDetailed/delete',
  method: 'POST',
  rowKey:'id'
};

// 产品明细添加
export const crmBusinessDetailedAdd = {
  url: '/crmBusinessDetailed/add',
  method: 'POST',
  rowKey:'businessId'
};

// 产品名称
export const ProductNameListSelect = {
  url: '/items/listSelect',
  method: 'POST',
};


export const crmBusinessSalesListSelect = {
  url: '/crmBusinessSales/listSelect',
  method: 'POST',
};

