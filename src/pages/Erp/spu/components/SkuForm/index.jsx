import React, {useEffect, useState} from 'react';
import {message, Switch, Table, Typography} from 'antd';
import {MenuOutlined} from '@ant-design/icons';
import {arrayMoveImmutable} from 'array-move';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import styles from './index.less';

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: 'grab',
      color: '#999',
    }}
  />
));

const data = [
  {key: 'standard', filedName: '物料编码', describe: '物料唯一标识符', show: true, defaultShow: true, disabled: true},
  {key: 'spuClass', filedName: '物料分类', describe: '物料分类', show: true, defaultShow: true, disabled: true},
  {key: 'spu', filedName: '产品名称', show: true, defaultShow: true, disabled: true},
  {key: 'spuCoding', filedName: '产品码', show: true, defaultShow: true, disabled: true},
  {key: 'unitId', filedName: '单位', show: true, defaultShow: true},
  {key: 'batch', filedName: '二维码生成方式', show: true, defaultShow: true},
  {key: 'specifications', filedName: '规格', show: true,},
  {key: 'maintenancePeriod', filedName: '养护周期', show: true,},
  {key: 'sku', filedName: '物料描述', show: true,},
  {key: 'brandIds', filedName: '品牌', show: true,},
  {key: 'images', filedName: '图片', show: true,},
  {key: 'drawing', filedName: '图纸', show: true,},
  {key: 'fileId', filedName: '附件', show: true,},
  {key: 'nationalStandard', filedName: '国家标准', show: false,},
  {key: 'skuName', filedName: '型号', show: false,},
  {key: 'partNo', filedName: '零件号', show: false,},
  {key: 'materialId', filedName: '材质', show: true,},
  {key: 'weight', filedName: '重量', show: true,},
  {key: 'skuSize', filedName: '尺寸', show: true,},
  {key: 'color', filedName: '表色', show: true,},
  {key: 'level', filedName: '级别', show: true,},
  {key: 'heatTreatment', filedName: '热处理', show: true,},
  {key: 'remarks', filedName: '备注', show: true,},
];

const SortableBody = SortableContainer((props) => <tbody {...props} />);
const SortableItem = SortableElement((props) => <tr {...props} />);


const SkuForm = ({
  value = [],
  onChange = () => {
  }
}) => {

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    let defaultDataSource = data;
    if (value.length > 0) {
      const newDataSource = [];
      value.forEach(item => {
        if (data.some(dataItem => dataItem.key === item.key)) {
          newDataSource.push(item);
        }
      });
      const otherData = data.filter(item => !newDataSource.some(defaultItem => defaultItem.key === item.key));
      defaultDataSource = [...newDataSource, ...otherData];
    }
    setDataSource(defaultDataSource.map((item, index) => ({
      ...item,
      index
    })));
  }, []);

  const dataSourceChange = (data = {}, key) => {
    const newDataSource = dataSource.map(item => {
      if (item.key === key) {
        return {...item, ...data};
      }
      return item;
    });
    setDataSource(newDataSource);
    onChange(newDataSource);
  };

  const onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      if (dataSource.some((value, index) => value.disabled && (value.key !== newData[index].key))) {
        message.error('不可拖拽固定字段！');
        return <></>;
      }
      setDataSource(newData);
      onChange(newData);
    }
  };

  const DraggableContainer = (props) => {
    return <SortableBody
      useDragHandle
      disableAutoscroll={false}
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />;
  };

  const DraggableBodyRow = ({className, style, ...restProps}) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((item) => item.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  const columns = [
    {
      title: '',
      dataIndex: 'disabled',
      width: 30,
      className: 'drag-visible',
      render: (value) => !value && <DragHandle />,
    },
    {
      title: '字段名',
      dataIndex: 'filedName',
      className: 'drag-visible',
      render: (value, record) => <Typography.Paragraph
        style={{margin: 0}}
        editable={record.disabled ? false : {
          tooltip: '点击自定义字段名',
          onChange: (filedName) => {
            dataSourceChange({filedName}, record.key);
          },
        }}
      >
        {value}
      </Typography.Paragraph>
    },
    {
      title: '描述',
      dataIndex: 'describe',
    },
    {
      title: '新建时显示',
      dataIndex: 'show',
      render: (value, record) => <Switch
        disabled={record.defaultShow}
        checked={value}
        onChange={(checked) => {
          const only = ['nationalStandard', 'skuName', 'partNo'];
          const newDataSource = dataSource.map(item => {
            if (only.includes(item.key)) {
              if (only.includes(record.key)) {
                return {...item, show: checked && record.key === item.key};
              } else if (record.key === item.key) {
                return {...item, show: checked};
              } else {
                return item;
              }
            } else if (record.key === item.key) {
              return {...item, show: checked};
            } else {
              return item;
            }
          });
          setDataSource(newDataSource);
          onChange(newDataSource);
        }}
      />
    },
  ];

  return <Table
    className={styles}
    scroll={{y: 500}}
    pagination={false}
    dataSource={dataSource}
    columns={columns}
    rowKey="index"
    components={{
      body: {
        wrapper: DraggableContainer,
        row: DraggableBodyRow,
      },
    }}
  />;
};

export default SkuForm;
