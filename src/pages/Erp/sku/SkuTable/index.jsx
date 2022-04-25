/**
 * sku表列表页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Button, Space, Table as AntTable} from 'antd';
import {CopyOutlined} from '@ant-design/icons';
import {config, useHistory} from 'ice';
import cookie from 'js-cookie';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {deleteBatch, skuDelete, skuList} from '../skuUrl';
import SkuEdit from '../skuEdit';
import * as SysField from '../skuField';
import Modal from '@/components/Modal';
import Breadcrumb from '@/components/Breadcrumb';
import Code from '@/pages/Erp/spu/components/Code';
import Icon from '@/components/Icon';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import Drawer from '@/components/Drawer';
import Detail from '@/pages/ReSearch/Detail';
import Note from '@/components/Note';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import SkuImport from '@/pages/Erp/sku/SkuTable/SkuImport';

const {Column} = AntTable;
const {FormItem} = Form;

const {baseURI} = config;


const SkuTable = ({...props}, ref) => {

  const token = cookie.get('tianpeng-token');

  const {spuClass, spuId, ...other} = props;

  const [loading, setLoading] = useState();

  const [ids, setIds] = useState([]);

  const [sku, setSku] = useState([]);

  const [edit, setEdit] = useState();

  const [copy, setCopy] = useState();

  const [skuId, setSkuId] = useState();

  const addRef = useRef(null);
  const showShip = useRef(null);
  const formRef = useRef(null);
  const addParts = useRef(null);
  const tableRef = useRef(null);
  const editParts = useRef(null);

  const history = useHistory(null);

  const addBom = (id) => {
    setSkuId(id);
    editParts.current.open(false);
  };
  const addShip = (id) => {
    setSkuId(id);
    showShip.current.open(false);
  };

  useImperativeHandle(ref, () => ({
    addBom,
    addShip,
    refresh: tableRef.current.submit,
  }));

  useEffect(() => {
    if (spuClass) {
      tableRef.current.formActions.setFieldValue('spuClass', spuClass[0]);
      tableRef.current.submit();
    }
  }, [spuClass]);


  const actions = () => {
    return (
      <Space>
        <AddButton onClick={() => {
          addRef.current.open(false);
          setEdit(false);
          setCopy(false);
        }} />
      </Space>
    );
  };

  const searchForm = () => {

    return (
      <>
        <FormItem
          label="编码"
          placeholder="请输入编码"
          name="standard"
          component={SysField.SelectSkuName} />
        <FormItem
          label="名称"
          placeholder="请输入名称"
          name="spuName"
          component={SysField.SelectSkuName} />
        <FormItem
          label="型号"
          placeholder="请输入型号"
          name="name"
          component={SysField.SelectSkuName} />
        <FormItem
          name="spuClass"
          hidden
          component={SysField.SelectSpuClass} />
        <FormItem
          name="spuId"
          hidden
          value={spuId}
          component={SysField.SkuName} />
      </>
    );
  };


  const footer = () => {
    return (
      <>
        <Button type="link" disabled={sku.length !== 1} icon={<CopyOutlined />} onClick={() => {
          setEdit(true);
          setCopy(true);
          const value = {...sku[0], copy: true};
          addRef.current.open(value);
        }}>
          复制添加
        </Button>
        <DelButton
          disabled={ids.length === 0}
          api={{
            ...deleteBatch,
          }}
          onSuccess={() => {
            tableRef.current.refresh();
          }}
          value={ids}>批量删除</DelButton>
      </>
    );
  };


  return (
    <>
      <Table
        title={<Breadcrumb />}
        headStyle={spuId && {display: 'none'}}
        noRowSelection={spuId}
        api={skuList}
        tableKey="sku"
        actionButton={<Space>
          <Button type="link">查看日志</Button>
          <SkuImport addRef={addRef} tableRef={tableRef} />
          <div>
            <a
              href={`${baseURI}skuExcel/skuExport?authorization=${token}`}
              target="_blank"
              rel="noreferrer"
            >
              <Space>
                <Icon type="icon-daoru" />
                导出物料
              </Space>
            </a>
          </div>

        </Space>}
        rowKey="skuId"
        isModal={false}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        footer={!spuId && footer}
        onChange={(value, record) => {
          setIds(value);
          setSku(record);
        }}
        {...other}
      >

        <Column title="物料编码" key={1} dataIndex="standard" render={(value, record) => {
          return (
            <>
              <Code source="sku" id={record.skuId} />
              <Button type="link" onClick={() => {
                history.push(`/SPU/sku/${record.skuId}`);
              }}>
                {value}
              </Button>
            </>
          );
        }} />

        <Column title="名称 / 型号" key={2} dataIndex="skuName" render={(value, record) => {
          if (record.spuResult)
            return (
              <>
                {record.spuResult.name}
                &nbsp;/&nbsp;
                {record.skuName}
              </>
            );
        }} sorter />

        <Column title="名称" key={3} dataIndex="spuId" hidden render={(value, record) => {
          return (
            <>
              {record.spuResult && record.spuResult.spuClassificationResult && record.spuResult.spuClassificationResult.name}
            </>
          );
        }} sorter />

        <Column title="型号" key={4} dataIndex="spuId" hidden render={(value, record) => {
          return (
            <>
              {record.spuResult && record.spuResult.name}
            </>
          );
        }} sorter />

        <Column title="物料描述" key={5} render={(value, record) => {
          return (
            <div style={{minWidth: 100, maxWidth: 300}}>
              <Note value={<SkuResultSkuJsons describe skuResult={record} />} />
            </div>
          );
        }} />

        <Column title="规格" key={6} dataIndex="specifications" render={(value) => {
          return <div style={{minWidth: 50}}>{value}</div>;
        }} />

        <Column
          key={7}
          title="添加人 / 时间"
          sorter
          width={250}
          align="center"
          dataIndex="createUser"
          render={(value, record) => {
            return <>
              {record.user && record.user.name} / {record.createTime}
            </>;
          }} />

        <Column />

        <Column title="操作" key={8} dataIndex="skuId" width={300} align="center" render={(value, record) => {
          return (
            <>
              <Button type="link" style={{color: record.inBom && 'green'}} onClick={() => {
                if (record.inBom) {
                  editParts.current.open(record.partsId);
                } else {
                  editParts.current.open(false);
                  setSkuId(record.skuId);
                }
              }}>{record.inBom ? '有' : '无'}BOM</Button>
              <Button type="link" style={{color: record.processResult && 'green'}} onClick={() => {
                if (record.processResult) {
                  showShip.current.open(record.processResult.processId);
                } else {
                  showShip.current.open(false);
                  setSkuId(value);
                }
              }}>{record.processResult ? '有' : '无'}工艺</Button>
              <EditButton onClick={() => {
                addRef.current.open(record);
                setCopy(false);
                setEdit(true);
              }} />
              <DelButton api={skuDelete} value={value} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} />

      </Table>

      <Modal
        title="物料"
        compoentRef={formRef}
        loading={setLoading}
        component={SkuEdit}
        onSuccess={(res, action) => {
          if (action) {
            tableRef.current.refresh();
          } else {
            tableRef.current.submit();
          }
          addRef.current.close();
        }}
        ref={addRef}
        footer={<>
          {copy && <Button
            loading={loading}
            type="primary"
            ghost
            onClick={() => {
              formRef.current.copyAdd(true);
            }}
          >复制并拷贝BOM(工艺路线)</Button>}
          {!edit && <Button
            loading={loading}
            type="primary"
            ghost
            onClick={() => {
              formRef.current.nextAdd(true);
            }}
          >完成并添加下一个</Button>}
          <Button
            loading={loading}
            type="primary"
            onClick={() => {
              formRef.current.nextAdd(false);
            }}
          >完成</Button>
        </>} />


      <Modal
        width={1200}
        type={1}
        loading={setLoading}
        headTitle="物料清单"
        sku
        defaultValue={{
          item: {skuId}
        }}
        compoentRef={addParts}
        component={PartsEdit}
        onClose={() => {
          setSkuId(null);
        }}
        onSuccess={(res) => {
          setSkuId(null);
          tableRef.current.refresh();
          editParts.current.close();
        }}
        ref={editParts}
        footer={<>
          <Button type="primary" loading={loading} onClick={() => {
            addParts.current.submit();
          }}>保存</Button>
        </>}
      />

      <Drawer
        bodyStyle={{padding: 0}}
        push={false}
        headTitle="添加工艺路线"
        height="100%"
        placement="top"
        addChildren
        skuId={skuId}
        component={Detail}
        ref={showShip}
        onSuccess={(res) => {
          setSkuId(null);
          showShip.current.close();
          tableRef.current.refresh();
        }}
        onBack={() => {
          setSkuId(null);
          showShip.current.close();
        }}
      />

    </>
  );
};

export default React.forwardRef(SkuTable);
