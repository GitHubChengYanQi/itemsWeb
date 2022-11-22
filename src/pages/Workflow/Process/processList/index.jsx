/**
 * 流程主表列表页
 *
 * @author c
 * @Date 2021-11-19 10:58:01
 */

import React, {useRef} from 'react';
import {useHistory} from 'ice';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {Badge, Button, Modal, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {processDelete, processEdit, processList} from '../processUrl';
import ProcessEdit from '../processEdit';
import * as SysField from '../processField';
import Breadcrumb from '@/components/Breadcrumb';
import {useRequest} from '@/util/Request';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';

const {Column} = AntTable;
const {FormItem} = Form;

const ProcessList = ({noTitle, value}) => {

  const ref = useRef(null);
  const tableRef = useRef(null);

  const {run} = useRequest(processEdit, {
    manual: true,
    onSuccess: () => {
      tableRef.current.submit();
    }
  });

  const action = (status, processId, updateStatus, type, module) => {
    let statusType = '';
    switch (status) {
      case 0:
        statusType = '发布';
        break;
      case 98:
        statusType = '停用';
        break;
      case 99:
        statusType = '启用';
        break;
      default:
        break;
    }
    Modal.confirm({
      title: `是否 [ ${statusType} ]该流程?`,
      icon: <ExclamationCircleOutlined />,
      content: type === 0 ? '提示：发布之后不能进行修改' : '提示：每个功能模块仅能开启一套审批流程',
      onOk: async () => {
        return await run({
          data: {
            processId,
            type,
            module,
            status: updateStatus,
          }
        });
      },
      onCancel() {
      },
    });
  };

  const history = useHistory();

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="名称" name="processName" component={SysField.ProcessName} />
        <FormItem label={!value && '单据'} hidden={value} name="type" value={value} component={SysField.ListType} />
        <FormItem label="类型" name="module" component={SysField.TableModule} />
      </>
    );
  };

  return (
    <>
      <Table
        title={!noTitle && <Breadcrumb />}
        contentHeight={noTitle}
        api={processList}
        rowKey="processId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="名称" dataIndex="processName" render={(value, record) => {
          return (
            <>
              <a onClick={() => {
                history.push(`/workflow/process/${record.processId}`);
              }}>{value}</a>
            </>
          );
        }} />
        <Column title="单据" dataIndex="type" render={(value) => {
          switch (value) {
            case ReceiptsEnums.purchaseAsk:
              return <>采购申请单</>;
            case ReceiptsEnums.purchaseOrder:
              return <>采购单</>;
            case ReceiptsEnums.instockOrder:
              return <>入库单</>;
            case ReceiptsEnums.instockError:
              return <>异常单</>;
            case ReceiptsEnums.outstockOrder:
              return <>出库单</>;
            case ReceiptsEnums.quality:
              return <>质检单</>;
            case ReceiptsEnums.stocktaking:
              return <>盘点单</>;
            case ReceiptsEnums.maintenance:
              return <>养护单</>;
            case ReceiptsEnums.allocation:
              return <>调拨单</>;
            default:
              break;
          }
        }} />
        <Column title="类型" dataIndex="module" render={(value) => {
          switch (value) {
            case 'productionInstock':
              return <>生产入库</>;
            case 'purchaseInstock':
              return <>采购入库</>;
            case 'inQuality':
              return <>入厂检</>;
            case 'instockError':
              return <>入库异常</>;
            case 'createInstock':
              return <>直接入库</>;
            case 'productionQuality':
              return <>生产检</>;
            case 'purchaseAsk':
              return <>采购申请</>;
            case 'purchasePlan':
              return <>采购计划</>;
            case 'purchaseOrder':
              return <>采购单</>;
            case 'purchaseQuality':
              return <>采购质检</>;
            case 'INSTOCKERROR':
              return <>入库异常</>;
            case 'StocktakingError':
              return <>盘点异常</>;
            case 'pickLists':
              return <>直接出库</>;
            case 'productionOutStock':
              return <>生产出库</>;
            case 'Stocktaking':
              return <>普通盘点</>;
            case 'reMaintenance':
              return <>复检复调</>;
            case 'allocation':
              return <>调拨申请</>;
            default:
              break;
          }
        }} />
        <Column title="状态" dataIndex="status" render={(value) => {
          switch (value) {
            case 0:
              return <Badge color="yellow" text="未发布" />;
            case 99:
              return <Badge color="green" text="启用" />;
            case 98:
              return <Badge color="red" text="停用" />;
            default:
              break;
          }
        }} />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          if (!record.status) {
            return (
              <>
                <Button type="link" onClick={() => {
                  action(0, record.processId, 98, record.type, record.module);
                }}>发布</Button>
                <EditButton onClick={() => {
                  ref.current.open(record.processId);
                }} />
                <DelButton api={processDelete} value={record.processId} onSuccess={() => {
                  tableRef.current.refresh();
                }} />
              </>
            );
          } else if (record.status === 98) {
            return <>
              <Button type="link" onClick={() => {
                action(99, record.processId, 99, record.type, record.module);
              }}>启用</Button>
            </>;
          } else if (record.status === 99) {
            return <Button type="link" danger onClick={() => {
              action(98, record.processId, 98, record.type, record.module);
            }}>停用</Button>;
          }

        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={ProcessEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default ProcessList;
