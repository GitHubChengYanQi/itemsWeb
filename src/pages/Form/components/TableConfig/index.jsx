import React, {useEffect, useState} from 'react';
import {horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {Button, Row} from 'antd';
import ColumnsConfig from '@/pages/Form/components/ColumnsConfig';

const TableConfig = (
  {
    activeId,
    position = {},
    gutter,
    widthUnit,
    card,
    mobile,
    width,
    vertical,
    PLACEHOLDER_ID,
    configChange,
    items,
    scrollable,
    minimal,
    handleRemove,
    strategy,
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
    onUp,
    onDown,
  }
) => {

  const [table, setTable] = useState([]);
  const [cardTable, setCardTable] = useState([]);

  useEffect(() => {
    if (activeId) {
      return;
    }
    // setTimeout(() => {
    const initTable = [];
    const initCardTable = [];
    items.forEach((item, index) => {
      if (index === 0) {
        return;
      }
      if (item.cardTable) {
        if (item.line === position.line && item.column === position.column) {
          if (initCardTable[item.cardLine]) {
            const columns = [...initCardTable[item.cardLine], item];
            initCardTable[item.cardLine] = columns.sort((a, b) => a.cardColumn - b.cardColumn);
          } else {
            initCardTable[item.cardLine] = [item];
          }
        }
      } else if (initTable[item.line]) {
        const columns = [...initTable[item.line], item];
        initTable[item.line] = columns.sort((a, b) => a.column - b.column);
      } else {
        initTable[item.line] = [item];
      }
    });
    setTable(initTable);
    setCardTable(initCardTable);
    // }, 0);
  }, [items]);

  return <>
    {(card ? cardTable : table).map((columns, rowIndex) => {
      return <div key={rowIndex} style={{display: 'flex', alignItems: 'center'}}>
        <div style={{width: card ? 40 : 64}}>
          <Button
            disabled={rowIndex === 1}
            type="link"
            style={{height: 20, padding: '0 16px'}}
            onClick={() => onUp(rowIndex, card, position)}>
            <UpOutlined />
          </Button>
          <Button
            style={{height: 20, padding: '0 16px'}}
            disabled={rowIndex === (card ? cardTable : table).length - 1}
            type="link"
            onClick={() => onDown(rowIndex, card, position)}>
            <DownOutlined />
          </Button>
        </div>
        <div style={{
          padding: card && '0 24px',
          // paddingBottom: rowIndex === (card ? cardTable : table).length - 1 ? 20 : 0,
          // paddingTop: rowIndex === 1 ? 20 : 0,
          width: '100%'
        }}>
          <Row
            gutter={gutter}
            style={{
              border: 'dashed 1px rgba(0,0,0,0.2)',
              borderBottom: rowIndex === (card ? cardTable : table).length - 1 ? 'dashed 1px rgba(0,0,0,0.2)' : 'none',
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
                    activeId={activeId}
                    mobile={mobile}
                    onUp={onUp}
                    onDown={onDown}
                    gutter={gutter}
                    itemChange={(newData, filed) => {
                      itemChange(newData, filed, item);
                    }}
                    id={card ? `${item.line}-${item.column}-${item.cardLine}-${item.cardColumn}` : `${item.line}-${item.column}`}
                    card={item.card}
                    cardTable={card}
                    table={(card ? cardTable : table).filter(item => item)}
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
                    containerStyle={{borderRight: index !== columns.length - 1 ? 'dashed 1px rgba(0,0,0,0.2)' : 'none'}}
                    minimal={minimal}
                    handleRemove={handleRemove}
                    strategy={strategy}
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
          </Row>
        </div>
      </div>;
    })}
  </>;
};

export default TableConfig;
