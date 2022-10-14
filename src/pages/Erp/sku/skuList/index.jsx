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

  const [spuClass, setSpuClass] = useState([]);

  const Left = () => {
    return (
      <>
        <Tree
          showLine
          selectable
          selectedKeys={spuClass}
          onSelect={(value) => {
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

