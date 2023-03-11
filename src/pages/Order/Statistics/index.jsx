import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Table} from 'antd';
import moment from 'moment';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.less';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import {useRequest} from '@/util/Request';
import {orderViewOrderDetail} from '@/pages/Order/url';

const Statistics = () => {

  const [year, setYear] = useState(moment().year());

  const {loading, run, data = []} = useRequest(orderViewOrderDetail, {
    manual: true
  });

  let totalPrice = 0;
  let sellerCount = 0;
  let purchaseNumber = 0;

  data.forEach(item => {
    totalPrice += item.totalPrice;
    sellerCount += item.sellerCount;
    purchaseNumber += item.purchaseNumber;
  });

  const columns = [
    {title: '出账月份', dataIndex: 'month', align: 'center', width: 100},
    {
      title: '采购总金额', dataIndex: 'totalPrice', align: 'right', render(text) {
        return <div>
          ¥
          <ThousandsSeparator
            value={text}
          />
        </div>;
      }
    },
    {title: '采购供应商数', dataIndex: 'sellerCount', align: 'right',},
    {title: '采购物料种类', dataIndex: 'skuCount', align: 'right',},
    {title: '采购物料总数', dataIndex: 'purchaseNumber', align: 'right',},
    // {
    //   title: '操作', width: 100, dataIndex: 'month', align: 'center', render(value) {
    //     return <Button type="link" onClick={() => {
    //       console.log(value, moment(value).format('YYYY-MM-DD hh:mm:ss'));
    //     }}>查看订单</Button>;
    //   },
    // },
  ];

  useEffect(() => {
    run({
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
          return <div className={styles.total}>
            总金额：
            <span className={styles.number}>
              <ThousandsSeparator
                className={styles.money}
                value={totalPrice}
              />
            </span>

            供应商总数： <span className={styles.number}>{sellerCount}</span>

            物料总数：<span className={styles.number}>{purchaseNumber}</span>
          </div>;
        }}
      />
    </div>

  </>;
};

export default Statistics;
