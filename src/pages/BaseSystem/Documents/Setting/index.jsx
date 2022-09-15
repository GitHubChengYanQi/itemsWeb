import React, {useEffect, useRef, useState} from 'react';
import {getSearchParams, useHistory} from 'ice';
import {Button, Card, Empty, Input, List as AntList, Modal, Select, Space, Typography} from 'antd';
import {DeleteOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useBoolean} from 'ahooks';
import ProSkeleton from '@ant-design/pro-skeleton';
import Breadcrumb from '@/components/Breadcrumb';
import {Sortable} from '@/components/Table/components/DndKit/Sortable';
import {Handle} from '@/components/Table/components/DndKit/Item';
import {List} from '@/components/Table/components/DndKit/List';
import Note from '@/components/Note';
import Message from '@/components/Message';
import {useRequest} from '@/util/Request';
import ModalMessage from '@/components/ModalMessage';
import {DocumentEnums} from '@/pages/BaseSystem/Documents/Enums';
import {typeObject} from '@/pages/BaseSystem/Documents/Config';

const addStatusApi = {url: '/statueAction/addState', method: 'POST'};
const editStatusApi = {url: '/documentStatus/edit', method: 'POST'};
const deleteStatusApi = {url: '/documentStatus/delete', method: 'POST'};
const addActionsApi = {url: '/statueAction/addAction', method: 'POST'};
const detailApi = {url: '/documentStatus/getDetails', method: 'GET'};

