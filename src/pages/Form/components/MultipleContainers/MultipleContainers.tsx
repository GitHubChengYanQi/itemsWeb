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
import {Button} from "antd";

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

type Items = Record<string, { data: { key: any, filedName: any }[] }>;

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
  console.log(items)

  const [rows, setRows] = useState([0]);

  const [columnsConfig, setColumnsConfig] = useState({});

  const configChange = (newConfig, key) => {
    setColumnsConfig({...columnsConfig, [key]: {...columnsConfig[key], ...newConfig}});
  }

  const [containers, setContainers] = useState(Object.keys(items));

  const [activeId, setActiveId] = useState<any>(null);
  const [activeTitle, setActiveTitle] = useState<any>('');
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;

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
  const findContainer = (id: string) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].data.map(item => item.key).includes(id));
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
        setActiveTitle(current?.value);
        setClonedItems(items);
      }}
      onDragOver={({active, over}) => {
        const overId = over?.id;

        if (!overId || overId === TRASH_ID || active.id in items) {
          return;
        }

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (!overContainer || !activeContainer) {
          return;
        }
        if (activeContainer !== overContainer) {
          setItems((items) => {
            const activeItems = items[activeContainer].data;
            const overItems = items[overContainer].data;
            const overIndex = overItems.map(item => item.key).indexOf(overId);
            const activeIndex = activeItems.map(item => item.key).indexOf(active.id);
            let newIndex: number;

            if (overId in items) {
              newIndex = overItems.length + 1;
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                over.rect.top + over.rect.height;

              const modifier = isBelowOverItem ? 1 : 0;

              newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            recentlyMovedToNewContainer.current = true;

            return {
              ...items,
              [activeContainer]: {
                ...items[activeContainer],
                data: items[activeContainer].data.filter(
                  (item) => item.key !== active.id
                )
              },
              [overContainer]: {
                ...items[overContainer],
                data: [
                  ...items[overContainer].data.slice(0, newIndex),
                  items[activeContainer].data[activeIndex],
                  ...items[overContainer].data.slice(
                    newIndex,
                    items[overContainer].data.length
                  ),
                ]
              },
            };
          });
        }
      }}
      onDragEnd={({active, over}) => {
        if (active.id in items && over?.id) {
          setContainers((containers) => {
            const activeIndex = containers.indexOf(active.id);
            const overIndex = containers.indexOf(over.id);

            return arrayMove(containers, activeIndex, overIndex);
          });
        }

        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
          setActiveId(null);
          return;
        }

        const overId = over?.id;
        if (!overId) {
          setActiveId(null);
          if (active.id === 'card') {
            setItems((items) => ({
              ...items,
              'A': {data: [{key: 'card', filedName: 'Card'}, ...items['A'].data]}
            }));
          }
          return;
        }

        if (overId === TRASH_ID) {
          setItems((items) => ({
            ...items,
            [activeContainer]: {
              ...items[activeContainer],
              data: items[activeContainer].data.filter(
                (id) => id.key !== activeId
              )
            },
          }));
          setActiveId(null);
          return;
        }


        const overContainer = findContainer(overId);

        if (overContainer) {
          const activeIndex = items[activeContainer].data.map(item => item.key).indexOf(active.id);
          const overIndex = items[overContainer].data.map(item => item.key).indexOf(overId);

          if (activeIndex !== overIndex) {
            setItems((items) => ({
              ...items,
              [overContainer]: {
                ...items[overContainer],
                data: arrayMove(
                  items[overContainer].data,
                  activeIndex,
                  overIndex
                )
              },
            }));
          }
        }
        setActiveId(null);
      }
      }
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <div style={{display: 'flex', alignItems: 'flex-start'}}>
        <div style={{minWidth: 350, display: "inline-block"}}>
          <ColumnsConfig
            disabled
            containerId='A'
            index={0}
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
          />
        </div>
        <div style={{flexGrow: 1, height: '90vh', overflow: 'auto', marginLeft: 16}}>
          <TableConfig
            columnsConfig={columnsConfig}
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
            handleAddColumn={handleAddColumn}
            setRows={setRows}
          />
          <Button type='primary'>保存</Button>
        </div>
      </div>

      {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {activeId
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId)
              : renderSortableItemDragOverlay(activeId, activeTitle)
            : null}
        </DragOverlay>,
        document.body
      )}
      {trashable && activeId && !containers.includes(activeId) ? (
        <Trash id={TRASH_ID}/>
      ) : null}
    </DndContext>
  );

  function renderSortableItemDragOverlay(id: string, value: string) {
    return (
      <Item
        value={value}
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

  function renderContainerDragOverlay(containerId: string) {
    return (
      <Container
        label={`Column ${containerId}`}
        columns={columns}
        style={{
          height: '100%',
        }}
        shadow
        unstyled={false}
      >
        {items[containerId].data.map((item, index) => (
          <Item
            key={item.key}
            value={item.filedName}
            handle={handle}
            style={getItemStyles({
              containerId,
              overIndex: -1,
              index: getIndex(item.key),
              value: item.filedName,
              isDragging: false,
              isSorting: false,
              isDragOverlay: false,
            })}
            color={getColor(item.key)}
            wrapperStyle={wrapperStyle({index})}
            renderItem={renderItem}
          />
        ))}
      </Container>
    );
  }


  function handleRemove(containerID: UniqueIdentifier) {
    const newItems = {};
    containers.forEach(item => {
      if (item === containerID) {
        newItems['A'] = {...items['A'], data: [...items[item].data, ...items['A'].data]}
      } else {
        newItems[item] = items[item]
      }
    })
    setContainers((containers) =>
      containers.filter((id) => id !== containerID)
    );
    setItems(newItems)
  }

  function handleAddColumn(index) {
    const newContainerId = getNextContainerId();

    const key = newContainerId + '-' + index
    unstable_batchedUpdates(() => {
      setContainers((containers) => [...containers, key]);
      setColumnsConfig({
        ...columnsConfig, [key]: {
          title: '标题',
          columns: 1,
        }
      });
      setItems((items) => ({
        ...items,
        [key]: {data: []},
      }));
    });
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  }
}

function getColor(id: string
) {
  switch (id[0]) {
    case 'A':
      return '#7193f1';
    case 'B':
      return '#ffda6c';
    case 'C':
      return '#00bcd4';
    case 'D':
      return '#ef769f';
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
  value?: string,

  style(args: any): React.CSSProperties;

  getIndex(id: string): number;

  renderItem(): React.ReactElement;

  wrapperStyle({index}: { index: number }): React.CSSProperties;
}

export const SortableItem = (
  {
    disabled,
    id,
    index,
    handle,
    renderItem,
    style,
    containerId,
    getIndex,
    value,
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
    data: {value}
  });

  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={value}
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
      color={getColor(id)}
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
