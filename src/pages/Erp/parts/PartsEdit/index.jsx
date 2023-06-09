/**
 * 清单编辑页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useEffect, useRef, useState} from 'react';
import {Affix, Button, Col, Drawer, message, Row, Spin} from 'antd';
import ProCard from '@ant-design/pro-card';
import ProSkeleton from '@ant-design/pro-skeleton';
import {config, getSearchParams} from 'ice';
import {partsAdd, partsDetail} from '../PartsUrl';
import {useRequest} from '@/util/Request';
import Modal from '@/components/Modal';
import PartsList from '@/pages/Erp/parts/PartsList';
import {isArray} from '@/util/Tools';
import styles from './index.module.less';
import {Name, Sku} from '../PartsField';
import AddSkuTable from '@/pages/Erp/parts/components/AddSkuTable';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import cookie from 'js-cookie';

const {baseURI} = config;
const PartsEdit = (props) => {

  const {
    scrollTo = () => {
    },
    isOpen,
    onParts = () => {
    },
    addSku = () => {
    },
    comparisonParts,
    comparisonSku,
    comparison,
    firstEdit,
    spuId,
    value,
    onSeletSku,
    parts,
    show,
    openDrawer = () => {
    },
    defaultValue = {},
    setParts = () => {
    },
    onSuccess = () => {
    },
    onSkuDetail = () => {
    },
    sku,
    onFull = () => {
    },
  } = props;

  const searchParams = getSearchParams();

  const readOnly = searchParams.type === 'show';

  let total = 0;

  parts.forEach(item => total += (item.number || 0));

  const partsRef = useRef();

  const [checks, setChecks] = useState([]);

  const [open, setOpen] = useState();

  const [full, setFull] = useState();

  const [skuItem, setSkuItem] = useState(defaultValue.item || {});
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
      onSuccess(res);
    },
    onError: () => {
      message.error('保存失败！');
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
          bomNum: skuResult.inBom ? 1 : 0
        };
      }));
      setSkuItem(res.item);
      setName(res.name);
    }
  });

  useEffect(() => {
    if (value) {
      detailRun({data: {partsId: value}});
    } else {
      setParts([]);
    }
  }, [value]);

  let padding = '16px 16px 0';

  if (show) {
    padding = firstEdit ? '17px 0 0px' : 0;
  }

  const closeDrawer = (success) => {
    scrollTo(open.skuId);
    onSkuDetail(skuItem.sku);
    onParts(null);
    onFull(false);
    openDrawer(false);
    setOpen(false);
    if (!success) {
      setParts(checks);
    }
  };

  if (detailLoading) {
    return show ? <div style={{textAlign: 'center', padding: 12}}><Spin/></div> : <ProSkeleton/>;
  }

  return (
    <>
      <div className={styles.edit}>
        <div style={{padding}}>
          <ProCard
            hidden={show}
            className="h2Card"
            headerBordered
            title="BOM信息"
            bodyStyle={{paddingBottom: 0}}
            extra={value && <Button onClick={() => {
              const token = cookie.get('tianpeng-token');
              window.open(`${baseURI}parts/excelExport?authorization=${token}&partsId=${value}`);
            }}>导出</Button>}
          >
            <Row align="middle">
              <Col span={14}>
                <div className={styles.formItem}>
                  <div className={styles.label}>物料：</div>
                  <Sku
                    spuId={spuId}
                    value={skuItem}
                    disabled={sku || value || spuId}
                    onChange={(item) => {
                      onSkuDetail(item.sku);
                      setSkuItem(item);
                    }}
                  />
                </div>
              </Col>
              <Col span={10}>
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
            <div className={styles.line}/>
          </ProCard>
          <div style={{padding: '15px 15px 36px'}} hidden={!show || firstEdit}>
            {SkuResultSkuJsons({skuResult: skuItem.sku})}
          </div>
          <div hidden={!show} className={styles.line}/>
          <div style={{paddingTop: 24}} className={styles.skus} id={show ? 'comparisonSkusId' : 'partsEditSkusId'}>
            <div hidden={show} className={styles.space}/>
            <div hidden={!skuItem.skuId} className={styles.list}>
              {partsLoading ? <Spin/> : <AddSkuTable
                isOpen={isOpen}
                addSku={addSku}
                comparison={comparison}
                comparisonSku={comparisonSku}
                onParts={onParts}
                comparisonParts={comparisonParts}
                show={show}
                onSeletSku={onSeletSku}
                onChange={(value) => {
                  setParts(value);
                }}
                openNewEdit={(id, skuId) => {
                  onParts(null);
                  onFull(true);
                  setChecks(parts);
                  openDrawer(true);
                  setOpen({id, skuId});
                }}
                value={parts}
              />}
            </div>
            <div
              hidden={skuItem.skuId}
              style={{paddingRight: show ? 0 : 40, minHeight: isOpen ? '100vh' : 'calc(100vh - 296px)'}}
            />
          </div>
        </div>

        {!open && <div className={styles.footer}>
          <div
            style={{minHeight: 49}}
            hidden={show}
            className={styles.bottom}
          >
            <div className={styles.total}>
              总计：<span>{parts.length}</span> 类 <span>{Math.round(total)}</span> 件 物料
            </div>
            {!readOnly && <Button
              size="large"
              loading={addLoading}
              type="primary"
              onClick={() => {
                if (!name) {
                  message.warn('请添加版本号！');
                  return false;
                } else if (!skuItem?.skuId) {
                  message.warn('请添加物料！');
                  return false;
                } else if (!parts.length === 0) {
                  message.warn('请添加物料清单！');
                  return false;
                }
                addRun({
                  data: {
                    name,
                    item: skuItem,
                    ...skuItem,
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
              }}>保存</Button>}
          </div>
        </div>}

        <Drawer
          height="100vh"
          className={styles.drawer}
          destroyOnClose
          push={false}
          bodyStyle={{padding: show ? 16 : 0, overflow: 'visible'}}
          width={full ? '100%' : `${show ? 90 : 95}%`}
          closable={false}
          onClose={() => {
            closeDrawer();
          }}
          afterOpenChange={(status) => {
            if (status) {
              // const partsEditId = document.getElementById('partsEditId');
              // partsEditId.scrollTop = 0;
              const partsEditSkusId = document.getElementById('partsEditSkusId');
              partsEditSkusId.scrollTop = 0;
            }
          }}
          open={open}
          getContainer={false}
        >
          <div className={styles.newEdit}>
            <div
              style={{left: show ? 'calc(-5% + -7px + -16px)' : 'calc(-2.5% + -7px)'}}
              onClick={() => {
                closeDrawer();
              }}
              className={styles.back}
            >
              返 <br/>回
            </div>
            {open && <PartsEdit
              scrollTo={scrollTo}
              isOpen={open}
              addSku={addSku}
              onSkuDetail={onSkuDetail}
              comparison={comparison}
              onParts={onParts}
              comparisonSku={comparisonSku}
              comparisonParts={comparisonParts}
              show={show}
              parts={parts}
              setParts={setParts}
              sku
              defaultValue={open?.id ? {} : {
                item: {skuId: open?.skuId}
              }}
              value={open?.id || false}
              onFull={setFull}
              onSuccess={(data) => {
                console.log(data);
                closeDrawer(true);
                const newParts = checks.map(item => {
                  if (item.skuId === open.skuId) {
                    return {...item, bomNum: item.bomNum + 1, versionBomId: data?.partsId, version: data?.name};
                  }
                  return item;
                });
                setParts(newParts);
              }}
            />}
          </div>
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
    </>
  );
};

export default PartsEdit;
