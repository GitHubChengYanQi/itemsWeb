import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Spin, Table} from 'antd';
import moment from 'moment';
import {useHistory} from 'ice';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.less';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import {useRequest} from '@/util/Request';
import {orderView, orderViewOrderDetail} from '@/pages/Order/url';

const Statistics = () => {

  const history = useHistory();

  const [year, setYear] = useState(moment().year());

  const {loading, run, data = []} = useRequest(orderViewOrderDetail, {
    manual: true
  });

  const {loading: viewLoading, run: viewRun, data: viewData = {}} = useRequest(orderView, {
    manual: true
  });


  const columns = [
    {title: '出账月份', dataIndex: 'month', align: 'left'},
    {
      title: '采购总金额', width: 150, dataIndex: 'totalPrice', align: 'right', render(text) {
        return <div>
          <ThousandsSeparator
            prefix="¥"
            value={text}
          />
        </div>;
      }
    },
    {
      title: '付款金额', width: 150, dataIndex: 'paymentPrice', align: 'right', render(text) {
        return <div>
          <ThousandsSeparator
            prefix="¥"
            valueStyle={{color: '#52c41a'}}
            value={text}
          />
        </div>;
      }
    },
    {
      title: '未付金额', width: 150, dataIndex: 'deficientPrice', align: 'right', render(text) {
        return <div>
          <ThousandsSeparator
            prefix="¥"
            valueStyle={{color: 'red'}}
            value={text}
          />
        </div>;
      }
    },
    {title: '采购供应商数', width: 120, dataIndex: 'sellerCount', align: 'right',},
    {title: '采购物料种类', width: 120, dataIndex: 'skuCount', align: 'right',},
    {title: '采购物料总数', width: 120, dataIndex: 'purchaseNumber', align: 'right',},
    {title: '入库总数', width: 120, dataIndex: 'inStockCount', align: 'right'},
    {
      title: '入库百分比', width: 120, dataIndex: 'inStockRate', align: 'right', render(text) {
        return `${text}%`;
      }
    },
    {},
    {
      title: '操作', width: 100, dataIndex: 'month', align: 'center', render(value) {
        return <Button type="link" onClick={() => {
          history.push({
            pathname: '/purchase/order',
            state: {
              startTime: moment(value).format('YYYY-MM-DD'),
              endTime: moment(value).endOf('month').format('YYYY-MM-DD 23:59:59')
            }
          });
        }}>查看订单</Button>;
      },
    },
  ];

  useEffect(() => {
    run({
      data: {
        year
      }
    });
    viewRun({
      data: {
        year
      }
    });
  }, []);

  return <>
    <div className={styles.header}>
      <Breadcrumb title="采购单统计" />
    </div>
    <div className={styles.screen}>
      选择年份：
      <DatePicker
        value={moment().year(year)}
        picker="year"
        onChange={(value, dataString) => {
          run({
            data: {
              year: dataString
            }
          });
          viewRun({
            data: {
              year: dataString
            }
          });
          setYear(dataString);
        }} />
    </div>
    <div className={styles.table}>
      <Table
        bordered
        dataSource={data}
        pagination={false}
        loading={loading}
        columns={columns}
        rowKey="month"
        rowClassName={(record, index) => {
          return index % 2 !== 0 ? styles.record : '';
        }}
        footer={() => {
          return viewLoading ? <Spin /> : <div className={styles.total}>
            总金额：
            <span className={styles.number}>
              <ThousandsSeparator
                prefix="¥"
                shopNumber
                valueStyle={{color: '#257bde'}}
                value={viewData.totalPrice}
              />
            </span>

            付款金额：
            <span className={styles.number}>
              <ThousandsSeparator
                prefix="¥"
                shopNumber
                valueStyle={{color: '#52c41a'}}
                value={viewData.paymentPrice}
              />
            </span>

            未付金额：
            <span className={styles.number}>
              <ThousandsSeparator
                shopNumber
                valueStyle={{color: 'red'}}
                prefix="¥"
                value={viewData.deficientPrice}
              />
            </span>

            <br />

            供应商总数： <span className={styles.number}>{viewData.sellerCount || 0}</span>

            物料种类： <span className={styles.number}>{viewData.skuCount || 0}</span>

            物料总数：<span className={styles.number}>{viewData.purchaseNumber || 0}</span>

            入库总数：<span className={styles.number}>{viewData.inStockCount || 0}</span>

            入库进度：<span className={styles.number}>{viewData.inStockRate || 0} %</span>
          </div>;
        }}
      />
    </div>

  </>;
};

export default Statistics;
