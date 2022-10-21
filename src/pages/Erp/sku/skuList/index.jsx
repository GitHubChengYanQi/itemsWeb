import React, {useState} from 'react';
import {Tree} from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import ListLayout from '@/layouts/ListLayout';
import SkuTable from '@/pages/Erp/sku/SkuTable';
import store from '@/store';


const SkuList = () => {

  const [data] = store.useModel('dataSource');

  const [state, setState] = useUrlState(
    {
      navigateMode: 'push',
    },
  );

  const defaultTableQuery = state.params && JSON.parse(state.params) || {};

  const dataResult = (items) => {
    if (!Array.isArray(items)) {
      return [];
    }
    return items.map((item) => {
      return {
        key: item.value,
        title: item.label,
        children: dataResult(item.children),
      };
    });
  };

  const dataSource = dataResult(data && data.skuClass);

  const [spuClass, setSpuClass] = useState([]);

  const defaultSpuClass = defaultTableQuery.values?.spuClass ? [defaultTableQuery.values?.spuClass] : ['0'];

  const Left = () => {
    return (
      <>
        <Tree
          showLine
          selectable
          selectedKeys={spuClass.length > 0 ? spuClass : defaultSpuClass}
          onSelect={(value) => {
            if (value.length === 0) {
              return;
            }
            setSpuClass(value);
          }}
          defaultExpandedKeys={['0']}
          treeData={[
            {
              title: '所有分类',
              key: '0',
              children: dataSource
            },
          ]}
        />
      </>);
  };
  return (
    <ListLayout>
      <SkuTable left={Left()} spuClass={spuClass[0] || null} setSpuClass={setSpuClass} />
    </ListLayout>
  );
};
export default SkuList;

