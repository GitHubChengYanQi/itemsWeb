import React, {useState} from 'react';
import {InputNumber, Typography} from 'antd';
import {SortableContext} from '@dnd-kit/sortable';
import {DroppableContainer, SortableItem} from '@/pages/Form/components/MultipleContainers/MultipleContainers';

const ColumnsConfig = (
  {
    disabled,
    containerId,
    index,
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
    }
  }) => {

  const currentConfig = config[containerId] || {};

  return <DroppableContainer
    noNandle
    key={containerId}
    id={containerId}
    label={disabled ? '待选字段' : <>
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
      <InputNumber
        min={1}
        style={{width: 100}}
        value={currentConfig.columns}
        onChange={(number) => configChange({columns: number}, containerId)}
        addonAfter="列"
      />
    </>}
    columns={currentConfig.columns}
    items={items[containerId].map(item => item.key)}
    scrollable={scrollable}
    style={containerStyle}
    unstyled={minimal}
    onRemove={disabled ? undefined : () => handleRemove(containerId)}
  >
    <SortableContext items={items[containerId].map(item => item.key)} strategy={strategy}>
      {items[containerId].map((item, index) => {
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
    </SortableContext>
  </DroppableContainer>;
};

export default ColumnsConfig;
