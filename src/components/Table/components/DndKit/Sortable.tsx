import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

import {
  Announcements,
  closestCenter,
  CollisionDetection,
  DragOverlay,
  DndContext,
  DropAnimation,
  defaultDropAnimation,
  KeyboardSensor,
  KeyboardCoordinateGetter,
  Modifiers,
  MouseSensor,
  MeasuringConfiguration,
  PointerActivationConstraint,
  ScreenReaderInstructions,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  rectSortingStrategy,
  AnimateLayoutChanges,
} from '@dnd-kit/sortable';

import {Wrapper} from './Wrapper';
import {List} from './List';
import {Item} from './Item';

export interface ItemData {
  key: string;
  title: string;
  visible?: boolean;
  checked?: boolean;
  align?: string;
}


export interface Props {
  activationConstraint?: PointerActivationConstraint;
  animateLayoutChanges?: AnimateLayoutChanges;
  adjustScale?: boolean;
  liBorder?: boolean;
  collisionDetection?: CollisionDetection;
  coordinateGetter?: KeyboardCoordinateGetter;
  Container?: any; // To-do: Fix me
  dropAnimation?: DropAnimation | null;
  handle?: boolean;
  itemCount?: number;
  items?: ItemData[];
  measuring?: MeasuringConfiguration;
  modifiers?: Modifiers;
  renderItem?: any;
  removable?: boolean;
  reorderItems?: typeof arrayMove;
  strategy?: SortingStrategy;
  definedItem?: Function,
  style?: React.CSSProperties;
  useDragOverlay?: boolean;
  onDragEnd?: Function;
  onChecked?: Function;
  onAlign?: Function;
  refresh?: Boolean;

  getItemStyles: ({}) => {};

  wrapperStyle: ({}) => {};

  isDisabled: () => {};
}

const defaultDropAnimationConfig: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
};


