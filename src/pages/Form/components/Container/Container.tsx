import React, {forwardRef, useState} from 'react';
import classNames from 'classnames';

import {Handle, Remove} from '../Item';

import styles from './Container.module.less';
import {MinusCircleFilled, PlusCircleFilled} from "@ant-design/icons";
import ProCard from "@ant-design/pro-card";
import {Col} from "antd";

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: any;
  style?: React.CSSProperties;
  ulStyle?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  noNandle?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  leftTopHidden?: boolean;
  leftBottomHidden?: boolean;
  topLeftHidden?: boolean;
  topRightHidden?: boolean;
  removeRowHidden?: boolean;
  removeColumnHidden?: boolean;

  onClick?(): void;

  onRemove?(): void;

  onLeftTop?(): void;

  onLeftBottom?(): void;

  onTopLeft?(): void;

  onTopRight?(): void;

  onRemoveRow?(): void;

  onRemoveColumn?(): void;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      removeRowHidden,
      removeColumnHidden,
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      noNandle,
      onLeftTop = () => {
      },
      onLeftBottom = () => {
      },
      onTopLeft = () => {
      },
      onTopRight = () => {
      },
      onRemoveRow = () => {
      },
      onRemoveColumn = () => {
      },
      leftTopHidden,
      leftBottomHidden,
      topLeftHidden,
      topRightHidden,
      ulStyle,
      ...props
    }: Props,
    ref
  ) => {

    const [over, setOver] = useState(true);

    return (
      <Col
        span={parseInt(`${24 / columns}`, 0)}
        {...props}
        ref={ref}
        style={
          {
            ...style,
          } as React.CSSProperties
        }
        className={classNames(
          styles.Container,
          unstyled && styles.unstyled,
          horizontal && styles.horizontal,
          hover && styles.hover,
          placeholder && styles.placeholder,
          scrollable && styles.scrollable,
          shadow && styles.shadow
        )}
        onClick={onClick}
        onMouseOver={() => {
          setOver(false);
        }}
        onMouseOut={() => {
          setOver(true);
        }}
        tabIndex={onClick ? 0 : undefined}
      >
        <div
          hidden={over || leftTopHidden}
          className={classNames(styles.add, styles.leftTop)}
        >
          <PlusCircleFilled onClick={onLeftTop} />
        </div>
        <div
          hidden={over || leftBottomHidden}
          className={classNames(styles.add, styles.leftBottom)}
        >
          <PlusCircleFilled onClick={onLeftBottom} />
        </div>
        <div
          hidden={over || topLeftHidden}
          className={classNames(styles.add, styles.topLeft)}
        >
          <PlusCircleFilled onClick={onTopLeft} />
        </div>
        <div
          hidden={over || topRightHidden}
          className={classNames(styles.add, styles.topRight)}
        >
          <PlusCircleFilled onClick={onTopRight} />
        </div>
        <div
          hidden={over || removeRowHidden}
          className={classNames(styles.add, styles.removeRow)}
        >
          <MinusCircleFilled onClick={onRemoveRow} />
        </div>
        <div
          hidden={over || removeColumnHidden}
          className={classNames(styles.add, styles.removeColumn)}
        >
          <MinusCircleFilled onClick={onRemoveColumn} />
        </div>
        {label ? (
          <ProCard
            bodyStyle={{padding: 0}}
            headerBordered
            className='h2Card'
            title={label}
            extra={<div className={styles.Actions}>
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              {!noNandle && <Handle {...handleProps} />}
            </div>} />
        ) : null}
        <ul style={ulStyle}>{children}</ul>
      </Col>
    );
  }
);
