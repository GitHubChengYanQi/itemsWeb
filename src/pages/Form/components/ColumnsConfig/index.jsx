import React, {useState} from 'react';
import {InputNumber, Radio, Tooltip, Typography} from 'antd';
import {SortableContext} from '@dnd-kit/sortable';
import {DroppableContainer, SortableItem} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import TableConfig from "@/pages/Form/components/TableConfig";

const ColumnsConfig = (
  {
    table,
    card,

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

  const haveCard = items[containerId].data.find(item => item.key === 'card');


  return <DroppableContainer
    removeRowHidden={card || disabled || containerId !== 0 || table.length === 1}
    removeColumnHidden={card || disabled || (table.length === 1 && table[0].length === 1)}
    leftTopHidden={card || disabled || containerId !== 0}
    leftBottomHidden={card || disabled || containerId !== 0}
    topLeftHidden={card || disabled}
    topRightHidden={card || disabled}
    onRemoveColumn={() => {
      handleRemoveColumn(line, column);
    }}
    onRemoveRow={() => {
      handleRemoveRow(line);
    }}
    onLeftTop={() => {
      handleAddRow(line);
    }}
    onLeftBottom={() => {
      handleAddRow(line + 1);
    }}
    onTopLeft={() => {
      handleAddColumn(line, column);
    }}
    onTopRight={() => {
      handleAddColumn(line, column + 1);
    }}
    noNandle
    key={id}
    id={id}
    label={disabled ? '待选字段' : (haveCard && <>
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
    items={items[containerId].data.map(item => item.key)}
    scrollable={scrollable}
    style={containerStyle}
    unstyled={minimal}
    onRemove={disabled ? undefined : () => handleRemove(containerId)}
  >
    {!(haveCard && !disabled) ? <SortableContext items={items[containerId].data.map(item => item.key)} strategy={strategy}>
      {items[containerId].data.map((item, index) => {
        return (
          <SortableItem
            disabled={isSortingContainer}
            key={item.key}
            id={item.key}
            value={item.filedName}
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
      items={[{}, {line: 1, column: 0, data: []}, {line: 1, column: 1, data: []}, {line: 2, column: 0, data: []}]}
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
    />}

  </DroppableContainer>;
};

export default ColumnsConfig;
