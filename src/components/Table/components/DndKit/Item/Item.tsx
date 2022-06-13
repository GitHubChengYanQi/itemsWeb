import React, {useEffect} from 'react';
import classNames from 'classnames';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

import {Handle} from './components';

// @ts-ignore
import styles from "./Item.module.scss";
import {Space} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import {ItemData} from "../Sortable";

export interface Props {
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  item?: object;
  dragging?: boolean;
  liBorder?: boolean;
  handle?: boolean;
  height?: number;
  definedItem?: Function,
  index?: number;
  checked?: boolean;
  itemData?: ItemData[];
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: React.ReactNode;
  keys: React.ReactNode;
  onChecked?: Function;

  onRemove?: Function;

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
        keys,
        color,
        item,
        dragOverlay,
        dragging,
        disabled,
        itemData,
        liBorder,
        onChecked = () => {
        },
        fadeIn,
        handle,
        definedItem,
        height,
        checked,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        ...props
      },
      ref
    ) => {

      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value,
        })
      ) : (
        <li
          onClick={() => {
            onChecked(keys, item, index);
          }}
          className={classNames(
            styles.Wrapper,
            fadeIn && styles.fadeIn,
            sorting && styles.sorting,
            dragOverlay && styles.dragOverlay,
            liBorder && styles.border,
          )}
          style={
            {
              ...wrapperStyle,
              cursor: 'pointer',
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
              '--color': color,
            } as React.CSSProperties
          }
          ref={ref}
        >
          <div
            className={classNames(
              styles.Item,
              dragging && styles.dragging,
              handle && styles.withHandle,
              dragOverlay && styles.dragOverlay,
              disabled && styles.disabled,
              color && styles.color
            )}
            style={style}
            data-cypress="draggable-item"
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            {
              definedItem
                ?
                definedItem({...listeners,value,item,index})
                :
                <>
                  <Space>
                    <span className={styles.Actions}>
                 {handle ? <Handle {...listeners} /> : null}
                      </span>
                    {value}
                  </Space>
                  <div
                    style={{
                      display: 'flex',
                      alignSelf: 'flexStart',
                      marginLeft: 'auto',
                      marginRight: 10,
                    }}
                  >
                    {checked && <CheckOutlined/>}
                  </div>
                </>

            }
          </div>
        </li>
      );
    }
  )
);
