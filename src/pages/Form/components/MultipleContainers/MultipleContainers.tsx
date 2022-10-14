import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal, unstable_batchedUpdates} from 'react-dom';
import {
  CancelDrop,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  Modifiers,
  useDroppable,
  UniqueIdentifier,
  useSensors,
  useSensor,
  MeasuringStrategy,
  KeyboardCoordinateGetter,
} from '@dnd-kit/core';
import {
  AnimateLayoutChanges,
  SortableContext,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  SortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import ColumnsConfig from '../ColumnsConfig'
import TableConfig from '../TableConfig'


import {Item} from '../Item';
import {Container, ContainerProps} from '../Container';

import {createRange} from '../createRange';
import {Button, InputNumber, Select, Space} from "antd";
import {isObject} from '@/util/Tools';

export default {
  title: 'Presets/Sortable/Multiple Containers',
};


const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true;

export const DroppableContainer = (
  {
    children,
    columns = 1,
    disabled,
    id,
    items,
    style,
    ...props
  }: ContainerProps & {
    disabled?: boolean;
    id: string;
    items: string[];
    style?: React.CSSProperties;
  }) => {

  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: 'container',
      children: items,
    },
    animateLayoutChanges,
  });
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container') ||
    items.includes(over.id)
    : false;

  return (
    <Container
      ref={disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      hover={isOverContainer}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      columns={columns}
      {...props}
    >
      {children}
    </Container>
  );
};

type Items = [
  {
    line: number;
    column: number;
    cardLine?: number;
    cardColumn?: number;
    card?: boolean;
    cardTable?: boolean;
    data: [{ key?: any, filedName?: any }]
  }
];

interface Props {
  adjustScale?: boolean;
  cancelDrop?: CancelDrop;
  columns?: number;
  containerStyle?: React.CSSProperties;
  coordinateGetter?: KeyboardCoordinateGetter;

  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): React.CSSProperties;

  wrapperStyle?(args: { index: number }): React.CSSProperties;

  itemCount?: number;
  width?: number;
  gutter?: number;
  widthUnit?: string;
  items: Items;
  handle?: boolean;
  renderItem?: any;
  strategy?: SortingStrategy;
  modifiers?: Modifiers;
  minimal?: boolean;
  trashable?: boolean;
  scrollable?: boolean;
  vertical?: boolean;
}

export const TRASH_ID = 'void';
const PLACEHOLDER_ID = 'placeholder';
const empty: UniqueIdentifier[] = [];

