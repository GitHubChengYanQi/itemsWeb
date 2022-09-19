import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Button, Card, Col, Layout, Row, Space, Table as AntdTable} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {createFormActions, Form, FormButtonGroup, useFormTableQuery} from '@formily/antd';
import useUrlState from '@ahooksjs/use-url-state';
import Service from '@/util/Service';
import style from './index.module.less';
import useTableSet from '@/hook/useTableSet';
import TableSort from '@/components/Table/components/TableSort';
import Render from '@/components/Render';


const {Column} = AntdTable;
const {Sider, Content} = Layout;

const formActionsPublic = createFormActions();

const TableWarp = (
  {
    // a
    actions,
    api,
    actionButton,
    // b
    bodyStyle,
    bordered,
    // c
    children,
    columns,
    contentHeight,
    cardTitle,
    configPagination,
    cardHeaderStyle,
    // d
    dataSource: dataSources,
    defaultSelectedRowKeys,
    // e
    expandable,
    // f
    formSubmit,
    format = (data) => data,
    footer: parentFooter,
    formActions = null,
    // g
    getCheckboxProps,
    // h
    headStyle,
    // i
    isChildren,
    isModal = true,
    // l
    left,
    layout,
    listHeader = true,
    labelAlign,
    loading: getLoading,
    // m
    maxHeight,
    // n
    NoChildren,
    noPagination,
    noSort,
    noRowSelection,
    noTableColumn,
    // o
    onChange,
    // p
    pageSize,
    // r
    rowSelection,
    rowKey,
    // s
    sortAction,
    showCard,
    selectedRowKeys,
    searchForm,
    SearchButton,
    selectionType,
    sortList,
    submitAction,
    // t
    title,
    tableData,
    tab,
    tableKey,
    ...props
  }, ref) => {

  if (!rowKey) {
    rowKey = api.rowKey;
  }
  if (!rowKey) {
    console.warn('Table component: rowKey cannot be empty,But now it doesn\'t exist!');
  }

  // 排序
  const [sorts, setSorts] = useState([]);

  const {ajaxService} = Service();

  const [state, setState] = useUrlState(
    {
      navigateMode: 'push',
    },
  );

  const defaultTableQuery = state.params && JSON.parse(state.params) || {};

  if (!formActions) {
    formActions = formActionsPublic;
  }
  // const [formActions,setFormActions] = useState(formActionsPublic);

  const dataSourcedChildren = (data) => {
    if (NoChildren || !Array.isArray(data.children) || data.children.length === 0) {
      return {...data, children: null};
    }
    return {
      ...data, children: data.children.map((item) => {
        return dataSourcedChildren(item);
      })
    };
  };

  const requestMethod = async (params) => {
    const {values, pagination, sorter, ...other} = params;
    const page = {};
    page.limit = pagination.pageSize;
    page.page = pagination.current;
    page.sorter = sorter && {
      field: sorter.field,
      order: sorter.order
    };
    const newValues = typeof formSubmit === 'function' ? formSubmit(values) : values;
    if (!isModal) {
      setState({
        params: JSON.stringify({
          ...page, values: pagination.current ? newValues : {}
        })
      });
    }
    let response;

    try {
      if (dataSources) {
        response = {
          data: dataSources
        };
      } else {
        response = await ajaxService({
          ...api,
          data: {
            ...newValues,
          },
          ...other,
          params: page
        });
      }
      response.data = format(response.data);
      return new Promise((resolve) => {
        resolve({
          dataSource: Array.isArray(response.data) ? response.data.map((items) => {
            return isChildren ? items : dataSourcedChildren(items);
          }) : [],
          total: response.count,
          current: response.current,
          pageSize: response.pageSize,
        });
      });
    } catch (e) {
      console.warn(e.message);
      return new Promise((resolve, reject) => {
        reject(e.message);
      });
    }
  };

  const {setPagination, form, table: tableProps} = useFormTableQuery(requestMethod, null, {
    pagination: {
      pageSize: pageSize || defaultTableQuery.limit,
      current: defaultTableQuery.page,
      pageSizeOptions: [5, 10, 20, 50, 100]
    },
    sorter: defaultTableQuery.sorter || {},
  });

  const submit = () => {
    setPagination({});
    formActions.submit();
  };

  const reset = () => {
    setPagination({});
    formActions.reset();
  };

  const refresh = () => {
    formActions.submit();
  };

  useImperativeHandle(ref, () => ({
    refresh,
    submit,
    reset,
    formActions,
  }));

  const {loading, dataSource, pagination, ...other} = tableProps;

  const footer = () => {
    return (
      <div className={style.footer}>
        {parentFooter && <div className={style.left}>{parentFooter()}</div>}
        <br style={{clear: 'both'}} />
      </div>
    );
  };

  const {tableColumn, setButton} = useTableSet(children || (columns.map((item, index) => ({
    ...item,
    key: `${index}`,
    align: item.align || 'center',
    render: (value, record, index) => {
      return typeof item.render === 'function' ? item.render(value, record, index) : <Render text={value} />;
    }
  }))), tableKey);

  return (
    <div className={style.tableWarp} id="listLayout" style={{height: '100%', overflowX: 'hidden'}}>
      <div style={headStyle}>
        {title ? <div className={style.listHeader}>
          <div className="title">{title}</div>
        </div> : null}
      </div>
      <Layout>
        {left && <Sider className={style.sider} width={180}>
          {left}
        </Sider>}
        <Content
          style={{height: contentHeight || 'calc(100vh - 128px)', overflow: 'auto'}}
          id="tableContent"
        >
          {searchForm ? <div className="search" style={headStyle}>
            <Row justify="space-between">
              <Col>
                <Form
                  value={defaultTableQuery.values || {}}
                  layout={layout || 'inline'}
                  {...form}
                  actions={formActions}
                >
                  {typeof searchForm === 'function' && searchForm()}
                  {SearchButton ||
                  <FormButtonGroup>
                    <Button
                      id="submit"
                      loading={getLoading || loading}
                      type="primary"
                      htmlType="submit"
                      onClick={() => {
                        submit();
                      }}><SearchOutlined />查询
                    </Button>
                    <Button
                      onClick={() => {
                        reset();
                      }}>
                      重置
                    </Button>
                  </FormButtonGroup>}
                </Form>
              </Col>
              <Col className={style.setTing}>
                {!listHeader && actions}
              </Col>
            </Row>

          </div> : <Form
            layout="inline"
            {...form}
            actions={formActions}
          />}
          <Card
            bordered={bordered || false}
            title={listHeader ? actions : null}
            headStyle={headStyle || cardHeaderStyle}
            bodyStyle={bodyStyle}
            extra={<Space>
              {actionButton}
              {!headStyle && !noTableColumn && setButton}
            </Space>}
          >
            {showCard}
            <AntdTable
              showTotal
              expandable={expandable}
              loading={getLoading || loading}
              dataSource={dataSource || []}
              rowKey={rowKey}
              columns={children ? null : [
                ...(noSort ? [] : [{
                  title: '序号',
                  align: 'center',
                  fixed: 'left',
                  dataIndex: '0',
                  width: '70px',
                  render: (value, record, index) => <Render text={index + 1} width={70} />
                }]),
                ...tableColumn.filter((items) => {
                  if (items && items.props && items.props.visible === false) {
                    return false;
                  }
                  return !(items && (items.checked === false));
                }),
              ]}
              pagination={
                noPagination || {
                  ...pagination,
                  showTotal: (total) => {
                    return `共${total || dataSource.length}条`;
                  },
                  showQuickJumper: true,
                  position: ['bottomRight']
                }
              }
              rowSelection={!noRowSelection && {
                type: selectionType || 'checkbox',
                defaultSelectedRowKeys,
                selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                  typeof onChange === 'function' && onChange(selectedRowKeys, selectedRows);
                },
                ...rowSelection,
                getCheckboxProps,
              }}
              footer={footer}
              layout
              scroll={{x: 'max-content', y: maxHeight}}
              sticky={{
                getContainer: () => {
                  return document.getElementById('tableContent');
                }
              }}
              {...other}
              {...props}
            >
              {noSort || <Column
                fixed="left"
                title="序号"
                dataIndex="sort"
                width={80}
                align="center"
                render={(text, item, index) => {
                  if (sortAction && (text || text === 0)) {
                    return <TableSort
                      rowKey={item[rowKey]}
                      sorts={sorts}
                      value={text}
                      onChange={(value) => {
                        if (typeof sortList === 'function') {
                          sortList(value);
                        }
                        setSorts(value);
                      }} />;
                  } else {
                    return <>{index + 1}</>;
                  }

                }} />}
              {tableColumn.filter((items) => {
                if (items && items.props && items.props.visible === false) {
                  return false;
                }
                return !(items && (items.checked === false));
              })}
            </AntdTable>
          </Card>
        </Content>
      </Layout>

    </div>
  );
};

const Table = forwardRef(TableWarp);
Table.Column = Column;

export default Table;
