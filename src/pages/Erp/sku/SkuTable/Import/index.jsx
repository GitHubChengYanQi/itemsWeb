import React, {useImperativeHandle, useState} from 'react';
import {Button, message, Modal, Space, Spin, Table as AntTable, Upload} from 'antd';
import cookie from 'js-cookie';

import Icon from '@/components/Icon';
import {useRequest} from '@/util/Request';
import Message from '@/components/Message';
import store from '@/store';

const Import = (
  {
    templateUrl,
    url,
    title,
    module,
    onImport = () => {
    },
    checkbox,
  }, ref) => {

  const [, dataDispatchers] = store.useModel('dataSource');

  const [table, setTable] = useState({visible: false, columns: [], errData: []});

  const [visible, setVisible] = useState();

  const changeTable = (successKeys) => {
    const errData = table.errData.filter((item) => {
      return !successKeys.includes(item.key);
    });
    setTable({...table, errData});
  };

  useImperativeHandle(ref, () => ({
    changeTable,
  }));

  const importErrData = (errData) => {

    const columns = [];

    switch (module) {
      case 'bom':
        columns.push({
          title: '错误信息',
          dataIndex: 'string',
        });
        break;
      case 'customer':
        columns.push({
          title: '物料编码',
          dataIndex: 'coding',
        }, {
          title: '品牌',
          dataIndex: 'brand',
        }, {
          title: '供应商',
          dataIndex: 'supplier',
        }, {
          title: '行',
          dataIndex: 'line',
        }, {
          title: '错误信息',
          dataIndex: 'error',
        },);
        break;
      case 'stock':
        columns.push({
          title: '错误行',
          dataIndex: 'line',
        }, {
          title: '分类',
          dataIndex: 'spuClass',
        }, {
          title: '编码',
          dataIndex: 'strand',
        }, {
          title: '产品',
          dataIndex: 'item',
        }, {
          title: '型号',
          dataIndex: 'spuName',
        }, {
          title: '库存数量',
          dataIndex: 'stockNumber',
        }, {
          title: '上级库位',
          dataIndex: 'supperPosition',
        }, {
          title: '库位',
          dataIndex: 'position',
        }, {
          title: '品牌',
          dataIndex: 'brand',
        }, {
          title: '问题原因',
          dataIndex: 'error',
        },);
        break;
      default:
        break;
    }
    setVisible(false);
    setTable({
      visible: true,
      errData: errData.map((item, index) => {
        if (typeof item === 'string') {
          return {
            key: index,
            string: item,
          };
        }
        return {
          key: index,
          ...item
        };
      }),
      columns
    });
  };

  const {loading: importLoading, run: importRun, cancel} = useRequest({url, method: 'GET'}, {
    manual: true,
    onSuccess: (res) => {
      let errorData = [];
      switch (module) {
        case 'customer':
          Message.success('导入成功!');
          errorData = res;
          break;
        case 'sku':
        case 'spu':
        case 'stock':
        case 'position':
          Message.success('已加入队列！');
          setVisible(false);
          dataDispatchers.opentaskList(true);
          break;
        case 'bom':
          Message.success('导入成功!');
          errorData = res;
          break;
        default:
          break;
      }
      errorData.length > 0 && importErrData(errorData);
    },
    onError: () => {
      Message.error('导入失败！');
    }
  });

  const {loading: fileLoading, run: fileRun} = useRequest({
    url: '/system/upload',
    method: 'POST'
  }, {
    manual: true,
    onSuccess: (res) => {
      importRun({params: {fileId: res.fileId}});
    }
  });

  const [filelist, setFilelist] = useState([]);

  const handleUpload = () => {
    const formData = new FormData();
    filelist.forEach(file => {
      formData.append('file', file);
    });
    fileRun(
      {
        data: formData
      }
    );
  };

  const templateName = () => {
    switch (module) {
      case 'customer':
        return '《供应商模板》';
      case 'sku':
        return '《基础物料模板》';
      case 'bom':
        return '《BOM模板》';
      case 'stock':
        return '《库存模板》';
      case 'spu':
        return '《产品导入模板》';
      case 'position':
        return '《库位导入模板》';
      default:
        break;
    }
  };

  const modalTitle = () => {
    switch (module) {
      case 'customer':
      case 'bom':
      case 'stock':
      case 'spu':
        return '异常数据';
      default:
        break;
    }
  };

  const footer = () => {
    switch (module) {
      case 'customer':
        return null;
      case 'stock':
        return null;
      case 'bom':
        return null;
      default:
        return null;
    }
  };


  return <>
    <a onClick={() => {
      setFilelist([]);
      setVisible(true);
      onImport();
    }}>
      <Space>
        <Icon type="icon-daoru" />
        {title}
      </Space>
    </a>
    <Modal
      maskClosable={false}
      destroyOnClose
      title={title}
      open={visible}
      onCancel={() => {
        cancel();
        setVisible(false);
      }}
      footer={[
        <Button
          loading={importLoading || fileLoading}
          disabled={filelist.length === 0}
          type="primary"
          key={1}
          onClick={() => {
            handleUpload();
          }}>开始导入</Button>,
        <Button key={2} onClick={() => {
          cancel();
          setVisible(false);
        }}>取消</Button>
      ]}
      width={800}>
      <Spin tip="导入中..." spinning={importLoading}>
        <Space direction="vertical">
          <div>
            操作步骤：
          </div>
          <div>
            1、下载
            <a
              href={templateUrl}
              target="_blank"
              rel="noreferrer">
              {templateName()}
            </a>
          </div>
          <div>
            2、打开下载表，将对应信息填入或粘贴至表内，为保证导入成功，请使用纯文本或数字
          </div>
          <div>
            3、信息输入完毕并打开后，点击下方【上传文件】按钮选择已保存的EXCEL文档
          </div>
          <div>
            4、点击【开始导入】
          </div>

          <Upload
            maxCount={1}
            listType="picture"
            fileList={filelist}
            onRemove={() => {
              setFilelist([]);
            }}
            action={url}
            headers={
              {Authorization: cookie.get('tianpeng-token')}
            }
            name="file"
            beforeUpload={(file) => {
              const names = file.name.split('.');
              if (!['xls', 'XLS', 'xlsx', 'XLSX'].includes(names[names.length - 1])) {
                message.warn('请上传XLSX/XLS类型的文件!');
                return false;
              }
              setFilelist([file]);
              return false;
            }}
          >
            {filelist.length === 0 && <Space>
              <Button icon={<Icon type="icon-daoru" />} ghost type="primary">上传文件</Button>
              附件支持类型：XLSX/XLS，最大不超过10M
            </Space>}
          </Upload>
        </Space>
      </Spin>
    </Modal>


    <Modal
      title={modalTitle()}
      width={1700}
      open={table.visible}
      destroyOnClose
      maskClosable={false}
      footer={footer()}
      onCancel={() => {
        setTable({visible: false, columns: [], errData: []});
      }}
    >
      <AntTable
        rowKey="key"
        dataSource={table.errData}
        pagination={{
          showTotal: (number) => {
            return <Button danger type="text">共{number}条异常数据</Button>;
          }
        }}
        columns={table.columns}
        scroll={{y: '50vh'}}
      />
    </Modal>
  </>;

};

export default React.forwardRef(Import);
