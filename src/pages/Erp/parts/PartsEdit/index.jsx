/**
 * 清单编辑页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Drawer, Image, message, Row, Spin, Tooltip} from 'antd';
import ProCard from '@ant-design/pro-card';
import {partsAdd, partsDetail, partsV1Detail, partsV2Add} from '../PartsUrl';
import {useRequest} from '@/util/Request';
import Modal from '@/components/Modal';
import PartsList from '@/pages/Erp/parts/PartsList';
import {isArray, isObject} from '@/util/Tools';
import styles from './index.module.less';
import {Name, Sku} from '../PartsField';
import AddSkuTable from '@/pages/Erp/parts/components/AddSkuTable';

export const partApiConfig = {
  // view: partsV1Detail,
  // add: partsV2Add,
  // save: partsV2Add
  view: partsDetail,
  add: partsAdd,
  save: partsAdd
};

const PartsEdit = (props) => {

  const {
    spuId,
    value,
    onSeletSku,
    parts,
    defaultValue = {},
    setParts = () => {
    },
    onSuccess = () => {
    },
    sku,
    onFull = () => {
    },
  } = props;

  const partsRef = useRef();

  const [checks, setChecks] = useState([]);

  const [open, setOpen] = useState();

  const [full, setFull] = useState();

  const [skuDetail, setSkuDetail] = useState({});

  const [item, setItem] = useState(defaultValue.item || {});
  const [name, setName] = useState();

  const {loading: partsLoading, run: partsRun} = useRequest(partsDetail, {
    manual: true,
    onSuccess: (res) => {
      setParts(isArray(res.parts).map(item => {
        const skuResult = item.skuResult || {};
        const spuResult = skuResult.spuResult || {};
        return {
          ...skuResult,
          spuName: spuResult.name,
          ...item
        };
      }));
    }
  });

  const {loading: addLoading, run: addRun} = useRequest(partsAdd, {
    manual: true,
    onSuccess: (res) => {
      onSuccess(res.data);
      message.success('添加成功！');
    },
    onError: () => {
      message.error('添加失败！');
    }
  });

  const {loading: detailLoading, run: detailRun} = useRequest(partsDetail, {
    manual: true,
    onSuccess: (res) => {
      setParts(isArray(res.parts).map(item => {
        const skuResult = item.skuResult || {};
        const spuResult = skuResult.spuResult || {};
        return {
          ...skuResult,
          spuName: spuResult.name,
          ...item,
          bomNum: item.partsId ? 1 : 0
        };
      }));
      setItem(res.item);
      setName(res.name);
    }
  });

  useEffect(() => {
    if (value) {
      detailRun({data: {partsId: value}});
    } else {
      setParts([]);
    }
  }, []);

  return (
    <Spin spinning={detailLoading}>
      <div className={styles.edit}>
        <ProCard className="h2Card" headerBordered title="BOM信息">
          <Tooltip
            color="#fff"
            placement="leftTop"
            open={skuDetail.skuId}
            title={<div className={styles.skuDetail}>
              <Image
                preview={{src: isArray(skuDetail.imgResults)[0]?.url}}
                src={isArray(skuDetail.imgResults)[0]?.thumbUrl}
              />
            </div>}
            overlayClassName={styles.skuDetailTip}
          >
            <Row>
              <Col span={16}>
                <div className={styles.formItem}>
                  <div className={styles.label}>物料：</div>
                  {detailLoading ? <Spin /> : <Sku
                    spuId={spuId}
                    value={item}
                    disabled={sku || value || spuId}
                    onChange={(item) => {
                      setSkuDetail(item.sku);
                      setItem(item);
                    }}
                  />}
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.formItem}>
                  <div className={styles.label}>版本号：</div>
                  <Name
                    value={name}
                    onChange={({target: {value}}) => {
                      setName(value);
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Tooltip>
          <div className={styles.line} />
        </ProCard>

        <div className={styles.skus}>
          <div className={styles.space} />
          <div className={styles.list}>
            {partsLoading ? <Spin /> : <AddSkuTable
              onSeletSku={onSeletSku}
              onChange={(value) => {
                setParts(value);
              }}
              openNewEdit={(id, skuId) => {
                onFull(true);
                setChecks(parts);
                setOpen({id, skuId});
              }}
              value={parts}
            />}
          </div>

        </div>


        <div
          className={styles.bottom}
        >
          <Button loading={addLoading} type="primary" onClick={() => {
            if (!name) {
              message.warn('请添加版本号！');
              return false;
            } else if (!item?.skuId) {
              message.warn('请添加物料！');
              return false;
            } else if (!parts.length === 0) {
              message.warn('请添加物料清单！');
              return false;
            }
            addRun({
              data: {
                name,
                item,
                ...item,
                type: 1,
                batch: 0,
                status: 0,
                partsId: value.partsId || '1',
                parts: parts.map(item => {
                  return {
                    ...item,
                    number: item.number || 1,
                    autoOutstock: typeof item.autoOutstock === 'number' ? item.autoOutstock : 1
                  };
                })
              }
            });
          }}>保存</Button>
        </div>

        <Drawer
          destroyOnClose
          push={false}
          bodyStyle={{padding: 0}}
          width={full ? '100%' : '90%'}
          closable={false}
          onClose={() => {
            onFull(false);
            setOpen(false);
            setParts(checks);
          }}
          open={open}
          getContainer={false}
        >
          {open && <PartsEdit
            parts={parts}
            setParts={setParts}
            sku
            defaultValue={{
              item: {skuId: open?.skuId}
            }}
            value={open?.id || false}
            onFull={setFull}
            onSuccess={(data) => {
              onFull(false);
              setOpen(false);
              const newParts = checks.map(item => {
                if (item.skuId === open.skuId) {
                  return {...item, bomNum: item.bomNum + 1, bomId: data?.partsId};
                }
                return item;
              });
              setParts(newParts);
            }}
          />}
        </Drawer>
      </div>

      <Modal
        headTitle="拷贝BOM"
        width={1200}
        spuSkuId
        component={PartsList}
        getPartsId={(id) => {
          partsRef.current.close();
          partsRun({
            data: {
              partsId: id,
            }
          });
        }}
        ref={partsRef}
      />

    </Spin>
  );
};

export default PartsEdit;
