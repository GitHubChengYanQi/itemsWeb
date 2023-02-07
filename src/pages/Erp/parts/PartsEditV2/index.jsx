import React, {useRef, useState} from 'react';
import {getSearchParams, useHistory} from 'ice';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import {Title} from '@/components/Table';
import PartsSelectSkus from '@/pages/Erp/parts/PartsEdit/components/PartsSelectSkus';
import styles from './index.module.less';

const PartsEditV2 = () => {

  const searchParams = getSearchParams();

  const [parts, setParts] = useState([]);

  const history = useHistory();

  const searchRef = useRef();

  return <>
    <Title title={`${searchParams.id ? '编辑' : '添加'}物料清单`} />
    <div className={styles.edit}>
      <PartsEdit
        onSeletSku={() => {
          searchRef.current.searchOpen();
        }}
        defaultValue={{item: {skuId: searchParams.skuId || undefined}}}
        parts={parts}
        setParts={setParts}
        value={searchParams.id || false}
        onSuccess={() => {
          history.goBack();
        }}
      />
    </div>
    <div className={styles.search}>
      <PartsSelectSkus ref={searchRef} value={parts} onChange={(sku) => {
        setParts([...parts, sku]);
      }} />
    </div>
  </>;
};

export default PartsEditV2;
