/**
 * sku表列表页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Button, Input, message, Space, Typography} from 'antd';
import {CopyOutlined} from '@ant-design/icons';
import {config, useHistory} from 'ice';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {deleteBatch, skuDelete, skuList} from '../skuUrl';
import * as SysField from '../skuField';
import Modal from '@/components/Modal';
import Breadcrumb from '@/components/Breadcrumb';
import Code from '@/pages/Erp/spu/components/Code';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import Drawer from '@/components/Drawer';
import Detail from '@/pages/ReSearch/Detail';
import Note from '@/components/Note';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import AddSkuModal from '@/pages/Erp/sku/SkuTable/AddSkuModal';
import Import from '@/pages/Erp/sku/SkuTable/Import';
import Render from '@/components/Render';
import {isArray} from '@/util/Tools';
import UsePartsList from '@/pages/Erp/sku/SkuTable/UsePartsList';
import Excel from '@/pages/Erp/sku/SkuTable/Excel';
import {SkuFileds} from '@/pages/Erp/sku/SkuTable/Excel/Fileds';

const {FormItem} = Form;


const SkuTable = ({...props}, ref) => {

  const {baseURI} = config;

  const {spuClass, spuId, isModal, setSpuClass, defaultSpuClass, ...other} = props;

  const [loading, setLoading] = useState();

  const [ids, setIds] = useState([]);

  const [sku, setSku] = useState([]);

  const [edit, setEdit] = useState();

  const [copy, setCopy] = useState();

  const [skuId, setSkuId] = useState();

  const addRef = useRef(null);
  const showShip = useRef(null);
  const addParts = useRef(null);
  const tableRef = useRef(null);
  const editParts = useRef(null);

  const partsListRef = useRef(null);

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
      tableRef.current.formActions.setFieldValue('spuClass', spuClass === '0' ? null : spuClass);
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
          placeholder="搜索物料"
          name="skuName"
          component={Input} />
        <FormItem
          name="spuClass"
          hidden
          value={defaultSpuClass === '0' ? null : defaultSpuClass}
          component={SysField.SelectSpuClass} />
        <div hidden>
          <FormItem
            name="spuId"
            value={spuId}
            component={SysField.SkuName} />
        </div>
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

  const columns = [
    {
      title: '物料编码', align: 'left', sorter: true, dataIndex: 'standard', render: (value, record) => {
        return (
          <Space align="center">
            <Code source="sku" id={record.skuId} />
            <Typography.Text copyable={{
              text: value
            }} />
            <Button type="link" onClick={() => {
              history.push(`/SPU/sku/${record.skuId}`);
            }}>
              {value}
            </Button>
          </Space>
        );
      }
    },
    {
      dataIndex: 'spuName',
      title: '产品名称',
      render: (value, record) => <Render text={record.spuResult?.name} />,
      sorter: true
    },
    {dataIndex: 'model', title: '型号', sorter: true,},
    {dataIndex: 'nationalStandard', title: '国家标准', sorter: true,},
    {dataIndex: 'partNo', title: '零件号', sorter: true,},
    {
      dataIndex: 'spuResult',
      title: '单位',
      render: (value) => <Render text={value?.unitResult?.unitName || '-'} />,
    },
    {dataIndex: 'specifications', title: '规格', sorter: true},
    {
      dataIndex: 'sku', title: '规格参数', render: (value, record) => <Render>
        <Note width={300} value={<SkuResultSkuJsons describe skuResult={record} />} />
      </Render>
    },
    {
      dataIndex: 'inBom', title: 'BOM', render: (value, record) => {
        return <Render>
          <Button type="link" style={{color: value && 'green', padding: 0}} onClick={() => {
            if (value) {
              editParts.current.open(record.partsId);
            } else {
              editParts.current.open(false);
              setSkuId(record.skuId);
            }
          }}>{record.inBom ? '有' : '无'}</Button>
        </Render>;
      }
    },
    {
      dataIndex: 'processResult', title: '工艺路线', render: (value) => {
        return <Render>
          <Button type="link" style={{color: value && 'green', padding: 0}} onClick={() => {
            if (value) {
              showShip.current.open(value.processId);
            } else {
              showShip.current.open(false);
              setSkuId(value);
            }
          }}>{value ? '有' : '无'}</Button>
        </Render>;
      }
    },
    {dataIndex: 'maintenancePeriod', title: '养护周期(天)'},
    {
      dataIndex: 'brandResults',
      title: '品牌',
      render: (value) => <Render text={isArray(value).map(item => item.brandName).join('、') || '-'} />
    },
    {
      dataIndex: 'materialResultList',
      title: '材质',
      render: (value) => <Render text={isArray(value).map(item => item.name).join('、') || '-'} />
    },
    {dataIndex: 'weight', title: '重量(kg)', sorter: true},
    {
      dataIndex: 'skuSize',
      title: '尺寸',
      sorter: true,
      render: (value) => <Render text={value && value.split(',').join('×') || '-'} />
    },
    {dataIndex: 'color', title: '表色', sorter: true,},
    {dataIndex: 'heatTreatment', title: '热处理', sorter: true,},
    {dataIndex: 'level', title: '级别', sorter: true,},
    {dataIndex: 'packaging', title: '包装方式', sorter: true,},
    {dataIndex: 'viewFrame', title: '图幅', sorter: true,},
    {dataIndex: 'remarks', title: '备注', sorter: true,},
    {dataIndex: 'user', title: '添加人', render: (value) => <Render text={value?.name || '-'} />, sorter: true},
    {dataIndex: 'createTime', title: '添加时间', sorter: true},
    {},
    {
      dataIndex: 'skuId',
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (value, record) => {
        return (
          <>
            <EditButton onClick={() => {
              addRef.current.open(record);
              setCopy(false);
              setEdit(true);
            }} />
            <DelButton api={skuDelete} value={value} onSuccess={(res) => {
              if (res.errCode === 1001) {
                let partsList = [];
                try {
                  partsList = JSON.parse(res.message);
                } catch (e) {

                }
                message.error('当前物料已被使用!');
                partsListRef.current.open(partsList);
                return;
              }
              tableRef.current.refresh();
            }} />
          </>
        );
      }
    },
  ];

  return (
    <>
      <Table
        onReset={() => setSpuClass([])}
        title={<Breadcrumb />}
        headStyle={spuId && {display: 'none'}}
        noRowSelection={spuId}
        api={skuList}
        tableKey={`sku${spuClass || '0'}`}
        columns={columns}
        actionButton={<Space size={24}>
          <a>查看日志</a>
          <Import
            url={`${baseURI}Excel/importSku`}
            title="导入物料"
            module="sku"
            onOk={() => {
              tableRef.current.submit();
            }}
            templateUrl={`${baseURI}api/SkuExcel`}
          />
          <Excel
            excelUrl="skuExcel/v1.1/skuExport"
            title="导出物料"
            fileds={SkuFileds}
          />
        </Space>}
        rowKey="skuId"
        isModal={isModal || false}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        footer={!spuId && footer}
        onChange={(value, record) => {
          setIds(value);
          setSku(record);
        }}
        {...other}
      />
      {/* 一键生成出库单，分配出库单 */}
      <AddSkuModal addRef={addRef} tableRef={tableRef} copy={copy} edit={edit} />

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
        onSuccess={() => {
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
        onSuccess={() => {
          setSkuId(null);
          showShip.current.close();
          tableRef.current.refresh();
        }}
        onBack={() => {
          setSkuId(null);
          showShip.current.close();
        }}
      />

      <Modal width={1200} headTitle="关联物料清单" ref={partsListRef} component={UsePartsList} />

    </>
  );
};

export default React.forwardRef(SkuTable);
