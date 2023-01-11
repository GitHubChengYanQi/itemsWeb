import React, {useImperativeHandle, useState} from 'react';
import {Button, Modal, Space, Tag} from 'antd';
import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons';
import styles from './index.module.less';
import {useRequest} from '@/util/Request';
import SearchSku from '@/pages/Erp/sku/components/GroupSku/components/SearchSku';

export const generalList = {url: '/general/v1.1/list', method: 'POST'};
// export const generalList = {url: '/general/list', method: 'POST'};

const GroupSku = (
  {
    onChange = () => {

    },
    noParts,
    noSearchButton,
    width = 300,
    align,
  },
  ref
) => {

  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const [groupList, setGroupList] = useState({});

  const {loading, run} = useRequest(generalList, {
    manual: true,
    debounceInterval: 300,
    onSuccess: (res) => {
      setGroupList(res || {});
    }
  });

  const [showValue, setShowValue] = useState('');
  const [searchType, setSearchType] = useState('');

  const reset = () => {
    setSearchType('');
    setShowValue('');
  };

  useImperativeHandle(ref, () => ({
    reset
  }));

  return <>
    <Space size={16} align={align}>
      <Button
        style={{width, textAlign: 'left'}}
      >
        <div className={styles.button}>
          <div className={styles.buttonText} onClick={() => {
            if (showValue) {
              run({data: {keyWord: showValue}});
            }
            setSearchValue(searchType ? '' : showValue);
            setOpen(true);
          }}>

            {
              searchType ?
                <Tag
                  style={{height: 22}}
                  hidden={!searchType}>
                  <div style={{maxWidth: width - 100}} className={styles.tagText}>
                    {searchType === 'skuClass' ? `分类为 “${showValue}”` : `清单为 “${showValue}”`}
                  </div>
                </Tag> :
                (showValue || <span className={styles.placeholder}>请输入关键字搜索</span>)
            }
          </div>
          {showValue && <CloseCircleFilled onClick={() => {
            setSearchType('');
            setShowValue('');
            onChange('', 'reset');
          }} />}
        </div>

      </Button>
      <div hidden={noSearchButton}>
        <Button
          type="primary"
          onClick={() => {
            run({data: {keyWord: showValue}});
            setSearchValue(showValue);
            setOpen(true);
          }}><SearchOutlined />查询
        </Button>
      </div>

      <div hidden={noSearchButton}>
        <Button
          onClick={() => {
            setSearchType('');
            setShowValue('');
            onChange('', 'reset');
          }}>
          重置
        </Button>
      </div>

    </Space>

    <Modal
      className={styles.searchModal}
      closable={false}
      maskClosable
      onCancel={() => setOpen(false)}
      footer={null}
      open={open}
      mask={false}
      destroyOnClose
    >
      <SearchSku
        onChange={onChange}
        searchValue={searchValue}
        setOpen={setOpen}
        setSearchValue={setSearchValue}
        loading={loading}
        setSearchType={setSearchType}
        groupList={groupList}
        noParts={noParts}
        run={run}
        setShowValue={setShowValue}
      />
    </Modal>
  </>;
};

export default React.forwardRef(GroupSku);
