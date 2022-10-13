import React, {useState} from 'react';
import {InputNumber, Radio, Tooltip, Typography} from 'antd';
import {SortableContext} from '@dnd-kit/sortable';
import {DroppableContainer, SortableItem} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import TableConfig from "@/pages/Form/components/TableConfig";
import {isObject} from "@/util/Tools";

const ColumnsConfig = (
  {
    table,
    card,
    cardTable,

    disabled,
    containerId,

    vertical,
    PLACEHOLDER_ID,
    empty,
    handleAddColumn,
    handleAddRow,
    line,
    column,
    items,
    item,
    columns,
    scrollable,
    containerStyle,
    minimal,
    handleRemove,
    strategy,
    isSortingContainer,
    handle,
    getItemStyles,
    wrapperStyle,
    renderItem,
    getIndex,
    config = {},
    configChange = () => {
    },
    handleRemoveRow,
    handleRemoveColumn,
    id
  }) => {

  const currentConfig = config[containerId] || {};

  return <DroppableContainer
    removeRowHidden={disabled || containerId !== 0 || table.length === 1}
    removeColumnHidden={disabled || (table.length === 1 && table[0].length === 1)}
    leftTopHidden={disabled || containerId !== 0}
    leftBottomHidden={disabled || containerId !== 0}
    topLeftHidden={disabled}
    topRightHidden={disabled}
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
    label={disabled ? '待选字段' : (card && <>
      <Typography.Paragraph
        style={{margin: 0}}
        editable={{
          tooltip: '点击自定义字段名',
          onChange: (filedName) => {
            configChange({title: filedName}, containerId);
          },
        }}
      >
        {currentConfig.title}
      </Typography.Paragraph>
    </>)}
    items={columns[containerId].data.map(item => item.key)}
    scrollable={scrollable}
    style={containerStyle}
    unstyled={minimal}
    onRemove={disabled ? undefined : () => handleRemove(line, column)}
  >
    {!card ? <SortableContext items={columns[containerId].data.map(item => item.key)} strategy={strategy}>
      {columns[containerId].data.map((item, index) => {
        return (
          <SortableItem
            disabled={isSortingContainer}
            key={item.key}
            id={item.key}
            value={item.filedName}
            cardTable={cardTable}
            index={index}
            handle={handle}
            style={getItemStyles}
            wrapperStyle={wrapperStyle}
            renderItem={renderItem}
            containerId={containerId}
            getIndex={getIndex}
          />
        );
      })}
    </SortableContext> : <TableConfig
      card={card}
      columnsConfig={config}
      vertical={vertical}
      PLACEHOLDER_ID={PLACEHOLDER_ID}
      configChange={configChange}
      items={items}
      scrollable={scrollable}
      containerStyle={containerStyle}
      minimal={minimal}
      handleRemove={handleRemove}
      strategy={strategy}
      isSortingContainer={isSortingContainer}
      handle={handle}
      getItemStyles={getItemStyles}
      wrapperStyle={wrapperStyle}
      renderItem={renderItem}
      getIndex={getIndex}
      empty={empty}
      handleAddColumn={handleAddColumn}
      handleAddRow={handleAddRow}
      handleRemoveRow={handleRemoveRow}
      handleRemoveColumn={handleRemoveColumn}
    />}

  </DroppableContainer>;
};

export default ColumnsConfig;
