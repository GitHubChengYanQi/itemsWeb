import React from 'react';
import {MenuOutlined, PlusOutlined} from '@ant-design/icons';
import styles from './index.module.less';
import {isArray} from '@/util/Tools';
import {Sortable} from '@/components/Table/components/DndKit/Sortable';
import {Handle} from '@/components/Table/components/DndKit/Item';
import Item from '@/pages/Erp/parts/components/Item';

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
  }
}) => {

  const dataSources = value;

  const itemRender = (props) => {
    const {value, item, index, ...other} = props;
    const noExist = comparison && !isArray(comparisonParts).find(comparison => comparison.skuId === item.skuId);

    return <>
      <div className={styles.listItem}>
        <div
          style={{width: 50}}
          className={index === dataSources.length - (show ? 1 : 0) ? styles.last : styles.leftBorder}
        />
        {item.add ?
          <a
            style={{padding: '12px 0'}}
            onClick={onSeletSku}
          >
            <PlusOutlined style={{fontSize: 24}} />
          </a>
          :
          <div
            style={noExist ? {color: '#174ad4'} : {}}
            className={styles.item}
          >
            <Handle hidden={show} icon={<MenuOutlined />} {...other} />
            <Item
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
          </div>}
      </div>
    </>;
  };

  return <>

    <div className={styles.checkList}>
      <div style={{left: 24.5}} className={styles.line} />
      <div style={{paddingRight: show ? 0 : 40,minHeight:isOpen ? '100vh' : 'calc(100vh - 296px)'}} className={styles.list}>
        <Sortable
          handle
          getItemStyles={() => {
            return {
              padding: 0,
              width: '100%'
            };
          }}
          definedItem={itemRender}
          items={(show ? dataSources : [...dataSources, {add: true, disabled: true}]).map((item) => {
            return {
              ...item,
              key: item.skuId || 'add',
            };
          })}
          onDragEnd={(allIems) => {
            onChange(allIems.filter(item => !item.add));
          }}
        />
      </div>
    </div>
  </>;
};

export default AddSkuTable;
