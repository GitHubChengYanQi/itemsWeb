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
    noSkuClass,
    noParts,
    noSearchButton,
    width = 300,
    align,
    defaultSearchType,
    value,
    style
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

  const [showValue, setShowValue] = useState(value);
  const [searchType, setSearchType] = useState(defaultSearchType);

  const reset = () => {
    setSearchType('');
    setShowValue('');
  };

  const submit = ({id, searchType, showValue}) => {
    setSearchType(searchType);
    setShowValue(showValue);
    onChange(id, searchType, showValue);
  };

  const searchOpen = () => {
    if (!searchType && showValue) {
      run({data: {keyWord: showValue}});
    }
    setSearchValue(searchType ? '' : showValue);
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    reset,
    searchType,
    submit,
    searchOpen,
  }));

  const showValueFormat = () => {
    if (showValue) {
      return <span
        style={{width:'100%'}}
        className={styles.showValue}
      >{showValue}</span>;
    }
    return <span className={styles.placeholder}>请输入关键字搜索</span>;
  };

  const searchButton = () => {
    return <Button
      style={{width, textAlign: 'left'}}
    >
      <div className={styles.button}>
        <div className={styles.buttonText} onClick={() => {
          if (!searchType && showValue) {
            run({data: {keyWord: showValue}});
          }
          setSearchValue(searchType ? '' : showValue);
          setOpen(true);
        }}>

          {
            searchType ?
              <Tag
                style={{height: 22, display: 'inline-block', maxWidth: '100%'}}
                hidden={!searchType}
              >
                <div
                  style={{maxWidth: '100%'}}
                  className={styles.tagText}
                >
                  {searchType === 'skuClass' ? `分类为 “${showValue}”` : `清单为 “${showValue}”`}
                </div>
              </Tag> : showValueFormat()
          }
        </div>
        {showValue && <div style={{margin: 'auto'}}>
          <CloseCircleFilled onClick={() => {
            setSearchType('');
            setShowValue('');
            onChange('', 'reset', '');
          }} />
        </div>}
      </div>

    </Button>;
  };

  return <div style={style}>
    {noSearchButton ? searchButton() : <Space size={16} align={align}>

      {searchButton()}

      <Button
        type="primary"
        onClick={() => {
          run({data: {keyWord: showValue}});
          setSearchValue(showValue);
          setOpen(true);
        }}><SearchOutlined />查询
      </Button>

      <Button
        onClick={() => {
          setSearchType('');
          setShowValue('');
          onChange('', 'reset', '');
        }}>
        重置
      </Button>

    </Space>}

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
        noSkuClass={noSkuClass}
        run={run}
        setShowValue={setShowValue}
      />
    </Modal>
  </div>;
};

export default React.forwardRef(GroupSku);
