import React, {useRef, useState} from 'react';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import {DeleteOutlined, SearchOutlined, DoubleRightOutlined} from '@ant-design/icons';
import {Alert, Button, List, Select, Space, Spin} from 'antd';
import styles from '@/pages/Erp/parts/components/AddSkuTable/index.module.less';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';
import {isArray} from '@/util/Tools';
import InputNumber from '@/components/InputNumber';
import Warning from '@/components/Warning';
import Modal from '@/components/Modal';
import Icon from '@/components/Icon';
import {request, useRequest} from '@/util/Request';
import {bomsByskuId} from '@/pages/Erp/parts/PartsUrl';
import AddSkuModal from '@/pages/Erp/sku/SkuTable/AddSkuModal';
import {skuV1List} from '@/pages/Erp/sku/skuUrl';
import SearchValueFormat from '@/components/SearchValueFormat';

export const scroll = (itemId) => {
  const partItemDom = document.getElementById(itemId);
  const partsEditSkusId = document.getElementById('partsEditSkusId');
  // const partsEditId = document.getElementById('partsEditId');
  const boxScrollTop = partsEditSkusId.scrollTop;
  // 滚动条高度+视窗高度 = 可见区域底部高度
  const visibleBottom = boxScrollTop + document.documentElement.clientHeight - 310;
  // 可见区域顶部高度
  const visibleTop = boxScrollTop;

  const getOffsetHeight = (dom, num) => {
    if (!dom) {
      return num;
    }
    if (!dom.parentNode) {
      return num;
    }
    return getOffsetHeight(dom.parentNode, num + dom.offsetTop);
  };

  const domTop = getOffsetHeight(partItemDom, 0) - 60;

  if (!((domTop - 200) > visibleTop && (domTop - 200) < visibleBottom)) {
    partItemDom.scrollIntoView({block: 'center', behavior: 'smooth'});
  }
};

