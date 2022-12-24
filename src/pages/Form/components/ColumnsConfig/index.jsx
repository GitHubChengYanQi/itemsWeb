import React from 'react';
import {Typography} from 'antd';
import {SortableContext} from '@dnd-kit/sortable';
import {DroppableContainer, SortableItem} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import TableConfig from '@/pages/Form/components/TableConfig';

const ColumnsConfig = (
  {
    report,
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
    disabled={card}
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
    items={columns[containerId].data.map(item => item.key)}
    style={(fixedFileds || mobile) ? {border: 'none'} : containerStyle}
    onRemove={fixedFileds ? undefined : () => handleRemove(line, column)}
  >
    {!card ? <SortableContext items={columns[containerId].data.map(item => item.key)}>
      {columns[containerId].data.map((item, index) => {
        return <SortableItem
          report={report}
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
      report={report}
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
