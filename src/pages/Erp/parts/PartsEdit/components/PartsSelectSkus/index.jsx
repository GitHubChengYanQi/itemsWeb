import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Button, List} from 'antd';
import styles from '../../../PartsEditV2/index.module.less';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import {useRequest} from '@/util/Request';
import {skuV1List} from '@/pages/Erp/sku/skuUrl';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';
import {isArray} from '@/util/Tools';
import SearchValueFormat from '@/components/SearchValueFormat';
import AddSkuModal from '@/pages/Erp/sku/SkuTable/AddSkuModal';

const PartsSelectSkus = (
  {
    value = [],
    onChange = () => {
    },
  }, ref
) => {

  const searchRef = useRef();

  const addRef = useRef();

  const [copy, setCopy] = useState(false);

  const params = {limit: 20, page: 1};

  const [skuList, setSkuList] = useState([]);

  const [page, setPage] = useState(1);

  const [data, setData] = useState({});

  const [noPage, setNoPage] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const {loading, run} = useRequest({...skuV1List, data, params}, {manual: true});

  const init = async (newData) => {
    const res = await run({data: newData || data, params});
    setSkuList(isArray(res));
    setNoPage(isArray(res).length < 20);
    return isArray(res);
  };

  useEffect(() => {
    init();
  }, []);

  const searchOpen = () => {
    searchRef.current.searchOpen();
  };

  useImperativeHandle(ref, () => ({
    searchOpen
  }));

  const onLoadMore = async () => {
    const res = await run({data, params: {...params, page: page + 1}});
    setSkuList([...skuList, ...isArray(res)]);
    setPage(page + 1);
    setNoPage(isArray(res).length < 20);
  };

  const loadMore =
    (!noPage && !loading) ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>查看更多</Button>
      </div>
    ) : null;

  return <>
    <h3>
      待选物料
      <Button style={{float: 'right'}} type="link" onClick={() => {
        addRef.current.open(false);
        setCopy(false);
      }}>新增物料</Button>
    </h3>
    <GroupSku
      ref={searchRef}
      width="100%"
      align="start"
      noSearchButton
      onChange={(id, type) => {
        let newData = {};
        switch (type) {
          case 'skuClass':
            setSearchValue('');
            newData = {categoryId: id};
            break;
          case 'skuName':
            setSearchValue(id);
            newData = {keyWord: id};
            break;
          case 'parts':
            setSearchValue('');
            newData = {partsId: id};
            break;
          case 'reset':
            setSearchValue('');
            break;
          default:
            break;
        }
        setData(newData);
        init(newData);
      }}
    />
    <List
      className={styles.list}
      loading={loading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={skuList}
      renderItem={(item, index) => {
        const exit = value.find(valueItem => valueItem.skuId === item.skuId);
        return <List.Item
          style={{backgroundColor: index % 2 === 0 && '#f5f5f5'}}
          className={styles.item}
          actions={[
            <div className={styles.actions}>
              <Button
                size="small"
                // type="link"
                onClick={() => {
                  addRef.current.open({...item, copy: true});
                  setCopy(true);
                }}
              >
                复制
              </Button>
              {exit ? <div style={{width: 47}}>已添加</div> : <Button
                size="small"
                // type="link"
                onClick={() => {
                  onChange(item);
                }}
              >
                选择
              </Button>}
            </div>
          ]}
        >
          <List.Item.Meta
            title={<SearchValueFormat
              maxWidth="100%"
              searchValue={searchValue}
              label={item.standard || '-'}
            />}
            description={
              <SearchValueFormat
                maxWidth="100%"
                searchValue={searchValue}
                label={SkuRender(item) || '-'}
              />}
          />
        </List.Item>;
      }}
    />

    <AddSkuModal
      edit={copy}
      addRef={addRef}
      copy={copy}
      onSuccess={async () => {
        addRef.current.close();
        const list = await init({});
        onChange(list[0]);
      }}
    />
  </>;
};

export default React.forwardRef(PartsSelectSkus);
