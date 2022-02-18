import React, {useState} from 'react';
import {Tree} from 'antd';
import ListLayout from '@/layouts/ListLayout';
import SkuTable from '@/pages/Erp/sku/SkuTable';
import store from '@/store';


const SkuList = () => {

  const [data] = store.useModel('dataSource');

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

  const [spuClass, setSpuClass] = useState();

  const Left = () => {
    return (
      <>
        <Tree
          showLine
          onSelect={(value) => {
            setSpuClass(value);
          }}
          defaultExpandedKeys={['']}
          treeData={[
            {
              title: '所有分类',
              key: '',
              children: dataSource
            },
          ]}
        />
      </>);
  };
  return (
    <ListLayout>
      <SkuTable left={Left()} spuClass={spuClass} />
    </ListLayout>
  );
};
export default SkuList;

