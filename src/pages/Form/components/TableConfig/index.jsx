import React from "react";
import {horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {DroppableContainer} from "@/pages/Form/components/MultipleContainers/MultipleContainers";
import ColumnsConfig from "@/pages/Form/components/ColumnsConfig";
import {Button} from "antd";

const TableConfig = (
  {
    noCard,
    rows = [],
    containers = [],
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


  return <>
    {
      rows.map((item, index) => {
        const array = containers.filter(containerId => {
          if (containerId === 'A') {
            return false;
          }
          const keySplits = containerId.split('-');
          return noCard ? keySplits[2] === `${item}` : (keySplits[1] === `${item}` && !keySplits[2]);
        });

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
              items={[...array, PLACEHOLDER_ID]}
              strategy={
                vertical
                  ? verticalListSortingStrategy
                  : horizontalListSortingStrategy
              }
            >
              {array.map((containerId, index) => {
                  return <ColumnsConfig
                    noCard={noCard}
                    config={columnsConfig}
                    configChange={configChange}
                    disabled={false}
                    key={index}
                    containerId={containerId}
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
                    containers={containers}
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
                  handleAddColumn(index);
                }}
                placeholder
              >
                + 添加列
              </DroppableContainer>
            </SortableContext>
          </div>
        </div>;
      })
    }
    <div style={{padding: 20}}>
      <DroppableContainer style={{alignItems:'flex-start'}}
        id={PLACEHOLDER_ID}
        disabled={isSortingContainer}
        items={empty}
        onClick={() => {
          setRows([...rows, rows[rows.length - 1] + 1]);
        }}
        placeholder
      >
        <Button>+ 添加行</Button>
      </DroppableContainer>
    </div>
  </>;
};

export default TableConfig;
