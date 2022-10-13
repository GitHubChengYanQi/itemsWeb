import React, {useState} from 'react';
import {InputNumber, Radio, Typography} from 'antd';
import {SortableContext} from '@dnd-kit/sortable';
import {DroppableContainer, SortableItem} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import TableConfig from "@/pages/Form/components/TableConfig";
import {isArray, isObject} from "@/util/Tools";

const ColumnsConfig = (
  {
    disabled,
    containerId,

    containers,
    vertical,
    PLACEHOLDER_ID,
    empty,
    handleAddColumn,

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

  const [rows, setRows] = useState([0]);

  const card = !disabled && isObject(isObject(items[containerId][0]).data).key === 'card';

  return <DroppableContainer
    noNandle
    key={containerId}
    id={containerId}
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
    columns={currentConfig.columns}
    items={items[containerId].data.map(item => item.key)}
    scrollable={scrollable}
    style={containerStyle}
    unstyled={minimal}
    onRemove={disabled ? undefined : () => handleRemove(containerId)}
  >
    {!card ? <SortableContext items={items[containerId].data.map(item => item.key)} strategy={strategy}>
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
      noCard
      columnsConfig={config}
      rows={rows}
      containers={containers}
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
      handleAddColumn={(index) => {
        handleAddColumn(`${index}-${index}`);
      }}
      setRows={setRows}
    />}
  </DroppableContainer>;
};

export default ColumnsConfig;