const Item = (
  {
    readOnly,
    searchValue,
    isDragging,
    index,
    comparisonSku,
    show,
    item,
    noExist,
    comparison,
    onParts,
    openNewEdit,
    dataSources,
    addSku,
    onChange,
  }
) => {

  const versionModalRef = useRef();

  const addRef = useRef();

  const [copy, setCopy] = useState(false);

  const [bomVersions, setBomVersions] = useState([]);

  const [skuId, setSkuId] = useState();
  const [currentVer, setCurrentVer] = useState();

  const {loading: bomsByskuIdLoading, run: bomsByskuIdRun} = useRequest(bomsByskuId, {
    manual: true,
    onSuccess: (res) => {
      setBomVersions(res);
    }
  });

  const setValue = (data, skuId) => {
    const array = dataSources.map((item) => {
      if (item.skuId === skuId) {
        return {
          ...item,
          ...data
        };
      } else {
        return item;
      }
    });
    onChange(array);
  };

  const anim = [
    {
      backgroundColor: 'rgba(252,237,181,0.6)', duration: 100,
    },
    {
      duration: 100,
      type: 'from',
      ease: 'easeOutQuad',
    },
    {
      delay: 100, backgroundColor: '#fff'
    }
  ];

  const endAnim = [
    {
      backgroundColor: 'rgba(252,237,181,0.6)', duration: 100,
    },
    {
      duration: 100,
      type: 'from',
      ease: 'easeOutQuad',
    },
    {
      delay: 100, backgroundColor: '#fff', onComplete: () => {
        onParts(null);
      }
    },
  ];

  const exits = comparisonSku && comparisonSku.skuId === item.skuId;

  const render = () => {
    return <div
      id={`${show ? 'comparison' : 'parts'}${item.skuId}`}
      className={classNames(styles.content, !exits && index % 2 === 0 && styles.row, !exits && noExist && styles.noComparison, !exits && isDragging && styles.isDragging)}
    >
      <div className={styles.sku}>
        <List.Item.Meta
          description={
            <div>
              <div onClick={() => {
                if (noExist || !comparison) {
                  return;
                }
                scroll(`${!show ? 'comparison' : 'parts'}${item.skuId}`);
                onParts(item);
              }}>
                <SearchValueFormat
                  color="red"
                  maxWidth="94%"
                  style={{color: noExist && '#174ad4', fontWeight: 'bold'}}
                  searchValue={searchValue}
                  label={item.standard || '-'}
                />
                <SearchValueFormat
                  color="red"
                  maxWidth="94%"
                  style={{color: noExist && '#174ad4'}}
                  searchValue={searchValue}
                  label={SkuRender(item) || '-'}
                />
              </div>
              {(item.bomNum > 0 && !show) ? <Button
                style={{padding: 0, height: 19}}
                type="link"
                onClick={() => {
                  if (readOnly) {
                    return;
                  }
                  bomsByskuIdRun({params: {skuId: item.skuId}});
                  versionModalRef.current?.open(false);
                  setSkuId(item.skuId);
                  setCurrentVer(item.versionBomId);
                }}
              >
                {item.versionBomId ? (item.version || '-') : '选择版本'}
              </Button> : (item.version || '-')}
            </div>}
        />
      </div>
      {show ? <Space size={12}>
        <div style={{textAlign: 'center'}}>
          × {item.number}
        </div>
        {item.bomNum ? <Button
          style={{padding: 0}}
          type="link"
          loading={bomsByskuIdLoading}
          onClick={async () => {
            if (item.bomNum) {
              const res = await bomsByskuIdRun({params: {skuId: item.skuId}});
              openNewEdit(isArray(res)[0]?.partsId, item.skuId);
              return;
            }
            openNewEdit(item.versionBomId, item.skuId);
          }}
        >
          <SearchOutlined/>
        </Button> : <div style={{width: 16}}/>}
        <Button
          style={{padding: 0}}
          type="link"
          disabled={readOnly}
          onClick={() => {
            addRef.current.open({...item, copy: true});
            setCopy(true);
          }}
        >
          复制
        </Button>
        {(noExist && !readOnly) ? <Button
          style={{padding: 0}}
          type="link"
          onClick={() => {
            addSku(item);
          }}
        >
          <DoubleRightOutlined/>
        </Button> : <div style={{width: 16}}/>}
      </Space> : <Space>
        <Space align="center">
          数量：
          <InputNumber
            readOnly={readOnly}
            addonBefore=""
            width={100}
            value={item.number || 1} min={1}
            onChange={(value) => {
              setValue({number: value}, item.skuId);
            }}
          />
        </Space>
        <Select
          showArrow={!readOnly}
          open={readOnly ? false : undefined}
          bordered={false}
          value={typeof item.autoOutstock === 'number' ? item.autoOutstock : 1}
          options={[
            {label: '推式', value: 1},
            {label: '拉式', value: 0},
          ]}
          onChange={(value) => setValue({autoOutstock: value}, item.skuId)}
        />
        {!readOnly && <Warning onOk={() => {
          const array = dataSources.filter((dataItem) => {
            return item.skuId !== dataItem.skuId;
          });
          onChange(array);
        }}>
          <Button
            style={{padding: '0 0 0 8px'}}
            size="large"
            type="link"
            danger
          >
            <DeleteOutlined/>
          </Button>
        </Warning>}
        <Button
          disabled={item.bomNum ? !item.versionBomId : false}
          style={{padding: 0}}
          type="link"
          onClick={async () => {
            // if (item.bomNum) {
            //   // const res = await bomsByskuIdRun({params: {skuId: item.skuId}});
            //   openNewEdit(item.bomId, item.skuId);
            //   return;
            // }
            openNewEdit(item.versionBomId, item.skuId);
          }}
        >
          {item.bomNum ? <Space style={{width: 56}}><SearchOutlined/>详情</Space> : '添加bom'}
        </Button>
      </Space>}

      <Modal
        ref={versionModalRef}
        headTitle="选择版本"
        footer={null}
      >
        <div style={{padding: 16}}>
          {
            bomsByskuIdLoading ?
              <Spin spinning>
                <Alert
                  message="正在获取BOM版本信息"
                  description="加载中..."
                  type="info"
                />
              </Spin>
              :
              bomVersions.map((item, index) => {
                return <div
                  key={index}
                  className={styles.versionIndex}
                  style={{border: currentVer === item.partsId ? 'solid 1px #c5e8ff' : 'none'}}
                  onClick={() => {
                    setValue({version: item.name, versionBomId: item.partsId}, skuId);
                    versionModalRef.current.close();
                  }}
                >
                  <Icon type="icon-a-kehuliebiao2" style={{marginRight: 16}}/>
                  <div>
                    版本号：{item.name || '-'}
                    <br/>
                    创建时间：{item.createTime}
                  </div>
                </div>;
              })
          }
        </div>
      </Modal>

      <AddSkuModal
        edit={copy}
        addRef={addRef}
        copy={copy}
        onSuccess={async () => {
          addRef.current.close();
          const list = await request({...skuV1List, data: {}, params: {limit: 1, page: 1}});
          addSku(isArray(list)[0]);
        }}
      />
    </div>;
  };

  if (exits) {
    return <TweenOne
      style={{width: '100%'}}
      animation={[...anim, ...anim, ...endAnim]}
    >
      {render()}
    </TweenOne>;
  }

  return render();
};

export default Item;
