import React, {useRef, useState} from 'react';
import {getSearchParams, useHistory} from 'ice';
import {Tabs} from 'antd';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import PartsSelectSkus from '@/pages/Erp/parts/PartsEdit/components/PartsSelectSkus';
import styles from './index.module.less';
import SkuDetail from '@/pages/Erp/parts/components/SkuDetail';
import BomComparison from '@/pages/Erp/parts/components/BomComparison';
import Triangle from '@/pages/Erp/parts/components/Triangle';
import {scroll} from '@/pages/Erp/parts/components/Item';

const PartsEditV2 = () => {

  const searchParams = getSearchParams();

  const [parts, setParts] = useState([]);

  const [tabKey, setTabKey] = useState('1');

  const [skuDetail, setSkuDetail] = useState({});

  const [comparisonSku, setComparisonSku] = useState();

  const [comparisonParts, setComparisonParts] = useState([]);

  const history = useHistory();

  const searchRef = useRef();

  const scrollTo = (skuId) => {
    setTimeout(() => {
      setComparisonSku({skuId});
      scroll(`parts${skuId}`);
    }, 0);
  };

  const items = [
    {
      key: '1',
      label: '物料详情',
      children: <SkuDetail skuDetail={skuDetail} />,
    },
    {
      key: '2',
      label: '对比',
      children: <BomComparison
        onComparisonParts={setComparisonParts}
        comparisonParts={parts}
        comparisonSku={comparisonSku}
        onParts={setComparisonSku}
        addSku={(sku) => {
          if (sku) {
            setParts([...parts, sku]);
            scrollTo(sku.skuId);
          }
        }}
      />,
    },
  ];

  return <div id="partsEditId" className={styles.partsEdit}>
    <div className={styles.edit}>
      <div id="describeId" hidden={!skuDetail?.skuId} className={styles.describe}>
        <div className={styles.describeContent}>
          <Triangle />
          <Tabs activeKey={tabKey} items={items} onChange={setTabKey} />
        </div>
      </div>
      <PartsEdit
        scrollTo={scrollTo}
        onSkuDetail={setSkuDetail}
        onSeletSku={() => {
          searchRef.current.searchOpen();
        }}
        comparisonParts={tabKey === '2' ? comparisonParts : []}
        onParts={setComparisonSku}
        comparisonSku={comparisonSku}
        comparison={tabKey === '2' && comparisonParts.length > 0}
        defaultValue={{item: {skuId: searchParams.skuId || undefined}}}
        parts={parts}
        setParts={setParts}
        value={searchParams.id || false}
        onSuccess={() => {
          history.goBack();
        }}
      />
    </div>
    <div hidden={!skuDetail?.skuId} className={styles.search}>
      <PartsSelectSkus ref={searchRef} value={parts} onChange={(sku) => {
        setParts([...parts, sku]);
        scrollTo(sku.skuId);
      }} />
    </div>
  </div>;
};

export default PartsEditV2;
