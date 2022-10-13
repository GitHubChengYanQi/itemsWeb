import React from "react";
import {horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {DroppableContainer} from "@/pages/Form/components/MultipleContainers/MultipleContainers";
import ColumnsConfig from "@/pages/Form/components/ColumnsConfig";
import {Button} from "antd";

const TableConfig = (
  {
    noCard,
    rows = [],
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
    setRows,
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

  return < >
    {table.map((columns, index) => {
      return <div key={index}>
        <div
          style={{
            display: 'inline-grid',
            boxSizing: 'border-box',
            // margin: 20,
            gridAutoFlow: 'column',
            alignItems: 'flex-start',
            border: 'dashed 1px rgba(0,0,0,0.05)'
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
                  noCard={noCard}
                  config={columnsConfig}
                  configChange={configChange}
                  disabled={false}
                  key={index}
                  containerId={index + 1}
                  index={index}
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
                  vertical={vertical}
                  PLACEHOLDER_ID={PLACEHOLDER_ID}
                  empty={empty}
                  handleAddColumn={handleAddColumn}
                />;
              }
            )}
            <DroppableContainer
              id={PLACEHOLDER_ID}
              disabled={isSortingContainer}
              items={empty}
              onClick={() => {
                handleAddColumn(index, columns.length);
              }}
              placeholder
            >
              + 添加列
            </DroppableContainer>
          </SortableContext>
        </div>
      </div>;
    })}

    <div style={{padding: 20}}>
      <DroppableContainer
        style={{alignItems: 'flex-start'}}
        id={PLACEHOLDER_ID}
        disabled={isSortingContainer}
        items={empty}
        onClick={() => {
          setRows(table.filter(item => item).length + 1);
        }}
        placeholder
      >
        <Button>+ 添加行</Button>
      </DroppableContainer>
    </div>
  </>
};

export default TableConfig;