const Setting = ({
  value,
  onSuccess = () => {
  }
}) => {

  const history = useHistory();

  const params = getSearchParams();

  const type = params.type || value;

  const [status, setStatus] = useState([]);

  const [visible, setVisible] = useState();

  const [statuName, setStatuName] = useState();

  const resultRef = useRef();

  const {loading: detailLoading, run: detailRun} = useRequest(detailApi, {
    manual: true,
    onSuccess: (res) => {
      setStatus(res.map((item, statuIndex) => {
        return {
          default: [0, 50, 99].includes(item.documentsStatusId),
          noActions: [0, 50, 99].includes(item.documentsStatusId),
          label: item.name,
          value: item.documentsStatusId,
          actions: item.actionResults ? item.actionResults.map((item, index) => {
            return {
              key: `${index}`,
              value: item.action,
              listIndex: statuIndex
            };
          }) : [],
        };
      }));
    }
  });

  const {run: editStatus} = useRequest(editStatusApi, {
    manual: true,
    onSuccess: (res) => {
      const newStatus = status.map(item => {
        if (item.value === res.documentsStatusId) {
          return {...item, label: res.name};
        } else {
          return item;
        }
      });
      setStatus(newStatus);
    }
  });

  useEffect(() => {
    if (type) {
      detailRun({
        params: {type}
      });
    }
  }, []);

  const {loading: addStatusLoading, run: addStatusRun} = useRequest(addStatusApi, {
    manual: true,
    onSuccess: (res) => {
      setStatus([...status, {label: statuName, value: res, actions: []}]);
      setVisible(false);
    }
  });

  const {loading: deleteStatusLoading, run: deleteStatusRun} = useRequest(deleteStatusApi, {manual: true});

  const {loading: addActionsLoading, run: addActionsRun} = useRequest(addActionsApi, {
    manual: true,
    onSuccess: () => {
      resultRef.current.success({
        title: '保存成功!',
        onCancel: () => {
          onSuccess();
          history.goBack();
        },
        onOk: onSuccess,
        onClose: onSuccess,
        noCancel: value,
      });
    },
    onError: () => {
      resultRef.current.error({
        title: '保存失败!',
        onCancel: () => {
          history.goBack();
        },
        onOk: () => {
          onSuccess();
        },
        noCancel: value,
      });
    }
  });


  const [refresh, {toggle}] = useBoolean();

  const onStatus = async (data, index, listindex, allActions) => {
    const array = status.map((item, statuIndex) => {
      if (statuIndex === listindex) {
        if (allActions) {
          return {...item, actions: allActions};
        }
        let actions;
        if (data) {
          actions = item.actions.map((item, actionIndex) => {
            if (actionIndex === index) {
              return {...item, ...data};
            }
            return item;
          });
        } else {
          actions = item.actions.filter((item, actionIndex) => actionIndex !== index);
        }

        return {...item, actions};
      }
      return item;
    });
    await setStatus(array);
    toggle();
  };

  const Item = (props) => {

    const {value, item, index, ...other} = props;

    return <Space size={8}>
      <Handle {...other} />
      <Select
        placeholder="请选择单据动作"
        value={item.value}
        style={{width: 200}}
        options={typeObject({type, status}).types}
        onChange={(value, option) => {
          onStatus({title: option.label, value}, index, item.listIndex);
        }}
      />
      <Button
        danger
        style={{padding: 0}}
        type="link"
        onClick={async () => {
          onStatus(null, index, item.listIndex);
        }}>
        <DeleteOutlined />
      </Button>
    </Space>;
  };

  if (detailLoading) {
    return <ProSkeleton type="descriptions" />;
  }

  if (!type) {
    return <Empty />;
  }

  return <>
    <div>
      <Card hidden={value} title={<Breadcrumb title="状态设置" />} bordered={false} />

      <Card
        style={{width: 1250, margin: 'auto'}}
        title={`设置${typeObject({type}).title}状态`}
        bordered={false}
        bodyStyle={{overflow: 'auto'}}
      >
        <AntList
          dataSource={status}
          renderItem={(item, index) => {
            return <AntList.Item>
              <Space style={{minHeight: 60}}>
                <Button loading={deleteStatusLoading} disabled={item.default} type="link" danger onClick={async () => {
                  await deleteStatusRun({data: {documentsStatusId: item.value}});
                  const newStatus = status.filter((item, statusIndex) => {
                    return statusIndex !== index;
                  });
                  setStatus(newStatus);
                }}>
                  <MinusCircleOutlined />
                </Button>
                <div style={{width: 150}}>
                  <Note>
                    <Typography.Paragraph
                      editable={!item.default && {
                        onChange: (value) => {
                          editStatus({
                            data: {
                              documentsStatusId: item.value,
                              name: value
                            }
                          });
                        }
                      }}
                      ellipsis={{rows: 1, tooltip: true,}}
                      style={{margin: 0}}>
                      {item.label}
                    </Typography.Paragraph>
                  </Note>
                </div>

                {item.actions.length > 0 && <Sortable
                  handle
                  Container={(props) => <List horizontal {...props} />}
                  definedItem={Item}
                  refresh={refresh}
                  items={item.actions}
                  onDragEnd={async (allIems) => {
                    onStatus(null, null, index, allIems);
                  }}
                />}
                <Button
                  hidden={item.noActions}
                  disabled={
                    (Array.isArray(item.actions) && item.actions.length) === (typeObject({type, status}).types
                      &&
                      typeObject({type, status}).types.length
                    )}
                  style={{marginLeft: 38}}
                  onClick={() => {
                    const newStatus = status.map((item, statuIndex) => {
                      if (statuIndex === index) {
                        const newActions = item.actions.map((item, index) => {
                          return {...item, key: `${index}`};
                        });
                        return {
                          ...item,
                          actions: [...newActions, {key: `${newActions.length}`, listIndex: statuIndex}]
                        };
                      }
                      return item;
                    });
                    setStatus(newStatus);
                    toggle();
                  }}><PlusOutlined /> 增加动作</Button>
              </Space>
            </AntList.Item>;
          }}
        />

        <Space>
          <Button
            // style={{width: 440, margin: 'auto', display: 'block'}}
            type="primary"
            ghost
            onClick={() => {
              setStatuName('');
              setVisible(true);
            }}><PlusOutlined /> 增加状态</Button>
          <Button loading={addActionsLoading} type="primary" onClick={() => {
            addActionsRun({
              data: {
                receiptsEnum: type,
                actions: status.map((item) => {
                  const enums = [];
                  item.actions.map((item) => {
                    if (item.value) {
                      return enums.push(item.value);
                    }
                    return item;
                  });
                  let Enums = {};
                  switch (type) {
                    case DocumentEnums.purchaseAsk:
                      Enums = {purchaseActionEnums: enums};
                      break;
                    case DocumentEnums.purchaseOrder:
                      Enums = {poOrderActionEnums: enums};
                      break;
                    case DocumentEnums.instockOrder:
                      Enums = {inStockActionEnums: enums};
                      break;
                    case DocumentEnums.instockError:
                      Enums = {instockErrorActionEnums: enums};
                      break;
                    case DocumentEnums.outstockOrder:
                      Enums = {outStockActionEnums: enums};
                      break;
                    case DocumentEnums.quality:
                      Enums = {qualityActionEnums: enums};
                      break;
                    case DocumentEnums.stocktaking:
                      Enums = {stocktakingEnums: enums};
                      break;
                    case DocumentEnums.maintenance:
                      Enums = {maintenanceActionEnums: enums};
                      break;
                    case DocumentEnums.allocation:
                      Enums = {allocationActionEnums: enums};
                      break;
                    default:
                      return {};
                  }
                  return {
                    statusId: item.value,
                    ...Enums
                  };
                })
              }
            });
          }}>保存</Button>
        </Space>

      </Card>

    </div>

    <Modal
      open={visible}
      title="状态名称"
      onCancel={() => {
        setVisible(false);
      }}
      okButtonProps={{htmlType: 'submit', loading: addStatusLoading}}
      onOk={() => {
        if (!statuName) {
          return Message.warning('请输入状态名称!');
        }
        addStatusRun({
          data: {
            receiptsEnum: type,
            param: {name: statuName}
          }
        });
      }}>
      <Input
        placeholder="请输入状态名称"
        value={statuName}
        onChange={(value) => {
          setStatuName(value.target.value);
        }} />
    </Modal>

    <ModalMessage ref={resultRef} />

  </>;
};

export default Setting;