export function Sortable(
  {
    activationConstraint,
    animateLayoutChanges,
    adjustScale = false,
    Container = List,
    collisionDetection = closestCenter,
    coordinateGetter = sortableKeyboardCoordinates,
    dropAnimation = defaultDropAnimationConfig,
    getItemStyles = () => ({}),
    handle = false,
    items: initialItems,
    measuring,
    liBorder,
    onDragEnd = () => {
    },
    modifiers,
    refresh,
    onChecked = () => {
    },
    onAlign = () => {
    },
    renderItem,
    reorderItems = arrayMove,
    strategy = rectSortingStrategy,
    style,
    definedItem,
    useDragOverlay = true,
    wrapperStyle = (object) => ({}),
  }: Props) {

  const [items, setItems] = useState<ItemData[]>(initialItems || []);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );
  const isFirstAnnouncement = useRef(true);

  const getIndex = (key) => {
    let current = -1;
    items.map((item, index) => {
      if (item.key === key) {
        current = index;
      }
      return null;
    });
    return current;
  };
  const getPosition = (id: string) => getIndex(id) + 1;

  const activeIndex = activeId ? getIndex(activeId) : -1;

  const announcements: Announcements = {
    onDragStart(id) {
      return `Picked up sortable item ${id}. Sortable item ${id} is in position ${getPosition(
        id
      )} of ${items.length}`;
    },
    onDragOver(id, overId) {
      // In this specific use-case, the picked up item's `id` is always the same as the first `over` id.
      // The first `onDragOver` event therefore doesn't need to be announced, because it is called
      // immediately after the `onDragStart` announcement and is redundant.
      if (isFirstAnnouncement.current === true) {
        isFirstAnnouncement.current = false;
        return;
      }

      if (overId) {
        return `Sortable item ${id} was moved into position ${getPosition(
          overId
        )} of ${items.length}`;
      }

      return '';
    },
    onDragEnd(id, overId) {
      if (overId) {
        return `Sortable item ${id} was dropped at position ${getPosition(
          overId
        )} of ${items.length}`;
      }

      return '';
    },
    onDragCancel(id) {
      return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
        id
      )} of ${items.length}.`;
    },
  };

  useEffect(() => {
    setItems(initialItems || []);
  }, [refresh]);

  useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  return (
    <DndContext
      announcements={announcements}
      screenReaderInstructions={screenReaderInstructions}
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={({active}) => {
        if (!active) {
          return;
        }
        setActiveId(active.id);
      }}
      onDragEnd={({over}) => {
        setActiveId(null);
        if (over) {
          const overIndex = getIndex(over.id);
          if (activeIndex !== overIndex) {
            const itemData = (items) => {
              return reorderItems(items, activeIndex, overIndex);
            };
            onDragEnd(itemData(items), activeIndex, overIndex);
            setItems((items) => reorderItems(items, activeIndex, overIndex));
          }
        }
      }}
      onDragCancel={() => {
        setActiveId(null);
      }}
      measuring={measuring}
      modifiers={modifiers}
    >
      <Wrapper style={style} center>
        <SortableContext items={items.map((item) => {
          return item.key;
        })} strategy={strategy}>
          <Container>
            {items.map((value, index) => {
              if (value.visible) {
                return null;
              }
              return <SortableItem
                align={value.align}
                liBorder={liBorder}
                key={index}
                definedItem={definedItem}
                onChecked={(key) => {
                  const array = items.map((item) => {
                    if (item.key === key) {
                      return {
                        ...item,
                        checked: !item.checked,
                      };
                    } else {
                      return item;
                    }
                  });
                  onChecked(key, index);
                  setItems(array);
                }}
                onAlign={(key,value) => {
                  const array = items.map((item) => {
                    if (item.key === key) {
                      return {
                        ...item,
                        align: value,
                      };
                    } else {
                      return item;
                    }
                  });
                  onAlign(key, value);
                  setItems(array);
                }}
                id={value.key}
                title={value.title}
                itemData={items}
                item={value}
                handle={handle}
                index={index}
                checked={value.checked || false}
                style={getItemStyles}
                wrapperStyle={wrapperStyle}
                renderItem={renderItem}
                animateLayoutChanges={animateLayoutChanges}
                useDragOverlay={useDragOverlay}
              />;
            })}
          </Container>
        </SortableContext>
      </Wrapper>
      {useDragOverlay
        ? createPortal(
          <DragOverlay
            adjustScale={adjustScale}
            dropAnimation={dropAnimation}
          >
            {activeId ? (
              <Item
                keys={items[activeIndex].key}
                value={items[activeIndex].title}
                handle={handle}
                checked={items[activeIndex].checked}
                renderItem={renderItem}
                wrapperStyle={wrapperStyle({
                  index: activeIndex,
                  isDragging: true,
                  id: items[activeIndex].title,
                })}
                style={getItemStyles({
                  id: items[activeIndex].title,
                  index: activeIndex,
                  isSorting: true,
                  isDragging: true,
                  overIndex: -1,
                  isDragOverlay: true,
                })}
                dragOverlay
              />
            ) : null}
          </DragOverlay>,
          document.body
        )
        : null}
    </DndContext>
  );
}

interface SortableItemProps {
  animateLayoutChanges?: AnimateLayoutChanges;
  disabled?: boolean;
  liBorder?: boolean;
  id: string;
  item: Object,
  index: number;
  definedItem?: Function,
  handle: boolean;
  checked: boolean;
  useDragOverlay?: boolean;
  title: string;
  align?: string;
  itemData: ItemData[];
  onChecked: Function;
  onAlign: Function;

  style(values: any): React.CSSProperties;

  renderItem(args: any): React.ReactElement;

  wrapperStyle: ({}) => {};
}

export function SortableItem(
  {
    title,
    item,
    disabled,
    animateLayoutChanges,
    handle,
    id,
    itemData,
    definedItem,
    index,
    style,
    onChecked,
    liBorder,
    onAlign,
    align,
    checked,
    renderItem,
    useDragOverlay,
    wrapperStyle,
  }: SortableItemProps) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
    disabled,
  });
  return (
    <Item
      ref={setNodeRef}
      liBorder={liBorder}
      definedItem={definedItem}
      value={title}
      item={item}
      onChecked={onChecked}
      onAlign={onAlign}
      keys={id}
      itemData={itemData}
      align={align}
      checked={checked}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      renderItem={renderItem}
      index={index}
      style={style({
        index,
        id,
        isDragging,
        isSorting,
        overIndex,
      })}
      transform={transform}
      transition={transition}
      wrapperStyle={wrapperStyle({index, isDragging, id})}
      listeners={listeners}
      data-index={index}
      data-id={id}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
    />
  );
}
