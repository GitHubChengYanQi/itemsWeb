import React, {useState} from 'react';
import {MenuOutlined, PlusOutlined} from '@ant-design/icons';
import {Input, message} from 'antd';
import styles from './index.module.less';
import {isArray, queryString} from '@/util/Tools';
import {Sortable} from '@/components/Table/components/DndKit/Sortable';
import {Handle} from '@/components/Table/components/DndKit/Item';
import Item, {scroll} from '@/pages/Erp/parts/components/Item';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';
import {getSearchParams} from 'ice';

const AddSkuTable = ({
  isOpen,
  onParts,
  comparisonSku,
  comparison,
  comparisonParts = [],
  value = [],
  onChange = () => {
  },
  show,
  openNewEdit = () => {
  },
  onSeletSku = () => {
  },
  addSku = () => {
  },
}) => {

  const [searchValue, setSearchValue] = useState('');

  const dataSources = value;

  const searchParams = getSearchParams();

  const readOnly = searchParams.type === 'show';

  let items = [];

  if (show) {
    items = [{search: true, disabled: true}, ...dataSources];
  } else {
    items = [{search: true, disabled: true}, ...dataSources, {add: true, disabled: true}];
  }

  const render = ({value, item, index, ...other}) => {
    const noExist = comparison && !isArray(comparisonParts).find(comparison => comparison.skuId === item.skuId);
    if (item.add) {
      return <a
        style={{padding: '12px 0'}}
        onClick={onSeletSku}
      >
        <PlusOutlined style={{fontSize: 24}} />
      </a>;
    } else if (item.search) {
      return <Input.Search
        value={searchValue}
        style={{width: '90%'}}
        onChange={({target: {value}}) => {
          setSearchValue(value);
        }}
        onSearch={(value) => {
          const searchSku = dataSources.filter(item => {
            return queryString(value, item.standard + SkuRender(item));
          });
          if (searchSku.length > 0) {
            scroll(`${show ? 'comparison' : 'parts'}${searchSku[0].skuId}`);
            onParts(searchSku[0]);
          } else {
            message.warn('未查询到物料');
          }

        }}
      />;
    } else {
      return <div
        style={noExist ? {color: '#174ad4'} : {}}
        className={styles.item}
      >
        <Handle hidden={show || readOnly} icon={<MenuOutlined />} {...other} />
        <Item
          readOnly={readOnly}
          searchValue={searchValue}
          isDragging={item.isDragging}
          index={index}
          item={item}
          comparison={comparison}
          comparisonSku={comparisonSku}
          addSku={addSku}
          openNewEdit={openNewEdit}
          onChange={onChange}
          show={show}
          dataSources={dataSources}
          noExist={noExist}
          onParts={onParts}
        />
      </div>;
    }
  };

  const itemRender = (props) => {
    const {index} = props;

    return <>
      <div className={styles.listItem}>
        <div
          style={{width: 50}}
          className={index === items.length - 1 ? styles.last : styles.leftBorder}
        />
        {render(props)}
      </div>
    </>;
  };

  return <>

    <div className={styles.checkList}>
      <div style={{left: 24.5}} className={styles.line} />
      <div
        style={{paddingRight: show ? 0 : 40, minHeight: isOpen ? '100vh' : 'calc(100vh - 296px)'}}
        className={styles.list}
      >
        <Sortable
          handle
          getItemStyles={() => {
            return {
              padding: 0,
              width: '100%'
            };
          }}
          definedItem={itemRender}
          items={items.map((item) => {
            return {
              ...item,
              key: item.skuId || 'add',
            };
          })}
          onDragEnd={(allIems) => {
            onChange(allIems.filter(item => !item.add && !item.search));
          }}
        />
      </div>
    </div>
  </>;
};

export default AddSkuTable;
