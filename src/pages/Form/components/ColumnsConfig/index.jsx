import React, {} from 'react';
import {Typography} from 'antd';
import {SortableContext} from '@dnd-kit/sortable';
import {DroppableContainer, SortableItem} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import TableConfig from '@/pages/Form/components/TableConfig';

const ColumnsConfig = (
  {
    table,
    card,
    cardTable,
    ulStyle,

    disabled,
    containerId,

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
    handle,
    getItemStyles,
    wrapperStyle,
    renderItem,
    getIndex,
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
    ulStyle={card ? {padding: '24px 0', gridGap: 0} : ulStyle}
    removeRowHidden={disabled || containerId !== 0 || table.length === 1}
    removeColumnHidden={disabled || (table.length === 1 && table[0].length === 1)}
    leftTopHidden={disabled || containerId !== 0}
    leftBottomHidden={disabled || containerId !== 0}
    topLeftHidden={disabled || mobile}
    topRightHidden={disabled || mobile}
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
            configChange({title: filedName}, line, column);
          },
        }}
      >
        {item.title || '无标题'}
      </Typography.Paragraph>
    </>)}
    items={columns[containerId].data.map(item => item.key)}
    scrollable={scrollable}
    style={disabled ? {border: 'none'} : containerStyle}
    unstyled={minimal}
    onRemove={disabled ? undefined : () => handleRemove(line, column)}
  >
    {!card ? <SortableContext items={columns[containerId].data.map(item => item.key)} strategy={strategy}>
      {columns[containerId].data.map((item, index) => {
        return (
          <SortableItem
            mobile={mobile}
            itemChange={itemChange}
            disabled={item.disabled}
            key={item.key}
            id={item.key}
            item={item}
            cardTable={cardTable}
            index={index}
            handle={!disabled}
            style={getItemStyles}
            wrapperStyle={wrapperStyle}
            renderItem={renderItem}
            containerId={containerId}
            getIndex={getIndex}
          />
        );
      })}
    </SortableContext> : <TableConfig
      position={item}
      onUp={onUp}
      mobile={mobile}
      onDown={onDown}
      gutter={gutter}
      itemChange={itemChange}
      card={card}
      PLACEHOLDER_ID={PLACEHOLDER_ID}
      configChange={configChange}
      items={items}
      scrollable={scrollable}
      containerStyle={containerStyle}
      minimal={minimal}
      handleRemove={handleRemove}
      strategy={strategy}
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
