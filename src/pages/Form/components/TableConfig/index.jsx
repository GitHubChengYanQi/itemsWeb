import React from "react";
import {horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {DroppableContainer} from "@/pages/Form/components/MultipleContainers/MultipleContainers";
import ColumnsConfig from "@/pages/Form/components/ColumnsConfig";
import {Button, Tooltip} from "antd";

const TableConfig = (
  {
    card,
    width,
    vertical,
    PLACEHOLDER_ID,
    columnsConfig,
    configChange,
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
    empty,
    handleAddColumn,
    handleAddRow,
    handleRemoveRow,
    handleRemoveColumn,
  }
) => {

  const table = [];
  items.forEach((item, index) => {
    if (index === 0) {
      return;
    }
    if (table[item.line]) {
      const columns = [...table[item.line], item];
      table[item.line] = columns.sort((a, b) => a.column - b.column);
    } else {
      table[item.line] = [item];
    }
  });

  return <>
    {table.map((columns, rowIndex) => {

      return <div key={rowIndex}>
        <div
          style={{
            display: 'inline-grid',
            boxSizing: 'border-box',
            // margin: 20,
            gridAutoFlow: 'column',
            alignItems: 'flex-start',
            border: 'dashed 1px rgba(0,0,0,0.05)',
            width:`${width}vw`,
            // overflow: 'hidden'
          }}
        >
          <SortableContext
            items={[...columns, PLACEHOLDER_ID]}
            strategy={
              vertical
                ? verticalListSortingStrategy
                : horizontalListSortingStrategy
            }
          >
            {columns.map((item, index) => {
                return <ColumnsConfig
                  id={`${item.line}-${item.column}`}
                  card={card}
                  table={table.filter(item => item)}
                  config={columnsConfig}
                  configChange={configChange}
                  disabled={false}
                  key={index}
                  line={item.line}
                  column={item.column}
                  containerId={index}
                  index={index}
                  items={columns}
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
                  vertical={vertical}
                  PLACEHOLDER_ID={PLACEHOLDER_ID}
                  empty={empty}
                  handleAddColumn={handleAddColumn}
                  handleAddRow={handleAddRow}
                  handleRemoveRow={handleRemoveRow}
                  handleRemoveColumn={handleRemoveColumn}
                />
              }
            )}
          </SortableContext>
        </div>
      </div>;
    })}
  </>;
};

export default TableConfig;
