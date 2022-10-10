import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Button, Space, Spin} from 'antd';
import {PlusOutlined, MenuOutlined, VerticalAlignTopOutlined, DeleteOutlined} from '@ant-design/icons';
import {useBoolean} from 'ahooks';
import AddSpu from '@/pages/Order/CreateOrder/components/AddSpu';
import Modal from '@/components/Modal';
import {useRequest} from '@/util/Request';
import {skuDetail} from '@/pages/Erp/sku/skuUrl';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {Sortable} from '@/components/Table/components/DndKit/Sortable';
import {Handle} from '@/components/Table/components/DndKit/Item';
import Note from '@/components/Note';
import InputNumber from '@/components/InputNumber';
import styles from './index.module.less';

const SkuList = ({...props}, ref) => {

  const addSku = useRef();

  const [refresh, {toggle}] = useBoolean();

  const [skuId, setSkuId] = useState();

  const [skuList, setSkuList] = useState([]);

  useImperativeHandle(ref, () => ({
    skuList
  }));

  const {loading: skuLoading, run: skuRun} = useRequest(skuDetail, {
    manual: true,
    onSuccess: (res) => {
      setSkuList(
        [...skuList, {
          skuId: res.skuId,
          skuResult: res,
          num: 1,
          fixed: false,
        }]
      );
      toggle();
    }
  });

  const setSku = async (data, index) => {
    const array = skuList.filter(() => true);
    array[index] = {...array[index], ...data};
    await setSkuList(array);
    await toggle();
  };

  const Item = (props) => {
    const {value, item, index, ...other} = props;
    return <Space size={4}>
      <Handle icon={<MenuOutlined/>} {...other} />
      <Note width={300}>{value}</Note>
      <InputNumber
        max={999}
        className={styles.item}
        value={item.num}
        style={{border: 'solid 1px #eee', width: 50, textAlign: 'center'}}
        onBlur={(value) => {
          setSku({num: value}, index);
        }}
      />
      <Button type='text' onClick={() => {
        setSku({fixed: !item.fixed}, index);
      }}>
        <VerticalAlignTopOutlined style={{color: item.fixed ? '#d79418' : '#b3b3b3', fontSize: 24}}/>
      </Button>
      <Button
        danger
        style={{padding: 0}}
        type='link'
        onClick={async () => {
          const array = skuList.filter((item, skuIndex) => {
            return skuIndex !== index;
          });
          await setSkuList(array);
          await toggle();
        }}>
        <DeleteOutlined/>
      </Button>
    </Space>;
  };

  useEffect(() => {
    addSku.current.open(false);
  }, []);

  return <>
    <Sortable
      handle
      liBorder
      definedItem={Item}
      refresh={refresh}
      items={skuList.map((item) => {
        return {
          ...item,
          key: item.skuId,
          title: <SkuResultSkuJsons skuResult={item.skuResult}/>,
        };
      })}
      onDragEnd={async (allIems, activeIndex, overIndex) => {
        const newSkuList = allIems.map((item, index) => {
          if (index <= overIndex) {
            return {
              ...item,
              fixed: true,
            };
          }
          return item;
        });
        await setSkuList(newSkuList);
        await toggle();
      }}
    />

    <div style={{padding: '0 16px 16px 16px'}}>
      {
        skuLoading
          ?
          <Spin/>
          :
          <Button
            style={{width: '100%'}}
            onClick={() => {
              addSku.current.open(false);
            }}><PlusOutlined/></Button>
      }
    </div>


    <Modal
      headTitle="物料选择"
      ref={addSku}
      onClose={() => {
        setSkuId(null);
      }}
      width={800}
      footer={<Space>
        <Button onClick={() => {
          setSkuId(null);
          addSku.current.close();
        }}>取消</Button>
        <Button type="primary" disabled={!skuId} onClick={() => {
          skuRun({
            data: {
              skuId
            }
          });
          addSku.current.close();
          setSkuId(null);
        }}>确定</Button>
      </Space>}
    >
      <div style={{padding:24}}>
        <AddSpu maxWidth='100%' onChange={setSkuId} value={skuId} noSkuIds={skuList.map((item) => item.skuId)}/>
      </div>
    </Modal>
  </>;
};

export default React.forwardRef(SkuList);
