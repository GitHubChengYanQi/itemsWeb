import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

import {Handle, Remove} from './components';

import styles from './Item.module.less';
import {Button, Checkbox, DatePicker, Form, Input, Radio, Select, Space, Typography, Upload} from "antd";
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
  report?: boolean;
  mobile?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: string;
  item: any;

  onRemove:()=>{},

  itemChange?: Function;

  renderItem:()=>{

  }
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        report,
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
        mobile,
        wrapperStyle,
        ...props
      },
      ref
    ) => {

      const [clientWidth, setClientWidth] = useState(0)

      const inputType = () => {
        switch (item.inputType) {
          case 'input':
            return <Input disabled placeholder='请输入' />;
          case 'date':
            return <DatePicker disabled />;
          case 'select':
            return <Select disabled placeholder='请选择' />;
          case 'upload':
            return <Upload disabled>
              <Button icon={<UploadOutlined />}>上传</Button>
            </Upload>;
          case 'radio':
            return <Radio.Group><Radio>单选1</Radio><Radio>单选2</Radio></Radio.Group>;
          default:
            return <Input disabled placeholder='请输入' />
        }
      }

      const label = () => {
        return <div style={{flexGrow: 1, marginLeft: 16}}>
          <Typography.Paragraph
            style={{margin: 0, display: 'inline-block', maxWidth: clientWidth / 2}}
            ellipsis
            editable={{
              tooltip: '点击自定义字段名',
              onChange: (filedName) => {
                itemChange({filedName}, item.key);
              },
            }}
          >
            {value}
          </Typography.Paragraph>
          <span className='red'>{item.required && '*'}</span>
        </div>
      }

      useEffect(() => {
        setClientWidth(document.getElementById(`formItem${item.key}`)?.clientWidth || 0)
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      return <li
        key={index}
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
           <span hidden={!handle || disabled || report} className={styles.Actions}>
            <Handle {...listeners} />
            </span>
          <div id={`formItem${item.key}`} style={{width: '100%'}}>
            {handle ? (
                mobile ? label() : <Form.Item
                  className={styles.formItem}
                  style={{margin: 0, flexGrow: 1}}
                  labelCol={{span: 12}}
                  wrapperCol={{span: 12}}
                  label={label()}>
                  {inputType()}
                </Form.Item>
              )
              : value}
          </div>
          {handle && !report && <Checkbox
            disabled={item.disabled}
            style={{padding: '0 0 0 12px'}}
            checked={item.required}
            onChange={({target: {checked}}) => itemChange({required: checked}, item.key)}
          >必填</Checkbox>}
          <span style={{paddingRight: 12}} hidden={!report} className={styles.Actions}>
            <Handle {...listeners} />
            </span>
        </div>
      </li>
    }
  )
);
