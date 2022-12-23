import React, {useEffect, useState, memo} from 'react';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {Button, Row} from 'antd';
import ColumnsConfig from '@/pages/Form/components/ColumnsConfig';

const TableConfig = (
  {
    report,
    activeId,
    position = {},
    gutter,
    widthUnit,
    card,
    mobile,
    width,
    configChange,
    items,
    handleRemove,
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

  }, [activeId, items]);

  return <div>
    {(card ? cardTable : table).map((columns, rowIndex) => {
      return <div key={rowIndex} style={{display: 'flex', alignItems: 'center', background: '#fff', marginBottom: 3}}>
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
              border: mobile ? 'none' : 'dashed 1px rgba(0,0,0,0.2)',
              borderBottom: (!mobile && rowIndex === (card ? cardTable : table).length - 1) ? 'dashed 1px rgba(0,0,0,0.2)' : 'none',
              // borderRight: !card && 'none',
              width: card ? '100%' : `${width + widthUnit}`,
              // overflow: 'hidden'
            }}
          >
            <SortableContext
              items={[...columns]}
              strategy={verticalListSortingStrategy}
            >
              {columns.map((item, index) => {
                  return <ColumnsConfig
                    report={report}
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
                    containerStyle={{borderRight: index !== columns.length - 1 ? 'dashed 1px rgba(0,0,0,0.2)' : 'none'}}
                    handleRemove={handleRemove}
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
  </div>;
};

export default memo(TableConfig);
