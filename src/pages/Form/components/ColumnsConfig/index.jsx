import React, {useState} from 'react';
import {Input, Typography} from 'antd';
import {SortableContext} from '@dnd-kit/sortable';
import {DroppableContainer, SortableItem} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import TableConfig from '@/pages/Form/components/TableConfig';
import {isArray, queryString} from '@/util/Tools';

const ColumnsConfig = (
  {
    activeId,
    table,
    card,
    cardTable,
    ulStyle,

    fixedFileds,
    containerId,

    handleAddColumn,
    handleAddRow,
    line,
    column,
    items,
    item,
    columns,
    containerStyle,
    handleRemove,
    configChange = () => {
    },
    gutter,
    itemChange = () => {
    },
    mobile,
    onUp = () => {
    },
    onDown = () => {
    },
    handleRemoveRow,
    handleRemoveColumn,
    id
  }) => {

  const [searchValue, setSearchValue] = useState('');

  const columnsData = isArray(columns[containerId].data);

  return <DroppableContainer
    columns={fixedFileds ? 1 : columns.length}
    ulStyle={card ? {padding: '24px 0', gridGap: 0} : ulStyle}
    removeRowHidden={fixedFileds || containerId !== 0 || table.length === 1}
    removeColumnHidden={fixedFileds || (table.length === 1 && table[0].length === 1)}
    leftTopHidden={fixedFileds || containerId !== 0}
    leftBottomHidden={fixedFileds || containerId !== 0}
    topLeftHidden={fixedFileds || mobile}
    topRightHidden={fixedFileds || mobile}
    onRemoveColumn={() => {
      handleRemoveColumn(line, column, cardTable, item);
    }}
    onRemoveRow={() => {
      handleRemoveRow(line, cardTable, item);
    }}
    onLeftTop={() => {
      handleAddRow(line, cardTable, item);
    }}
    onLeftBottom={() => {
      handleAddRow(line + 1, cardTable, item);
    }}
    onTopLeft={() => {
      handleAddColumn(line, column, cardTable, item);
    }}
    onTopRight={() => {
      handleAddColumn(line, column + 1, cardTable, item);
    }}
    noNandle
    key={id}
    id={id}
    disabled={card || (!fixedFileds && columnsData.length === 1 && activeId !== columnsData[0].key)}
    label={fixedFileds ? '待选字段' : (card && <>
      <Typography.Paragraph
        style={{margin: 0}}
        editable={{
          tooltip: '点击自定义字段名',
          onChange: (filedName) => {
            configChange({title: filedName}, line, column);
          },
        }}
      >
        {item.title || '无标题'}
      </Typography.Paragraph>
    </>)}
    items={columnsData.map(item => item.key)}
    style={(fixedFileds || mobile) ? {border: 'none'} : containerStyle}
    onRemove={fixedFileds ? undefined : () => handleRemove(line, column)}
  >
    {fixedFileds && <Input placeholder="搜索字段" onChange={({target: {value}}) => setSearchValue(value)} />}
    {!card ? <SortableContext items={columnsData.map(item => item.key)}>
      {(fixedFileds ? columnsData.filter(item => queryString(searchValue, item.filedName)) : columnsData).map((item, index) => {
        return <SortableItem
          fixedFileds={fixedFileds}
          activeId={activeId}
          mobile={mobile}
          itemChange={itemChange}
          disabled={item.disabled}
          key={item.key}
          id={item.key}
          item={item}
          cardTable={cardTable}
          index={index}
          handle={!fixedFileds}
          containerId={containerId}
        />;
      })}
    </SortableContext> : <TableConfig
      activeId={activeId}
      position={item}
      onUp={onUp}
      mobile={mobile}
      onDown={onDown}
      gutter={gutter}
      itemChange={itemChange}
      card={card}
      configChange={configChange}
      items={items}
      handleAddColumn={handleAddColumn}
      handleAddRow={handleAddRow}
      handleRemoveRow={handleRemoveRow}
      handleRemoveColumn={handleRemoveColumn}
    />}

  </DroppableContainer>;
};

export default ColumnsConfig;