export function MultipleContainers(
  {
    adjustScale = false,
    itemCount = 3,
    cancelDrop,
    columns,
    handle = false,
    items: initialItems,
    containerStyle,
    coordinateGetter = sortableKeyboardCoordinates,
    getItemStyles = () => ({}),
    wrapperStyle = () => ({}),
    minimal = false,
    modifiers,
    renderItem,
    strategy = verticalListSortingStrategy,
    trashable = false,
    vertical = false,
    scrollable,
  }: Props) {
  const [items, setItems] = useState<Items>(initialItems);

  const [width, setWidth] = useState(100);
  const [gutter, setGutter] = useState(16);
  const [widthUnit, setWidthUnit] = useState('%');

  const [activeId, setActiveId] = useState<any>(null);
  const [active, setActive] = useState<any>({});
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = false;

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
          pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return intersections;
        }

        if (overId in items) {
          const containerItems = items[overId].data;

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.map(item => item.key).includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{id: overId}];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{id: lastOverId.current}] : [];
    },
    [activeId, items]
  );
  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );
  const findContainer = (id: any) => {
    if (!id) {
      return null;
    }
    let idIndex;
    let currentIndex;
    const position = id.split('-') || [];
    items.forEach((item, index) => {
      if (typeof currentIndex === "number") {
        return;
      }
      if (
        position.length === 4
        &&
        item.line === parseInt(position[0])
        &&
        item.column === parseInt(position[1])
        &&
        item.cardLine === parseInt(position[2])
        &&
        item.cardColumn === parseInt(position[3])
      ) {
        idIndex = index
      } else if (position.length === 2 && item.line === parseInt(position[0]) && item.column === parseInt(position[1])) {
        idIndex = index
      }
      item.data.forEach((item) => {
        if (typeof currentIndex === "number") {
          return;
        }
        if (item.key === id) {
          currentIndex = index;
          return;
        }
      })
    })

    if (typeof currentIndex !== "number") {
      return idIndex;
    }
    return currentIndex
  };

  const getIndex = (id: string) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }
    const index = items[container].data.map(item => item.key).indexOf(id);

    return index;
  };

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({active: {id, data: {current}}}) => {
        setActiveId(id);
        setActive(current);
        setClonedItems(items);
      }}
      onDragOver={({active, over}) => {

        const overId = over?.id;

        const overContainer = findContainer(overId || '');
        const activeContainer = findContainer(active.id || '');
        if (typeof overContainer !== 'number' || typeof activeContainer !== 'number') {
          return;
        }
        if (items[overContainer].cardTable && active.id === 'card') {
          return;
        }
        if (activeContainer !== overContainer) {
          const activeItems = items[activeContainer].data;
          const overItems = items[overContainer].data;
          const overIndex = overItems.map(item => item.key).indexOf(overId);
          const activeIndex = activeItems.map(item => item.key).indexOf(active.id);
          let newIndex: number;

          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
            over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;

          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;

          recentlyMovedToNewContainer.current = true;
          const newItems: any = items.map((item, index) => {
            if (index === activeContainer) {
              return {
                ...item,
                data: item.data.filter(
                  (item) => item.key !== active.id
                )
              }
            } else if (index === overContainer) {
              return {
                ...item,
                data: [
                  ...item.data.slice(0, newIndex),
                  items[activeContainer].data[activeIndex],
                  ...item.data.slice(
                    newIndex,
                    item.data.length
                  ),
                ]
              }
            } else {
              return item
            }
          })
          setItems(newItems);
        }
      }}
      onDragEnd={({active, over}) => {

        const activeContainer = findContainer(active.id);
        const overId = over?.id;
        const overContainer = findContainer(overId);

        if (isObject(items[overContainer]).cardTable && active.id === 'card') {
          setActiveId(null);
          return;
        }

        if (!overId) {
          setActiveId(null);
          if ((active.id === 'card' && activeContainer !== 0)) {
            let cardPosition: any = {};
            const newItems = items.map((item, index) => {
              if (index === overContainer) {
                cardPosition = item;
                return {...item, card: true,data:[]}
              }
              return item;
            });
            const array: any = [...newItems.map((item, index) => {
              if (index === 0) {
                return {...item, data: [...cardPosition.data, ...item.data]}
              }
              return item;
            }), {
              ...cardPosition,
              cardLine: 1,
              cardColumn: 0,
              cardTable: true,
              data: []
            }]
            setItems(array)
          }
          return;
        }
        if (overId === TRASH_ID) {
          let cardPosition: any = {};
          const newItems = items.map((item, index) => {
            if ((active.id === 'card' && activeContainer !== 0) && index === overContainer) {
              cardPosition = item;
              return {...item, card: true,data:[]}
            }
            if (index === activeContainer) {
              return {
                ...item,
                data: item.data.filter(
                  (id) => id.key !== activeId
                )
              }
            }
            return item;
          })
          const array: any = (active.id === 'card' && activeContainer !== 0) ? [...newItems.map((item, index) => {
            if (index === 0) {
              return {...item, data: [...cardPosition.data, ...item.data]}
            }
            return item;
          }), {
            ...cardPosition,
            cardLine: 1,
            cardColumn: 0,
            cardTable: true,
            data: []
          }] : newItems;
          setItems(array);
          setActiveId(null);
          return;
        }


        if (typeof overContainer === 'number') {
          const activeIndex = items[activeContainer].data.map(item => item.key).indexOf(active.id);
          const overIndex = items[overContainer].data.map(item => item.key).indexOf(overId);

          if (activeIndex !== overIndex) {
            let cardPosition;
            const newItems = items.map((item, index) => {
              if (index === overContainer) {
                if ((active.id === 'card' && activeContainer !== 0)) {
                  cardPosition = item;
                }
                return {
                  ...item,
                  card: (active.id === 'card' && activeContainer !== 0) || item.card,
                  data: (active.id === 'card' && activeContainer !== 0) || item.card ? [] : arrayMove(
                    items[overContainer].data,
                    activeIndex,
                    overIndex
                  )
                }
              }
              return item;
            })
            const array: any = (active.id === 'card' && activeContainer !== 0) ? [...newItems.map((item, index) => {
              if (index === 0) {
                return {...item, data: [...cardPosition.data, ...item.data]}
              }
              return item;
            }), {
              ...cardPosition,
              cardLine: 1,
              cardColumn: 0,
              cardTable: true,
              data: []
            }] : newItems;
            setItems(array);
          } else if (active.id === 'card' && activeContainer !== 0) {
            let cardPosition: any = {};
            const newItems = items.map((item, index) => {
              if (index === overContainer) {
                cardPosition = item;
                return {...item, card: true, data: []}
              }
              return item;
            });

            const array: any = [...newItems.map((item, index) => {
              if (index === 0) {
                return {...item, data: [...cardPosition.data, ...item.data]}
              }
              return item;
            }), {...cardPosition, cardLine: 1, cardColumn: 0, cardTable: true, data: []}]
            setItems(array)
          }
          setActiveId(null);
        }
      }
      }
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <div style={{display: 'flex', alignItems: 'flex-start'}}>
        <div style={{minWidth: 350, display: "inline-block"}}>
          <ColumnsConfig
            ulStyle={{padding: 16}}
            card={false}
            disabled
            containerId={0}
            id='0-0'
            items={items}
            columns={items}
            scrollable={scrollable}
            minimal={minimal}
            handleRemove={() => {
            }}
            strategy={strategy}
            isSortingContainer={isSortingContainer}
            handle={handle}
            getItemStyles={getItemStyles}
            wrapperStyle={wrapperStyle}
            renderItem={renderItem}
            getIndex={getIndex}
          />
        </div>
        <div style={{flexGrow: 1, height: '90vh', overflow: 'auto', padding: '20px 40px'}}>
          <div style={{padding: 24, textAlign: 'center'}}>
            <Space align='center'>
              行宽：
              <InputNumber
                max={100}
                min={30}
                value={width}
                onChange={setWidth}
                addonAfter={<Select
                  value={widthUnit}
                  onChange={setWidthUnit}
                  options={[{label: '%', value: '%'}, {label: 'vw', value: 'vw'}, {label: 'px', value: 'px'},]}/>}
              />
            </Space>
            <Space align='center' style={{marginLeft:16}}>
              间距：
              <InputNumber
                max={100}
                min={8}
                value={gutter}
                onChange={setGutter}
                addonAfter='px'
              />
            </Space>
          </div>
          <TableConfig
            onUp={onUp}
            onDown={onDown}
            configChange={configChange}
            gutter={gutter}
            widthUnit={widthUnit}
            handleRemove={handleRemoveCard}
            card={false}
            width={width}
            vertical={vertical}
            PLACEHOLDER_ID={PLACEHOLDER_ID}
            items={items}
            scrollable={scrollable}
            containerStyle={containerStyle}
            minimal={minimal}
            strategy={strategy}
            isSortingContainer={isSortingContainer}
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
            itemChange={itemChange}
          />
          <div style={{paddingTop: 24}}>
            <Button type='primary' onClick={() => {
              const submitData: any = [];

              items.slice(1, items.length).forEach((item) => {
                let column: any = item;
                if (item.card) {
                  const table: any = [];
                  const cardTable = items.filter(cardItems => {
                    return cardItems.line === item.line && cardItems.column === item.column && cardItems.cardTable
                  })
                  cardTable.forEach((item) => {
                    if (table[item.cardLine || 0]) {
                      const columns = [...table[item.cardLine || 0], item];
                      table[item.cardLine || 0] = columns.sort((a, b) => a.cardColumn - b.cardColumn);
                    } else {
                      table[item.cardLine || 0] = [item];
                    }
                  })
                  column = {
                    ...item,
                    table:table.slice(1, table.length),
                  }
                }
                if (item.cardTable) {
                  return;
                } else if (submitData[item.line]) {
                  const columns = [...submitData[item.line], column];
                  submitData[item.line] = columns.sort((a, b) => a.column - b.column);
                } else {
                  submitData[item.line] = [column];
                }
              })
              console.log(submitData.slice(1, items.length))
            }}>保存</Button>
          </div>
        </div>
      </div>

      {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {activeId ? renderSortableItemDragOverlay(activeId, active) : null}
        </DragOverlay>,
        document.body
      )}
      {trashable && activeId ? (
        <Trash id={TRASH_ID}/>
      ) : null}
    </DndContext>
  );

  function renderSortableItemDragOverlay(id: string, active: any) {
    return (
      <Item
        item={active}
        value={active.filedName}
        handle={handle}
        style={getItemStyles({
          containerId: findContainer(id) as string,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        color={getColor(id)}
        wrapperStyle={wrapperStyle({index: 0})}
        renderItem={renderItem}
        dragOverlay
      />
    );
  }


  function handleRemoveCard(line, column) {
    const files: any = [];
    const newItems: any = [];
    items.forEach(item => {
      if (item.line === line && item.column === column) {
        item.data.forEach(item => {
          files.push(item)
        })
        if (item.card) {
          newItems.push({...item, data: [], card: false})
        }
        return;
      }
      newItems.push(item)
    });
    const array = newItems.map((item, index) => {
      if (index === 0) {
        return {...item, data: [...files, ...item.data]}
      }
      return item;
    })
    setItems(array)
  }

  function handleRemoveRow(line, cardTable, cardPosition) {
    const files: any = [];
    const newItems: any = [];
    items.forEach(item => {
      if (cardTable) {
        if (item.line === cardPosition.line && item.column === cardPosition.column) {
          if (item.cardLine === line) {
            item.data.forEach(item => {
              files.push(item)
            })
            return;
          } else if ((item.cardLine || 0) > line) {
            newItems.push({...item, cardLine: (item.cardLine || 0) - 1})
            return;
          }
          newItems.push(item)
          return;
        }
        newItems.push(item)
      } else {
        if (item.line === line) {
          item.data.forEach(item => {
            files.push(item)
          })
          return;
        } else if (item.line > line) {
          newItems.push({...item, line: item.line - 1})
          return;
        }
        newItems.push(item)
      }
    });
    const array = newItems.map((item, index) => {
      if (index === 0) {
        return {...item, data: [...files, ...item.data]}
      }
      return item;
    })
    setItems(array)
  }

  function onUp(line, card, position) {
    const newItems: any = items.map(item => {
      if (card ? (item.cardLine === line && item.line === position.line && item.column === position.column) : item.line === line) {
        return card ? {...item, cardLine: line - 1} : {...item, line: item.line - 1}
      } else if (card ? (item?.cardLine >= line - 1 && item.line === position.line && item.column === position.column) : item.line >= (line - 1)) {
        return card ? {...item, cardLine: item.cardLine + 1} : {...item, line: item.line + 1}
      }
      return item;
    })
    setItems(newItems);
  }

  function onDown(line, card, position) {
    const newItems: any = items.map(item => {
      if (card ? (item.cardLine === line && item.line === position.line && item.column === position.column) : item.line === line) {
        return card ? {...item, cardLine: line + 1} : {...item, line: item.line + 1}
      } else if (card ? (item.cardLine === line + 1 && item.line === position.line && item.column === position.column) : item.line === line + 1) {
        return card ? {...item, cardLine: line} : {...item, line: line}
      }
      return item;
    })
    setItems(newItems)
  }

  function configChange(newData, line, column) {
    const newItems = items.map(item => {
      if (item.line === line && item.column === column && item.card) {
        return {...item, ...newData}
      }
      return item;
    })
    setItems(newItems)
  }

  function itemChange(newData, filed, position) {
    const newItems: any = items.map(item => {
      if (item.line === position.line && item.column === position.column && (position.cardTable ? (item.cardLine === position.cardLine && item.cardColumn === position.cardColumn) : true)) {
        const data = item.data || [];
        const newArray = data.map(item => {
          if (item.key === filed) {
            return {...item, ...newData}
          }
          return item;
        });
        return {...item, data: newArray}
      }
      return item;
    })
    setItems(newItems)
  }

  function handleRemoveColumn(line, column, cardTable, cardPosition) {
    const files: any = [];
    const newItems: any = [];
    items.forEach(item => {
      if (cardTable) {
        if (item.line === cardPosition.line && item.column === cardPosition.column) {
          if (item.cardLine === line && item.cardColumn === column) {
            item.data.forEach(item => {
              files.push(item)
            })
            return;
          } else if (item.cardLine === line && (item.cardColumn || 0) > column) {
            newItems.push({...item, cardColumn: (item.cardColumn || 0) - 1});
            return;
          }
          if (column === 0 && (item.cardLine || 0) > line) {
            newItems.push({...item, cardLine: item.cardLine - 1})
          } else {
            newItems.push(item)
          }
          return;
        }
        newItems.push(item)
      } else {
        if (item.line === line && item.column === column) {
          item.data.forEach(item => {
            files.push(item)
          })
          return;
        } else if (item.line === line && item.column > column) {
          newItems.push({...item, column: item.column - 1})
          return;
        }
        if (column === 0 && item.line > line) {
          newItems.push({...item, line: item.line - 1})
        } else {
          newItems.push(item)
        }
      }
    });
    const array = newItems.map((item, index) => {
      if (index === 0) {
        return {...item, data: [...files, ...item.data]}
      }
      return item;
    })
    setItems(array)
  }

  function handleAddColumn(line, column, cardTable, cardPosition) {
    if (cardTable) {
      const newItems: any = [...items.map(item => {
        if (item.line === cardPosition.line && item.column === cardPosition.column && item.cardLine === line && (item.cardColumn || 0) >= column) {
          return {...item, cardColumn: (item.cardColumn || 0) + 1}
        }
        return item;
      }), {...cardPosition, cardLine: line, cardColumn: column, data: []}];
      setItems(newItems)
    } else {
      const newItems: any = [...items.map(item => {
        if (item.line === line && item.column >= column) {
          return {...item, column: item.column + 1}
        }
        return item;
      }), {line, column, data: []}];
      setItems(newItems)
    }
  }

  function handleAddRow(line, cardTable, cardPosition) {
    if (cardTable) {
      const newItems: any = [...items.map(item => {
        if (item.line === cardPosition.line && item.column === cardPosition.column && (item.cardLine || 0) >= line) {
          return {...item, cardLine: (item.cardLine || 0) + 1}
        }
        return item;
      }), {...cardPosition, cardLine: line, cardColumn: 0, data: []}];
      setItems(newItems)
    } else {
      const newItems: any = [...items.map(item => {
        if (item.line >= line) {
          return {...item, line: item.line + 1}
        }
        return item;
      }), {line, column: 0, data: []}];
      setItems(newItems)
    }
  }

  // function getNextContainerId() {
  //   const containerIds = Object.keys(items);
  //   const lastContainerId = containerIds[containerIds.length - 1];
  //
  //   return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  // }
}

function getColor(item) {
  if (item.disabled) {
    return '#ff4d4f';
  }
  return '#7193f1';
}

function Trash({id}: { id: UniqueIdentifier }) {
  const {setNodeRef, isOver} = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        left: '50%',
        marginLeft: -150,
        bottom: 20,
        width: 300,
        height: 60,
        borderRadius: 5,
        border: '1px solid',
        borderColor: isOver ? 'red' : '#DDD',
      }}
    >
      Drop here to delete
    </div>
  );
}

interface SortableItemProps {
  containerId: string;
  id: string;
  index: number;
  handle: boolean;
  disabled?: boolean;
  cardTable?: boolean;
  item?: any,

  style(args: any): React.CSSProperties;

  getIndex(id: string): number;

  renderItem(): React.ReactElement;

  itemChange: Function;

  wrapperStyle({index}: { index: number }): React.CSSProperties;
}

export const SortableItem = (
  {
    disabled,
    itemChange = () => {
    },
    id,
    index,
    handle,
    renderItem,
    style,
    containerId,
    getIndex,
    item = {},
    cardTable,
    wrapperStyle,
  }: SortableItemProps) => {
  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id,
    data: {...item, cardTable}
  });

  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={item.filedName}
      item={item}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      index={index}
      wrapperStyle={wrapperStyle({index})}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id) : overIndex,
        containerId,
      })}
      itemChange={itemChange}
      color={getColor(item)}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
    />
  );
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
