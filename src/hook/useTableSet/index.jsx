import {Button, Card, Dropdown, Input, Menu, message, Modal, notification, Select, Space, Spin} from 'antd';
import React, {useEffect, useState} from 'react';
import {useBoolean} from 'ahooks';
import {CloseOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';
import Icon from '@/components/Icon';
import {
  tableViewAdd,
  tableViewDetail,
  tableViewEdit,
  tableViewListSelect
} from '@/hook/useTableSet/components/TableViewUrl';
import {Sortable} from '@/components/Table/components/DndKit/Sortable';
import styles from './index.module.less';

const md5 = require('md5');

/**
 * 设置表格列的hook
 * @param column
 * @returns {{setButton: JSX.Element, tableColumn}}
 */

const useTableSet = (column, tableKey) => {

  const [tableColumn, setTableColumn] = useState(Array.isArray(column) && column.map((item) => {
    if (!item) {
      return null;
    }
    return {
      ...item,
      checked: !(item.props && item.props.hidden),
    };
  }) || []);

  const itemsData = [];

  tableKey && Array.isArray(tableColumn) && tableColumn.map((items) => {
    if (items && items.key) {
      return itemsData.push({
        title: items.props.title,
        key: items.key,
        visible: items.props.fixed,
        checked: items.checked,
      });
    }
    return null;
  });

  const md5TableKey = () => {
    let keys = '';
    tableKey && column && column.length > 0 && column.map((items, index) => {
      if (!items) {
        return null;
      }
      if (index === column.length - 1) {
        return keys += `${items.key}`;
      } else {
        return keys += `${items.key}_`;
      }
    });
    return md5(tableKey + keys);
  };

  const view = localStorage.getItem(md5TableKey());

  const [name, setName] = useState();

  const [detail, setDetail] = useState();

  const [state, {setTrue, setFalse}] = useBoolean();

  const [dndRefresh, {toggle}] = useBoolean();

  const [showModal, setShowModal] = useState();

  const openNotificationWithIcon = type => {
    notification[type]({
      message: type === 'success' ? '保存成功！' : '保存失败!',
    });
  };

  const {loading, data, refresh} = useRequest({...tableViewListSelect, data: {tableKey: md5TableKey()}});

  const {run} = useRequest(tableViewEdit, {
    manual: true,
    onSuccess: () => {
      setFalse();
      refresh();
    }
  });

  const {run: viewAdd} = useRequest(tableViewAdd,
    {
      manual: true,
      onSuccess: (res) => {
        if (res) {
          setDetail(res);
        }

        if (res.tableViewId) {
          localStorage.setItem(md5TableKey(), res.tableViewId);
        }

        setFalse();
        refresh();
        openNotificationWithIcon('success');
      },
      onError: () => {
        openNotificationWithIcon('error');
      }
    });


  const {run: viewDetail} = useRequest(tableViewDetail,
    {
      manual: true,
      onSuccess: (res) => {
        if (res) {
          setDetail(res);
          if (res.field) {
            if (res.tableKey === md5TableKey()) {
              const tableColumns = [];
              JSON.parse(res.field).map((items) => {
                const columns = column.filter((columns) => {
                  if (!columns) {
                    return false;
                  }
                  return items.key === columns.key;
                });
                if (columns && columns[0]) {
                  tableColumns.push({
                    ...columns[0],
                    checked: items.checked
                  });
                }
                return null;
              });
              setTableColumn(tableColumns);
              toggle();
            }
          }
        }
      }
    });


  const [visible, setVisible] = useState();

  const cover = async () => {
    if (detail) {
      Modal.confirm({
        title: '覆盖当前视图',
        icon: <ExclamationCircleOutlined />,
        content: `更改视图展现的内容，确定覆盖视图「${detail.name}」？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const columnKeys = itemsData && itemsData.map((items) => {
            return {
              key: items.key,
              checked: items.checked,
            };
          });
          run({
            data: {
              tableViewId: detail.tableViewId,
              field: columnKeys,
            }
          });
        }
      });
    } else {
      message.error('未选中当前视图！');
    }

  };

  const menu = (
    <div>
      <Card
        className={styles.cardTitle}
        title="表头设置"
        headStyle={{textAlign: 'center', padding: 0}}
        bodyStyle={{maxWidth: 300, padding: 0, borderTop: 'solid 1px #eee', height: 'auto'}}
        extra={<Button icon={<CloseOutlined />} style={{marginRight: 16}} type="text" onClick={() => {
          setVisible(false);
        }} />}
      >
        <Sortable
          handle
          items={itemsData}
          refresh={dndRefresh}
          onDragEnd={(allIems) => {
            setTrue();
            const array = [];
            allIems.map((items) => {
              const columns = tableColumn.filter((columns) => {
                return columns && items.key === columns.key;
              });
              return array.push(columns[0]);
            });
            setTableColumn(array);
          }}
          onChecked={(value) => {
            setTrue();
            const array = tableColumn.map((item) => {
              if (item.key === value) {
                return {
                  ...item,
                  checked: !item.checked,
                };
              }
              return item;
            });
            setTableColumn(array);
          }}
        />
      </Card>
    </div>
  );

  const save = (
    <Menu
      style={{minWidth: 220}}
      onClick={(value) => {
        if (value.key === '0') {
          setShowModal(true);
        } else if (value.key === '1') {
          cover();
        }
      }}
      items={[{
        key: '0',
        label: '另存为新视图',
      }, {
        key: '1',
        label: '覆盖当前视图',
        disabled: !detail
      },]}
    />
  );

  useEffect(() => {
    if (view) {
      viewDetail({
        data: {
          tableViewId: view,
        }
      });
    }
  }, []);

  return {
    tableColumn,
    setButton: tableKey &&
      <>
        {
          state
          &&
          <Dropdown overlay={save} placement="bottomLeft" trigger={['click']}>
            <Button style={{marginRight: 8}}>保存视图</Button>
          </Dropdown>
        }

        {loading ?
          <Spin />
          :
          <Select
            options={data}
            style={{minWidth: 200}}
            loading={loading}
            placeholder="请选择视图"
            bordered={false}
            onSelect={(value) => {

              localStorage.setItem(md5TableKey(), value);

              viewDetail({
                data: {
                  tableViewId: value,
                }
              });

            }}
            value={detail && detail.tableViewId} />}

        <Dropdown
          overlay={menu}
          overlayStyle={{backgroundColor: '#fff', zIndex: 99}}
          onOpenChange={(value) => {
            setVisible(value);
          }}
          open={visible}
          placement="bottomRight"
          trigger={['click']}>
          <Button
            type="text"
            onClick={() => {
              setVisible(true);
            }}><Icon type="icon-xitongpeizhi" />列设置</Button>
        </Dropdown>

        <Modal
          title="保存视图"
          open={showModal}
          footer={[
            <Button
              type="primary"
              key={1}
              onClick={() => {
                const columnKeys = tableColumn && tableColumn.map((items) => {
                  return {
                    key: items.key,
                    checked: items.checked,
                  };
                });
                viewAdd({
                  data: {
                    tableKey: md5TableKey(),
                    field: columnKeys,
                    name,
                  }
                });
                setShowModal(false);
              }}>保存</Button>
          ]}
          onCancel={() => {
            setShowModal(false);
          }}>

          <Space direction="vertical" style={{width: '100%'}}>
            <span style={{color: '#a6a2a2'}}>将当前的展示方式、排序方式保存为视图。</span>
            <Input maxLength={20} style={{width: '100%'}} placeholder="请输入视图名称(最多20字)" onChange={(value) => {
              setName(value.target.value);
            }} />
          </Space>
        </Modal>
      </>
  };
};

export default useTableSet;
