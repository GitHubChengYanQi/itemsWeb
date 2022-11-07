import React, {useImperativeHandle, useRef, useState} from 'react';
import {Button, Checkbox, Modal as AntModal, Space} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import Modal from '@/components/Modal';
import SkuEdit from '@/pages/Erp/sku/skuEdit';
import {useRequest} from '@/util/Request';
import Message from '@/components/Message';

const AddSkuModal = ({
  tableRef,
  copy,
  edit,
  addRef,
  onSuccess = () => {
  },
}, ref) => {

  const formRef = useRef();

  const [loading, setLoading] = useState();

  const [visible, setVisible] = useState();

  const [nextCopy, setNextCopy] = useState(false);

  const {loading: batchLoading, run: batchRun} = useRequest({url: '/sku/batchAdd', method: 'POST'}, {
    manual: true,
    onSuccess: () => {
      onSuccess();
      setVisible(null);
      Message.success('保存成功！');
      if (tableRef) {
        tableRef.current.submit();
      }
      if (copy && nextCopy){
        return;
      }
      addRef.current.close();
    },
    onError: () => {
      Message.error('保存失败!');
    }
  });

  useImperativeHandle(ref, () => ({
    batchRun,
  }));

  return <>
    <Modal
      width={521}
      title="物料"
      compoentRef={formRef}
      loading={setLoading}
      component={SkuEdit}
      onRepeat={(oldData, newData) => {
        setVisible({oldData, newData});
      }}
      onSuccess={(res, action) => {
        onSuccess(action);
        if (action) {
          console.log(1);
          tableRef.current.refresh();
        } else {
          tableRef.current.submit();
        }
        if (copy && nextCopy){
          return;
        }
        addRef.current.close();
      }}
      ref={addRef}
      footer={<>
        {copy && <Checkbox checked={nextCopy} onChange={e => setNextCopy(e.target.checked)}>继续复制</Checkbox>}
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
          ghost={copy}
          onClick={() => {
            formRef.current.nextAdd(false);
          }}
        >完成</Button>
      </>} />

    <AntModal
      width={500}
      zIndex={1001}
      closable={false}
      title={<Space align="center" style={{color: '#faad14'}}>
        <ExclamationCircleOutlined />
        警告
      </Space>}
      centered
      footer={[
        <Button key="0" onClick={() => {
          setVisible(null);
        }}>取消</Button>,
        <Button key="1" type="primary" ghost onClick={() => {
          const {newData} = visible;
          batchRun({
            data: {
              skuParams: [newData]
            }
          });
        }}>继续保存</Button>,
        <Button key="2" type="primary" ghost onClick={() => {
          const {newData, oldData} = visible;

          const describe = [];
          if (Array.isArray(oldData.skuJsons)) {
            oldData.skuJsons.map((item) => {
              return describe.push({
                label: item.attribute && item.attribute.attribute,
                value: item.values && item.values.attributeValues
              });
            });
          }

          if (Array.isArray(newData.sku)) {
            newData.sku.map((item) => {
              return describe.push(item);
            });
          }

          addRef.current.open({
            errKey: newData.errKey,
            ...oldData,
            specifications: newData.specifications || oldData.specifications,
            newCoding: newData.standard,
            merge: true,
            skuJsons: [],
            defaultValue: {
              ...newData,
              sku: describe,
            }
          });
          setVisible(null);
        }}>合并物料</Button>,
      ]}
      open={visible}
    >
      发现重复物料,请选择操作方式
    </AntModal>
  </>;
};

export default React.forwardRef(AddSkuModal);
