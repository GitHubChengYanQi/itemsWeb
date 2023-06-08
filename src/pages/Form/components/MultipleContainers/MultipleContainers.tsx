import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {
  CancelDrop,
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
  UniqueIdentifier,
  useSensors,
  useSensor,
  MeasuringStrategy,
  KeyboardCoordinateGetter,
} from '@dnd-kit/core';
import {
  AnimateLayoutChanges,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
  sortableKeyboardCoordinates,
  SortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Affix, Button, Checkbox, InputNumber, Modal, Select, Space, Steps, Tabs, Typography} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import ColumnsConfig from '../ColumnsConfig';
import TableConfig from '../TableConfig';
import wxHead from '../../../../asseset/imgs/wxHead.png';

import {Item} from '../Item';
import {Container, ContainerProps} from '../Container';
import {isObject} from '@/util/Tools';

export default {
  title: 'Presets/Sortable/Multiple Containers',
};


const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
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

  if (disabled) {
    return <Container
      style={style}
      columns={columns}
      {...props}
    >
      {children}
    </Container>;
  }

  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container') ||
    items.includes(`${over.id}`)
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
    step: number;
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

  getItemStyles?: (styles: any) => {};

  wrapperStyle?: (styles: any) => {};
  onSave: (data: any, waitFileds: any) => void;
  onPreview: (data: any) => void;
  setModule: (data: any) => {};

  itemCount?: number;
  width?: number;
  gutter?: number;
  widthUnit?: string;
  module?: string;
  items: Items;
  initSteps: any;
  handle?: boolean;
  renderItem?: any;
  strategy?: SortingStrategy;
  modifiers?: Modifiers;
  minimal?: boolean;
  trashable?: boolean;
  scrollable?: boolean;
  vertical?: boolean;
  report?: boolean;
}

export const TRASH_ID = 'void';

