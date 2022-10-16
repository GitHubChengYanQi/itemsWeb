import React, {useEffect} from 'react';
import classNames from 'classnames';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

import {Handle, Remove} from './components';

import styles from './Item.module.less';
import {Button, Checkbox, Form, Input, Radio, Select, Typography, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

export interface Props {
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: string;
  item: any;

  onRemove?(): void;

  itemChange: Function;

  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    transform: Props['transform'];
    transition: Props['transition'];
    value: Props['value'];
  }): React.ReactElement;
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        itemChange = () => {
        },
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        item,
        wrapperStyle,
        ...props
      },
      ref
    ) => {

      const inputType = () => {
        switch (item.inputType) {
          case 'input':
            return <Input disabled placeholder='请输入'/>;
          case 'select':
            return <Select disabled placeholder='请选择'/>;
          case 'upload':
            return <Upload disabled>
              <Button icon={<UploadOutlined/>}>上传</Button>
            </Upload>;
          case 'radio':
            return <Radio.Group><Radio>单选1</Radio><Radio>单选2</Radio></Radio.Group>;
          default:
            return <Input disabled placeholder='请输入'/>
        }
      }

      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      return <li
        className={classNames(
          styles.Wrapper,
          fadeIn && styles.fadeIn,
          sorting && styles.sorting,
          dragOverlay && styles.dragOverlay,
        )}
        style={
          {
            ...wrapperStyle,
            transition: [transition, wrapperStyle?.transition]
              .filter(Boolean)
              .join(', '),
            '--translate-x': transform
              ? `${Math.round(transform.x)}px`
              : undefined,
            '--translate-y': transform
              ? `${Math.round(transform.y)}px`
              : undefined,
            '--scale-x': transform?.scaleX
              ? `${transform.scaleX}`
              : undefined,
            '--scale-y': transform?.scaleY
              ? `${transform.scaleY}`
              : undefined,
            '--index': index,
            '--color': !handle && color,
          } as React.CSSProperties
        }
        ref={ref}
      >
        <div
          className={classNames(
            styles.Item,
            dragging && styles.dragging,
            dragOverlay && styles.dragOverlay,
            disabled && styles.disabled,
            color && styles.color,
            handle && styles.handle,
          )}
          style={style}
          data-cypress="draggable-item"
          {...(!handle ? listeners : undefined)}
          {...props}
          tabIndex={!handle ? 0 : undefined}
        >
          {handle ?
            <Form.Item
              style={{margin: 0, flexGrow: 1}}
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label={<><Typography.Paragraph
                style={{margin: 0}}
                editable={{
                  tooltip: '点击自定义字段名',
                  onChange: (filedName) => {
                    itemChange({filedName}, item.key);
                  },
                }}
              >
                {value}
              </Typography.Paragraph><span className='red'>{item.required && '*'}</span></>}>
              {inputType()}
            </Form.Item> : value}
          <span hidden={!handle} className={styles.Actions}>
             <Checkbox
               checked={item.required}
               onChange={({target: {checked}}) => itemChange({required: checked}, item.key)}>必填</Checkbox>
            <Handle {...listeners} />
            </span>
        </div>
      </li>
    }
  )
);
