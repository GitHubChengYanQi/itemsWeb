import React from "react";
import {horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import ColumnsConfig from "@/pages/Form/components/ColumnsConfig";

const TableConfig = (
  {
    gutter,
    widthUnit,
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
    itemChange,
  }
) => {

  const table = [];
  const cardTable = [];
  items.forEach((item, index) => {
    if (index === 0) {
      return;
    }
    if (item.cardTable) {
      if (cardTable[item.cardLine]) {
        const columns = [...cardTable[item.cardLine], item];
        cardTable[item.cardLine] = columns.sort((a, b) => a.cardColumn - b.cardColumn);
      } else {
        cardTable[item.cardLine] = [item];
      }
    } else if (table[item.line]) {
      const columns = [...table[item.line], item];
      table[item.line] = columns.sort((a, b) => a.column - b.column);
    } else {
      table[item.line] = [item];
    }
  });

  return <>
    {(card ? cardTable : table).map((columns, rowIndex) => {
      return <div key={rowIndex} style={{padding: card && 24}}>
        <div
          style={{
            display: 'inline-grid',
            boxSizing: 'border-box',
            // margin: 20,
            padding: 0,
            gridAutoFlow: 'column',
            alignItems: 'flex-start',
            border: 'dashed 1px rgba(0,0,0,0.05)',
            borderBottom: rowIndex === (card ? cardTable : table).length - 1 ? 'dashed 1px rgba(0,0,0,0.05)' : 'none',
            width: card ? '100%' : `${width + widthUnit}`,
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
                  gutter={gutter}
                  ulStyle={{padding: gutter / 2}}
                  itemChange={(newData, filed) => {
                    itemChange(newData, filed, item);
                  }}
                  id={card ? `${item.line}-${item.column}-${item.cardLine}-${item.cardColumn}` : `${item.line}-${item.column}`}
                  card={item.card}
                  cardTable={card}
                  table={(card ? cardTable : table).filter(item => item)}
                  config={columnsConfig}
                  configChange={configChange}
                  disabled={false}
                  key={index}
                  item={item}
                  line={card ? item.cardLine : item.line}
                  column={card ? item.cardColumn : item.column}
                  containerId={index}
                  index={index}
                  items={items}
                  columns={columns}
                  scrollable={scrollable}
                  containerStyle={{borderRight: index !== columns.length - 1 ? 'dashed 1px rgba(0,0,0,0.05)' : 'none'}}
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
                />;
              }
            )}
          </SortableContext>
        </div>
      </div>;
    })}
  </>;
};

export default TableConfig;
