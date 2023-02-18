import React, {useRef, useState} from 'react';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import {DeleteOutlined, SearchOutlined, DoubleRightOutlined} from '@ant-design/icons';
import {Alert, Button, List, Select, Space, Spin} from 'antd';
import styles from '@/pages/Erp/parts/components/AddSkuTable/index.module.less';
import Note from '@/components/Note';
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

export const scroll = (itemId) => {
  const partItemDom = document.getElementById(itemId);
  const partsEditId = document.getElementById('partsEditId');

  const boxScrollTop = partsEditId.scrollTop;
  // 滚动条高度+视窗高度 = 可见区域底部高度
  const visibleBottom = boxScrollTop + document.documentElement.clientHeight;
  // 可见区域顶部高度
  const visibleTop = boxScrollTop;

  const getOffsetHeight = (dom, num) => {
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
      <div className={styles.sku} onClick={() => {
        if (noExist || !comparison) {
          return;
        }
        scroll(`${!show ? 'comparison' : 'parts'}${item.skuId}`);
        onParts(item);
      }}>
        <List.Item.Meta
          title={<Note style={{color: noExist && '#174ad4'}} maxWidth="94%" value={item.standard} />}
          description={
            <div>
              <Note style={{color: noExist && '#174ad4'}} maxWidth="94%" value={SkuRender(item)} />
              {/*

                     {item.bomNum && <Button
                      style={{padding: 0}}
                      type="link"
                      onClick={() => {
                        bomsByskuIdRun({params: {skuId: item.skuId}});
                        versionModalRef.current.open(false);
                        setSkuId(item.skuId);
                        setCurrentVer(item.bomId);
                      }}
                    >
                      {item.bomId ? (item.version || '-') : '选择版本'}
                    </Button>}
                    */}
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
            openNewEdit(item.bomId, item.skuId);
          }}
        >
          <SearchOutlined />
        </Button> : <div style={{width: 16}} />}
        <Button
          style={{padding: 0}}
          type="link"
          onClick={() => {
            addRef.current.open({...item, copy: true});
            setCopy(true);
          }}
        >
          复制
        </Button>
        {noExist ? <Button
          style={{padding: 0}}
          type="link"
          onClick={() => {
            addSku(item);
          }}
        >
          <DoubleRightOutlined />
        </Button> : <div style={{width: 16}} />}
      </Space> : <Space>
        <Space align="center">
          数量：
          <InputNumber addonBefore="" width={100} value={item.number || 1} min={1} onChange={(value) => {
            setValue({number: value}, item.skuId);
          }} />
        </Space>
        <Select
          bordered={false}
          value={typeof item.autoOutstock === 'number' ? item.autoOutstock : 1}
          options={[
            {label: '推式', value: 1},
            {label: '拉式', value: 0},
          ]}
          onChange={(value) => setValue({autoOutstock: value}, item.skuId)}
        />

        <Warning onOk={() => {
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
            <DeleteOutlined />
          </Button>
        </Warning>
        <Button
          // disabled={item.bomNum ? !item.bomId : false}
          style={{padding: 0}}
          type="link"
          loading={bomsByskuIdLoading}
          onClick={async () => {
            if (item.bomNum) {
              const res = await bomsByskuIdRun({params: {skuId: item.skuId}});
              openNewEdit(isArray(res)[0]?.partsId, item.skuId);
              return;
            }
            openNewEdit(item.bomId, item.skuId);
          }}
        >
          {item.bomNum ? <Space style={{width: 56}}><SearchOutlined />详情</Space> : '添加bom'}
        </Button>
      </Space>}
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

  return <>
    {render()}
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
                  setValue({version: item.name, bomId: item.partsId}, skuId);
                  versionModalRef.current.close();
                }}
              >
                <Icon type="icon-a-kehuliebiao2" style={{marginRight: 16}} />
                <div>
                  版本号：{item.name || '-'}
                  <br />
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
  </>;
};

export default Item;
