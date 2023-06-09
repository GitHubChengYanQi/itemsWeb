/**
 * sku表列表页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Button, Input, message, Select, Space, Typography} from 'antd';
import {CopyOutlined} from '@ant-design/icons';
import {config, useHistory} from 'ice';
import useUrlState from '@ahooksjs/use-url-state';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {deleteBatch, skuDelete, skuV1List} from '../skuUrl';
import Modal from '@/components/Modal';
import Breadcrumb from '@/components/Breadcrumb';
import Code from '@/pages/Erp/spu/components/Code';
import Drawer from '@/components/Drawer';
import Detail from '@/pages/ReSearch/Detail';
import Note from '@/components/Note';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import AddSkuModal from '@/pages/Erp/sku/SkuTable/AddSkuModal';
import Import from '@/pages/Erp/sku/SkuTable/Import';
import Render from '@/components/Render';
import UsePartsList from '@/pages/Erp/sku/SkuTable/UsePartsList';
import Excel from '@/pages/Erp/sku/SkuTable/Excel';
import {SkuFileds} from '@/pages/Erp/sku/SkuTable/Excel/Fileds';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import SearchValueFormat from '@/components/SearchValueFormat';

const {FormItem} = Form;


const SkuTable = ({...props}, ref) => {

  const {baseURI} = config;

  const skuListRef = useRef();

  const {spuClass, spuId, isModal, setSpuClass, ...other} = props;

  const [ids, setIds] = useState([]);

  const [sku, setSku] = useState([]);

  const [edit, setEdit] = useState();

  const [copy, setCopy] = useState();

  const [skuId, setSkuId] = useState();

  const addRef = useRef(null);
  const showShip = useRef(null);
  const tableRef = useRef(null);

  const partsListRef = useRef(null);

  const history = useHistory(null);

  const addBom = (id) => {
    setSkuId(id);
    history.push({
      pathname: '/SPU/parts/edit',
      search: `skuId=${id}`
    });
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
      tableRef.current.formActions.setFieldValue('categoryId', spuClass === '0' ? null : spuClass);
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

  const [state] = useUrlState(
    {
      navigateMode: 'push',
    },
  );
  const defaultTableQuery = state.params && JSON.parse(state.params) || {};
  const tableQueryValues = defaultTableQuery.values || {};
  let defaultSearchType = '';
  if (tableQueryValues.partsId) {
    defaultSearchType = 'parts';
  }

  const searchForm = () => {

    return (
      <Space>
        <GroupSku
          style={{margin: '0 16px 16px 0'}}
          defaultSearchType={defaultSearchType}
          ref={skuListRef}
          align="start"
          noSearchButton
          noSkuClass
          value={tableQueryValues.showValue}
          onChange={(id, type, showValue) => {
            tableRef.current.formActions.setFieldValue('showValue', showValue);
            tableRef.current.formActions.setFieldValue('keyWord', null);
            tableRef.current.formActions.setFieldValue('partsId', null);
            switch (type) {
              case 'skuName':
                tableRef.current.formActions.setFieldValue('keyWord', id);
                break;
              case 'parts':
                tableRef.current.formActions.setFieldValue('partsId', id);
                break;
              default:
                break;
            }
            tableRef.current.submit();
          }} />
        <div hidden>
          <FormItem name="showValue" component={Input} />
          <FormItem name="keyWord" component={Input} />
          <FormItem name="partsId" component={Input} />
          <FormItem name="categoryId" component={Input} />
          <FormItem name="spuId" value={spuId} component={Input} />
        </div>
        <FormItem
          label="BOM"
          name="bomNum"
          component={({value, onChange}) => {
            return <Select
              style={{width: 100}}
              defaultValue="all"
              value={typeof value === 'boolean' ? value : 'all'}
              options={[{label: '全部', value: 'all'}, {label: '有BOM', value: true}, {label: '无BOM', value: false}]}
              onChange={(value) => {
                onChange(value === 'all' ? null : value);
              }}
            />;
          }}
        />
        <FormItem
          label="工艺路线"
          name="shipNum"
          component={({value, onChange}) => {
            return <Select
              style={{width: 100}}
              defaultValue="all"
              value={typeof value === 'boolean' ? value : 'all'}
              options={[{label: '全部', value: 'all'}, {label: '有工艺', value: true}, {label: '无工艺', value: false}]}
              onChange={(value) => {
                onChange(value === 'all' ? null : value);
              }}
            />;
          }}
        />
      </Space>
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
            setIds([]);
            setSku([]);
            tableRef.current.refresh();
          }}
          value={ids}>批量删除</DelButton>
      </>
    );
  };

  const render = (value, record, index, formActions) => {
    return <Render>
      <SearchValueFormat
        searchValue={formActions.getFieldValue('keyWord')}
        label={value || '-'}
      />
    </Render>;
  };

  const columns = [
    {
      title: '物料编码',
      align: 'left',
      sorter: true,
      dataIndex: 'standard',
      render: (value, record) => {
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
      dataIndex: 'categoryName',
      title: '物料分类',
      sorter: true,
      render
    },
    {
      dataIndex: 'spuName',
      title: '产品名称',
      sorter: true,
      render: (value, record, index, formActions) => {
        return <Render width={300}><Note value={
          <SearchValueFormat
            searchValue={formActions.getFieldValue('keyWord')}
            label={value || '-'}
          />
        } maxWidth={300} /></Render>;
      }
    },
    {
      dataIndex: 'model',
      title: '型号',
      sorter: true,
      render
    },
    {
      dataIndex: 'nationalStandard',
      title: '国家标准',
      sorter: true,
      render
    },
    {
      dataIndex: 'partNo',
      title: '零件号',
      sorter: true,
      render
    },
    {
      dataIndex: 'unitName',
      title: '单位',
      render
    },
    {
      dataIndex: 'specifications',
      title: '规格',
      sorter: true,
      render: (value, record, index, formActions) => {
        return <Render width={300}><Note value={
          <SearchValueFormat
            searchValue={formActions.getFieldValue('keyWord')}
            label={value || '-'}
          />
        } maxWidth={300} /></Render>;
      }
    },
    {
      dataIndex: 'skuJsons',
      title: '规格参数',
      render: (value, record) => <Render>
        <Note width={300} value={<SkuResultSkuJsons describe skuResult={record} />} />
      </Render>
    },
    {
      dataIndex: 'bomNum', title: 'BOM', render: (value, record) => {
        const exist = value > 0;
        return <Render>
          <Button type="link" style={{color: exist && 'green', padding: 0}} onClick={() => {
            if (exist) {
              // editParts.current.open(record.partsId);
            } else {
              // editParts.current.open(false);
              setSkuId(record.skuId);
            }
          }}>{exist ? '有' : '无'}</Button>
        </Render>;
      }
    },
    {
      dataIndex: 'shipNum',
      title: '工艺路线',
      render: (value) => {
        const exist = value > 0;
        return <Render>
          <Button type="link" style={{color: exist && 'green', padding: 0}} onClick={() => {
            if (exist) {
              // showShip.current.open(value.processId);
            } else {
              showShip.current.open(false);
              setSkuId(value);
            }
          }}>{exist ? '有' : '无'}</Button>
        </Render>;
      }
    },
    {
      dataIndex: 'maintenancePeriod',
      title: '养护周期(天)',
      sorter: true,
      render
    },
    {
      dataIndex: 'brandName',
      title: '品牌',
      sorter: true,
      render
    },
    {
      dataIndex: 'materialName',
      title: '材质',
      sorter: true,
      render
    },
    {
      dataIndex: 'weight', title: '重量(kg)',
      sorter: true,
      render
    },
    {
      dataIndex: 'skuSize',
      title: '尺寸(mm)',
      render: (value, record, index, formActions) => render(value && value.split(',').join('×') || '-', record, index, formActions)
    },
    {
      dataIndex: 'color',
      title: '表色',
      sorter: true,
      render
    },
    {
      dataIndex: 'heatTreatment',
      title: '热处理',
      sorter: true,
      render
    },
    {
      dataIndex: 'level',
      title: '级别',
      sorter: true,
      render
    },
    {
      dataIndex: 'packaging',
      title: '包装方式',
      sorter: true,
      render
    },
    {
      dataIndex: 'viewFrame',
      title: '图幅',
      sorter: true,
      render
    },
    {
      dataIndex: 'remarks',
      title: '备注',
      sorter: true,
      render
    },
    {
      dataIndex: 'userName',
      title: '添加人',
      sorter: true,
      render
    },
    {
      dataIndex: 'createTime',
      title: '添加时间',
      sorter: true
    },
    {},
    {
      dataIndex: 'skuId',
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (value, record) => {
        return (
          <>
            <Button type="link" onClick={() => {
              history.push(`/SPU/sku/${record.skuId}`);
            }}>详情</Button>
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
                  //
                }
                message.error('当前物料已被使用!');
                partsListRef.current.open(partsList);
                return;
              }
              setIds([]);
              setSku([]);
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
        contentHeight={spuId}
        onReset={() => {
          skuListRef.current.reset();
          setSpuClass([]);
        }}
        title={<Breadcrumb />}
        headStyle={spuId && {display: 'none'}}
        noRowSelection={spuId}
        api={skuV1List}
        tableKey={`sku${spuClass || '0'}`}
        columns={columns}
        actionButton={<Space size={24}>
          <a hidden>查看日志</a>
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
        selectedRowKeys={ids}
        checkedRows={sku}
        footer={!spuId && footer}
        onChange={(value) => {
          setIds(value);
        }}
        onChangeRows={setSku}
        {...other}
      />

      <AddSkuModal addRef={addRef} tableRef={tableRef} copy={copy} edit={edit} />

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
