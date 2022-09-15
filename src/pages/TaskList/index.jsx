import React, {useEffect, useRef, useState} from 'react';
import {Button, List as AntList, Popover, Progress, Space, Spin,} from 'antd';
import {UnorderedListOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';
import store from '@/store';
import AnalysisModal from '@/pages/TaskList/components/AnalysisModal';
import SkuImport from '@/pages/TaskList/components/SkuImport';
import SpuImport from '@/pages/TaskList/components/SpuImport';
import Import from '@/pages/TaskList/components/Import';
import StockImport from '@/pages/TaskList/components/StockImport';
import PositionImport from '@/pages/TaskList/components/PositionImport';


const TaskList = () => {

  const [state, dataDispatchers] = store.useModel('dataSource');

  const [taskId, setTaskId] = useState();

  const showRef = useRef();
  const skuImportRef = useRef();
  const spuImportRef = useRef();
  const stockImportRef = useRef();
  const positionImportRef = useRef();

  const {loading, cancel, data: List, run} = useRequest({
    url: '/asynTask/list',
    method: 'POST'
  }, {
    manual: true,
    pollingInterval: 2000,
  });

  useEffect(() => {
    if (state.showTaskList) {
      run();
    } else if (List) {
      cancel();
    }
  }, [state.showTaskList]);

  const taskList = () => {
    return <div style={{minWidth: 500, maxHeight: '50vh', overflow: 'auto'}}>
      <Spin spinning={!List && loading} tip="加载中...">
        <AntList
          dataSource={List || []}
          renderItem={item => {
            return <AntList.Item
              extra={
                <Space>
                  <div style={{width: 200}}>
                    <Progress
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                      percent={(Math.floor((item.count / item.allCount) * 100))}
                    />
                  </div>

                  <Button type="link" onClick={() => {
                    switch (item.type) {
                      case '物料分析':
                      case '报表物料分析':
                        showRef.current.open(item.taskId);
                        break;
                      case '物料导入':
                        skuImportRef.current.open(item.taskId);
                        break;
                      case '产品导入':
                        spuImportRef.current.open(item.taskId);
                        break;
                      case '库存导入':
                        stockImportRef.current.open(item.taskId);
                        break;
                      case '库位导入':
                        positionImportRef.current.open(item.taskId);
                        break;
                      default:
                        break;
                    }
                    dataDispatchers.opentaskList(false);
                  }}>查看</Button>
                </Space>
              }
            >
              <AntList.Item.Meta
                title={item.type}
                description={item.createTime}
              />
            </AntList.Item>;

          }}
        />
      </Spin>

    </div>;
  };

  return <>
    <Popover
      open={state.showTaskList}
      placement="bottomRight"
      onOpenChange={dataDispatchers.opentaskList}
      title="任务列表"
      content={taskList}
      trigger="click"
    >
      <Button style={{color: '#fff'}} type="text" onClick={() => {
        dataDispatchers.opentaskList(true);
      }}>
        <UnorderedListOutlined />
      </Button>
    </Popover>

    <AnalysisModal showRef={showRef} />


    <Import setTaskId={setTaskId} ref={spuImportRef}>
      <SpuImport taskId={taskId} />
    </Import>

    <Import setTaskId={setTaskId} ref={stockImportRef}>
      <StockImport taskId={taskId} />
    </Import>
    <Import setTaskId={setTaskId} ref={positionImportRef}>
      <PositionImport taskId={taskId} />
    </Import>

    <SkuImport ref={skuImportRef} />


  </>;
};

export default TaskList;