export function MultipleContainers(
  {
    onPreview = () => {
    },
    adjustScale = false,
    handle = false,
    items: defaultItems,
    coordinateGetter = sortableKeyboardCoordinates,
    getItemStyles = () => ({}),
    wrapperStyle = () => ({}),
    onSave = () => {
    },
    renderItem,
    initSteps = [],
    width: defaultWidth,
    gutter: defaultGutter,
    widthUnit: defaultWidthUnit,
    module,
    report,
    setModule,
  }: Props) {

  const [items, setItems] = useState<Items>(defaultItems);

  const [steps, setSteps] = useState(initSteps);

  const [delStep, setDelStep] = useState<number | undefined>();

  const mobile = report || module === 'mobile';

  const [width, setWidth] = useState(defaultWidth || 100);
  const [gutter, setGutter] = useState(defaultGutter || 16);
  const [widthUnit, setWidthUnit] = useState(defaultWidthUnit || '%');

  const [activeId, setActiveId] = useState<any>(null);
  const [active, setActive] = useState<any>({});
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const [currentStep, setCurrentStep] = useState(0);

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

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
          pointerIntersections
          : rectIntersection(args);
      const overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
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
  // const [clonedItems, setClonedItems] = useState<Items | null>(null);
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
    items.find((item, index) => {
      if (
        position.length === 4
        &&
        `${item.line}` === position[0]
        &&
        `${item.column}` === position[1]
        &&
        `${item.cardLine}` === position[2]
        &&
        `${item.cardColumn}` === position[3]
      ) {
        idIndex = index;
        return true;
      } else if (position.length === 2 && `${item.line}` === position[0] && `${item.column}` === position[1]) {
        idIndex = index;
        return true;
      } else {
        return item.data.find((item) => {
          if (item.key === id) {
            currentIndex = index;
            return true;
          }
          return false;
        });
      }

    });

    if (typeof currentIndex !== 'number') {
      return idIndex;
    }
    return currentIndex;
  };

  const getTable = (data: any = []) => {
    const submitData: any = [];
    data.forEach((item) => {
      let column: any = item;
      if (item.card) {
        const table: any = [];
        const cardTable = data.filter(cardItems => {
          return cardItems.line === item.line && cardItems.column === item.column && cardItems.cardTable;
        });
        cardTable.forEach((item) => {
          if (table[item.cardLine || 0]) {
            const columns = [...table[item.cardLine || 0], item];
            table[item.cardLine || 0] = columns.sort((a, b) => a.cardColumn - b.cardColumn);
          } else {
            table[item.cardLine || 0] = [item];
          }
        });
        column = {
          ...item,
          table: table.slice(1, table.length),
        };
      }
      if (!item.cardTable) {
        if (submitData[item.line]) {
          const columns = [...submitData[item.line], column];
          submitData[item.line] = columns.sort((a, b) => a.column - b.column);
        } else {
          submitData[item.line] = [column];
        }
      }
    });
    return submitData.slice(1, submitData.length);
  };

  const submit = () => {
    return {
      width,
      widthUnit,
      gutter,
      steps: steps.map((item, index) => {
        if (index === currentStep) {
          return {...item, data: getTable(items.filter((item, index) => index !== 0))};
        }
        return {
          ...item,
          data: getTable(item.data)
        };
      })
    };
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  const endItemsChange = ({active, activeContainer, newItems, cardPosition}) => {
    const array: any = (active.id === 'card' && activeContainer !== 0) ? [...newItems.map((item, index) => {
      if (index === 0) {
        return {...item, data: [{key: 'card', filedName: 'Card'}, ...item.data]};
      }
      return item;
    }), {
      ...cardPosition,
      cardLine: 1,
      cardColumn: 0,
      cardTable: true,
      data: cardPosition.data.filter(item => item.key !== 'card')
    }] : newItems;
    setItems(array);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={({active: {id, data: {current}}}) => {
          // debugger;
          setActiveId(id);
          setActive(current);
          // setClonedItems(items);
        }}
        onDragOver={({active, over}) => {
          const overId = over?.id;
          if (overId === active.id) {
            return;
          }
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

            const isBelowOverItem =
              over &&
              active.rect.current.translated &&
              active.rect.current.translated.top >
              over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;

            const newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;

            recentlyMovedToNewContainer.current = true;
            const newItems: any = items.map((item, index) => {
              if (index === activeContainer) {
                return {
                  ...item,
                  data: item.data.filter(
                    (item) => item.key !== active.id
                  )
                };
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
                };
              } else {
                return item;
              }
            });
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
                  return {...item, card: true, data: []};
                }
                return item;
              });
              const array: any = [...newItems.map((item, index) => {
                if (index === 0) {
                  return {...item, data: [{key: 'card', filedName: 'Card'}, ...item.data]};
                }
                return item;
              }), {
                ...cardPosition,
                cardLine: 1,
                cardColumn: 0,
                cardTable: true,
                data: cardPosition.data.filter(item => item.key !== 'card')
              }];
              setItems(array);
            }
            return;
          }
          if (overId === TRASH_ID) {
            let cardPosition: any = {};
            const newItems = items.map((item, index) => {
              if ((active.id === 'card' && activeContainer !== 0) && index === overContainer) {
                cardPosition = item;
                return {...item, card: true, data: []};
              }
              if (index === activeContainer) {
                return {
                  ...item,
                  data: item.data.filter((id) => id.key !== activeId)
                };
              }
              return item;
            });
            endItemsChange({active, newItems, activeContainer, cardPosition});
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
                  };
                }
                return item;
              });
              endItemsChange({active, newItems, activeContainer, cardPosition});
            } else if (active.id === 'card' && activeContainer !== 0) {
              let cardPosition: any = {};
              const newItems = items.map((item, index) => {
                if (index === overContainer) {
                  cardPosition = item;
                  return {...item, card: true, data: []};
                }
                return item;
              });

              const array: any = [...newItems.map((item, index) => {
                if (index === 0) {
                  return {...item, data: [{key: 'card', filedName: 'Card'}, ...item.data]};
                }
                return item;
              }), {
                ...cardPosition,
                cardLine: 1,
                cardColumn: 0,
                cardTable: true,
                data: cardPosition.data.filter(item => item.key !== 'card')
              }];
              setItems(array);
            }
            setActiveId(null);
          }
        }}
        // cancelDrop={cancelDrop}
        // onDragCancel={onDragCancel}
        // modifiers={modifiers}
      >
        {createPortal(
          <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
            {activeId ? renderSortableItemDragOverlay(activeId, active) : null}
          </DragOverlay>,
          document.body
        )}
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
          <div style={{minWidth: 350, padding: '16px 0', display: 'inline-block'}}>
            <ColumnsConfig
              report={false}
              activeId={activeId}
              mobile={mobile}
              item
              column
              itemChange={() => {
              }}
              configChange={() => {
              }}
              line
              containerStyle
              cardTable
              table
              gutter
              handleAddColumn
              handleRemoveColumn
              handleAddRow
              handleRemoveRow
              onUp={() => {
              }}
              onDown={() => {
              }}
              ulStyle={{padding: 16}}
              card={false}
              fixedFileds
              containerId={0}
              id='0-0'
              items={items}
              columns={items}
              handleRemove={() => {
              }}
            />
          </div>
          <div style={{
            flexGrow: 1,
            height: 'calc(100vh - 176px)',
            overflow: 'hidden',
            padding: '20px 40px'
          }}>
            {!report && <>
              <Tabs
                tabBarExtraContent={
                  <div>
                    <Space align='center' size={16}>
                      <Space>
                        页面宽:
                        <InputNumber
                          min={30}
                          disabled={mobile}
                          value={width}
                          onChange={(number) => setWidth(number)}
                          addonAfter={<Select
                            disabled={mobile}
                            value={widthUnit}
                            onChange={(number) => setWidthUnit(number)}
                            options={[{label: '%', value: '%'}, {label: 'vw', value: 'vw'}, {
                              label: 'px',
                              value: 'px'
                            },]}
                          />}
                        />
                      </Space>

                      <Space>
                        间距:
                        <InputNumber
                          disabled={mobile}
                          max={100}
                          min={8}
                          value={gutter}
                          onChange={(number) => setGutter(number)}
                          addonAfter='px'
                        />
                      </Space>

                      <Button onClick={() => {
                        setSteps([...steps, {
                          data: [{step: steps.length, line: 1, column: 0, data: []}],
                          type: 'edit',
                          title: ''
                        }]);
                      }}>增加步骤</Button>
                    </Space>
                  </div>
                }
                activeKey={module}
                items={[{key: 'pc', label: 'PC端'}, {key: 'mobile', label: '移动端'}]}
                onChange={setModule}
              />
              <div hidden={steps.length === 1} style={{marginBottom: 24}}>
                <Steps
                  current={currentStep}
                  onChange={(step) => {
                    const newSteps: any = steps.map((item, index) => {
                      if (index === currentStep) {
                        return {...item, data: items.filter((item, index) => index !== 0)};
                      }
                      return item;
                    });
                    setSteps(newSteps);
                    const newItems: any = [items[0], ...steps[step].data];
                    setItems(newItems);
                    setCurrentStep(step);
                  }}>
                  {
                    steps.map((item, index) => {
                      return <Steps.Step
                        title={<div>
                          <Typography.Paragraph
                            style={{margin: '0 8px', display: 'inline-block'}}
                            editable={{
                              tooltip: '点击自定义步骤名',
                              onChange: (filedName) => {
                                const newSteps = steps.map((stepItem, stepIndex) => {
                                  if (stepIndex === index) {
                                    return {...stepItem, title: filedName};
                                  }
                                  return stepItem;
                                });
                                setSteps(newSteps);
                              },
                            }}
                          >
                            {item.title || `步骤${index + 1}`}
                          </Typography.Paragraph>
                          <Button onClick={() => {
                            setDelStep(index);
                          }} type='link' danger><DeleteOutlined /></Button>
                        </div>}
                        key={index}
                        description={<Space align='center'>保存表单内容<Checkbox
                          checked={item.type === 'add'}
                          style={{color: 'rgba(0,0,0,0.5)'}}
                          onChange={({target: {checked}}) => {
                            if (!checked) {
                              return;
                            }
                            const newSteps = steps.map((item, stepIndex) => {
                              if (stepIndex === index) {
                                return {...item, type: 'add'};
                              }
                              return {...item, type: 'edit'};
                            });
                            setSteps(newSteps);
                          }}
                        /></Space>} />;
                    })
                  }
                </Steps>
              </div>
            </>}


            <div
              style={{
                width: mobile ? 400 : '100%',
                margin: 'auto',
                height: 'calc(100vh - 276px)',
                overflow: mobile ? 'hidden' : 'auto',
                padding: mobile ? '0' : '24px 0',
                boxShadow: mobile ? '0 0 14px 0 rgba(0, 0 ,0 , 10%)' : '',
                background: mobile ? '#E1EBF6' : '#fff',
                maxHeight: mobile ? 800 : 'calc(100vh - 276px)'
              }}
            >
              {mobile && <img
                src={wxHead}
                width={400}
                style={{position: 'sticky', top: 0, zIndex: 1}} alt=''
              />}
              <div style={{
                padding: mobile ? 8 : 0,
                height: 'calc(100vh - 360px)',
                overflow: 'auto',
                maxHeight: mobile ? 700 : 'calc(100vh - 360px)'
              }}>
                <TableConfig
                  report={report}
                  activeId={activeId}
                  mobile={mobile}
                  position={{}}
                  onUp={onUp}
                  onDown={onDown}
                  configChange={configChange}
                  gutter={gutter}
                  widthUnit={widthUnit}
                  handleRemove={handleRemoveCard}
                  card={false}
                  width={mobile ? '100%' : width}
                  items={items}
                  handleAddColumn={handleAddColumn}
                  handleAddRow={handleAddRow}
                  handleRemoveRow={handleRemoveRow}
                  handleRemoveColumn={handleRemoveColumn}
                  itemChange={itemChange}
                />
              </div>
            </div>
          </div>
        </div>
      </DndContext>
      <Affix offsetBottom={0}>
        <div
          style={{
            height: 47,
            borderTop: '1px solid #e7e7e7',
            background: '#fff',
            textAlign: 'right',
            paddingTop: 8
          }}
        >
          <Space>
            <Button hidden={report} disabled={module === 'mobile'} onClick={() => onPreview(submit())}>预览</Button>
            <Button type='primary' onClick={() => {
              onSave(submit(), items[0]?.data);
            }}>保存</Button>
          </Space>
        </div>
      </Affix>
      <Modal
        bodyStyle={{padding: 32}}
        footer={null}
        open={typeof delStep === 'number'}
        centered
        closable={false}
      >
        <div>
          确认删除步骤?
          <div style={{textAlign: 'right', marginTop: 24}}>
            <Space>
              <Button onClick={() => setDelStep(undefined)}>取消</Button>
              <Button type='primary' onClick={() => {
                const files: any = [];
                items.forEach((item, index) => {
                  if (index === 0) {
                    return;
                  }
                  item.data.forEach(item => {
                    files.push(item);
                  });
                });
                const newSteps: any = steps.filter((item, stepIndex) => stepIndex !== delStep);
                setSteps(newSteps);
                const currentIndex = newSteps[(delStep || 0)] ? delStep : (delStep || 0) - 1;
                const newItems: any = [{
                  ...items[0],
                  data: [...files, ...items[0].data]
                }, ...newSteps[(currentIndex || 0)].data];
                setItems(newItems);
                setCurrentStep((currentIndex || 0));
                setDelStep(undefined);
              }}>确认</Button>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  );

  function renderSortableItemDragOverlay(id: string, active: any) {
    return (
      <Item
        item={active}
        value={active.filedName}
        handle={handle}
        style={getItemStyles({
          containerId: findContainer(id),
          overIndex: -1,
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
          files.push(item);
        });
        if (item.card) {
          newItems.push({...item, data: [], card: false});
        }
        return;
      }
      newItems.push(item);
    });
    const array = newItems.map((item, index) => {
      if (index === 0) {
        return {...item, data: [...files, ...item.data]};
      }
      return item;
    });
    setItems(array);
  }

  function handleRemoveRow(line, cardTable, cardPosition) {
    const files: any = [];
    const newItems: any = [];
    items.forEach(item => {
      if (cardTable) {
        if (item.line === cardPosition.line && item.column === cardPosition.column) {
          if (item.cardLine === line) {
            item.data.forEach(item => {
              files.push(item);
            });
            return;
          } else if ((item.cardLine || 0) > line) {
            newItems.push({...item, cardLine: (item.cardLine || 0) - 1});
            return;
          }
          newItems.push(item);
          return;
        }
        newItems.push(item);
      } else {
        if (item.line === line) {
          item.data.forEach(item => {
            files.push(item);
          });
          return;
        } else if (item.line > line) {
          newItems.push({...item, line: item.line - 1});
          return;
        }
        newItems.push(item);
      }
    });
    const array = newItems.map((item, index) => {
      if (index === 0) {
        return {...item, data: [...files, ...item.data]};
      }
      return item;
    });
    setItems(array);
  }

  function onUp(line, card, position) {
    const newItems: any = items.map(item => {
      if (card ? (item.cardLine === line && item.line === position.line && item.column === position.column) : item.line === line) {
        return card ? {...item, cardLine: line - 1} : {...item, line: item.line - 1};
      } else if (card ? ((item.cardLine || 0) === line - 1 && item.line === position.line && item.column === position.column) : item.line === (line - 1)) {
        return card ? {...item, cardLine: (item.cardLine || 0) + 1} : {...item, line: item.line + 1};
      }
      return item;
    });
    setItems(newItems);
  }

  function onDown(line, card, position) {
    const newItems: any = items.map(item => {
      if (card ? (item.cardLine === line && item.line === position.line && item.column === position.column) : item.line === line) {
        return card ? {...item, cardLine: line + 1} : {...item, line: item.line + 1};
      } else if (card ? (item.cardLine === line + 1 && item.line === position.line && item.column === position.column) : item.line === line + 1) {
        return card ? {...item, cardLine: line} : {...item, line};
      }
      return item;
    });
    setItems(newItems);
  }

  function configChange(newData, line, column) {
    const newItems: any = items.map(item => {
      if (item.line === line && item.column === column && item.card) {
        return {...item, ...newData};
      }
      return item;
    });
    setItems(newItems);
  }

  function itemChange(newData, filed, position) {
    const newItems: any = items.map(item => {
      if (item.line === position.line && item.column === position.column && (position.cardTable ? (item.cardLine === position.cardLine && item.cardColumn === position.cardColumn) : true)) {
        const data = item.data || [];
        const newArray = data.map(item => {
          if (item.key === filed) {
            return {...item, ...newData};
          }
          return item;
        });
        return {...item, data: newArray};
      }
      return item;
    });
    setItems(newItems);
  }

  function handleRemoveColumn(line, column, cardTable, cardPosition) {
    const files: any = [];
    const newItems: any = [];
    items.forEach(item => {
      if (cardTable) {
        if (item.line === cardPosition.line && item.column === cardPosition.column) {
          if (item.cardLine === line && item.cardColumn === column) {
            item.data.forEach(item => {
              files.push(item);
            });
            return;
          } else if (item.cardLine === line && (item.cardColumn || 0) > column) {
            newItems.push({...item, cardColumn: (item.cardColumn || 0) - 1});
            return;
          }
          const columns = items.filter(item => item.line === cardPosition.line && item.column === cardPosition.column && item.cardLine === line);
          if (columns.length === 1 && (item.cardLine || 0) > line) {
            newItems.push({...item, cardLine: (item.cardLine || 0) - 1});
          } else {
            newItems.push(item);
          }
          return;
        }
        newItems.push(item);
      } else {
        if (item.line === line && item.column === column) {
          item.data.forEach(item => {
            files.push(item);
          });
          return;
        } else if (item.line === line && item.column > column) {
          newItems.push({...item, column: item.column - 1});
          return;
        }
        const columns = items.filter(item => item.line === line);
        if (columns.length === 1 && item.line > line) {
          newItems.push({...item, line: item.line - 1});
        } else {
          newItems.push(item);
        }
      }
    });
    const array = newItems.map((item, index) => {
      if (index === 0) {
        return {...item, data: [...files, ...item.data]};
      }
      return item;
    });
    setItems(array);
  }

  function handleAddColumn(line, column, cardTable, cardPosition) {
    if (cardTable) {
      const newItems: any = [...items.map(item => {
        if (item.line === cardPosition.line && item.column === cardPosition.column && item.cardLine === line && (item.cardColumn || 0) >= column) {
          return {...item, cardColumn: (item.cardColumn || 0) + 1};
        }
        return item;
      }), {...cardPosition, cardLine: line, cardColumn: column, data: []}];
      setItems(newItems);
    } else {
      const newItems: any = [...items.map(item => {
        if (item.line === line && item.column >= column) {
          return {...item, column: item.column + 1};
        }
        return item;
      }), {step: currentStep, line, column, data: []}];
      setItems(newItems);
    }
  }

  function handleAddRow(line, cardTable, cardPosition) {
    if (cardTable) {
      const newItems: any = [...items.map(item => {
        if (item.line === cardPosition.line && item.column === cardPosition.column && (item.cardLine || 0) >= line) {
          return {...item, cardLine: (item.cardLine || 0) + 1};
        }
        return item;
      }), {...cardPosition, cardLine: line, cardColumn: 0, data: []}];
      setItems(newItems);
    } else {
      const newItems: any = [...items.map(item => {
        if (item.line >= line) {
          return {...item, line: item.line + 1};
        }
        return item;
      }), {step: currentStep, line, column: 0, data: []}];
      setItems(newItems);
    }
  }
}

function getColor(item) {
  if (item.disabled) {
    return '#ff4d4f';
  }
  return '#7193f1';
}

interface SortableItemProps {
  containerId: string;
  id: string;
  index: number;
  handle: boolean;
  disabled?: boolean;
  cardTable?: boolean;
  mobile?: boolean;
  fixedFileds?: boolean;
  report?: boolean;
  item?: any,
  activeId?: any,

  style(args: any): React.CSSProperties;

  getIndex(id: string): number;

  itemChange: Function;
}

export const SortableItem = memo((
  {
    report,
    activeId,
    itemChange = () => {
    },
    id,
    index,
    handle,
    mobile,
    item = {},
    cardTable,
    fixedFileds,
  }: SortableItemProps) => {

  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    transform,
    transition,
  } = useSortable({
    id,
    data: {...item, cardTable},
  });

  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      report={report}
      key={id}
      mobile={mobile}
      ref={setNodeRef}
      value={item.filedName}
      item={item}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      index={index}
      itemChange={itemChange}
      color={getColor(item)}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
    />
  );
});

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
