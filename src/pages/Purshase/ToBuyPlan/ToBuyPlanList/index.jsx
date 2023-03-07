import React, {useRef, useState} from 'react';
import {Button, Input, Popover, Space, Spin, Table, Tabs} from 'antd';
import {useHistory} from 'ice';
import {
  orderDetailHistoryList,
  purchaseListNoPageList,
  supplyListByPurchase
} from '@/pages/Purshase/ToBuyPlan/Url';
import Render from '@/components/Render';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';
import {useRequest} from '@/util/Request';
import Note from '@/components/Note';
import Icon from '@/components/Icon';
import {isArray} from '@/util/Tools';
import styles from './index.module.less';

const {FormItem} = Form;

const ToBuyPlanList = () => {

  const history = useHistory();

  const [skus, setSkus] = useState([]);

  const [customerId, setCustomerId] = useState();

  const {loading, data: supplys = []} = useRequest(supplyListByPurchase);
  const {loading: listLoading, data: dataSource = [], run: getList} = useRequest(purchaseListNoPageList);

  const {loading: historyLoaidng, run: getHistory} = useRequest(orderDetailHistoryList, {
    manual: true,
    onSuccess(res) {
      // console.log(res);
      // return;
      let money = 0;
      const detailParams = skus.map(item => {
        const skuHistory = isArray(res).find(historyItem => historyItem.skuId === item.skuId && (item.brandId ? item.brandId === historyItem.brandId : true)) || {};
        const onePrice = (skuHistory.onePrice || 0) / 100;
        money += onePrice * item.number;
        return {
          ...item.skuResult,
          brandId: item.brandId || skuHistory.brandId,
          preordeNumber: item.number,
          purchaseNumber: item.number,
          unitId: item.skuResult.unitId,
          onePrice,
          totalPrice: onePrice * item.number,
          remark: skuHistory.remark
        };
      });
      history.push({
        pathname: '/purchase/order/createOrder',
        search: '?module=PO',
        state: {
          sellerId: customerId,
          purchaseListIds: skus.map(item => item.purchaseListId),
          money,
          detailParams
        }
      });
    }
  });

  const columns = [
    {
      title: '物料',
      dataIndex: 'skuResult',
      render(text, record) {
        const customers = [];
        isArray(record.bindCustomerResultList).forEach(item => {
          if (!customers.find(customerItem => customerItem.customerId === item.customerId)) {
            customers.push(item);
          }
        });
        const supplyNum = customers.length;
        return <Render>
          <Space>
            <Note width={200}>{SkuRender(text)}</Note>
            <Popover content={customers.map((item, index) => {
              return <div key={index}>
                {item.customerName}
              </div>;
            })} title="已绑定供应商">
              <Button hidden={supplyNum <= 1} danger type="link">
                <Icon type="icon-gonghuoshangguanli" />
                X {supplyNum}
              </Button>
            </Popover>
          </Space>
        </Render>;
      }
    },
    {
      title: '预购数量',
      dataIndex: 'number',
      render(text) {
        return <Render text={text || '0'} />;
      }
    },
    {
      title: '品牌',
      dataIndex: 'brandResult',
      render(brandResult) {
        return <Render text={brandResult.brandName || '任意品牌'} />;
      }
    },
    {
      title: '供应商',
      dataIndex: 'customerResult',
      render(customerResult) {
        return <Render text={customerResult.customerName || '任意供应商'} />;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
  ];

  const actions = () => {
    return loading ? <Spin /> : <div>
      <Tabs
        tabBarExtraContent={<Button
          loading={historyLoaidng}
          disabled={!customerId || skus.length === 0}
          type="primary"
          onClick={() => {
            getHistory({
              data: {
                historyParam: skus.map(item => ({
                  skuId: item.skuId,
                  customerId,
                  brandId: item.brandId || null
                }))
              }
            });
          }}>创建采购单</Button>}
        items={[
          {label: '全部供应商', key: 'all'},
          ...supplys.map(item => ({
            label: item.customerResult?.customerName, key: item.customerId
          }))
        ]}
        onTabClick={(key) => {
          setSkus([]);
          const id = key === 'all' ? null : key;
          setCustomerId(id);
          getList({
            data: {
              customerId: id,
            }
          });
        }}
      />

    </div>;
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="物料" placeholder="搜索物料信息" name="name" component={Input} />
        <div hidden>
          <FormItem name="customerId" component={Input} />
        </div>
      </>
    );
  };

  return <div>
    <div className={styles.title}>
      <Breadcrumb title="预购管理" />
    </div>
    <div className={styles.supplys}>
      {actions()}
      <Table
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: skus.map(item => item.purchaseListId),
          onChange(keys, rows) {
            setSkus(rows);
          }
        }}
        loading={listLoading}
        pagination={false}
        dataSource={dataSource}
        rowKey="purchaseListId"
        columns={columns}
      />
    </div>
  </div>;
};

export default ToBuyPlanList;
