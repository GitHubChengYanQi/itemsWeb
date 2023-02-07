import React, {useEffect, useState} from 'react';
import {Button, List} from 'antd';
import {DoubleRightOutlined} from '@ant-design/icons';
import styles from '../../../PartsEditV2/index.module.less';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import {useRequest} from '@/util/Request';
import {skuV1List} from '@/pages/Erp/sku/skuUrl';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';
import {isArray} from '@/util/Tools';
import SearchValueFormat from '@/components/SearchValueFormat';

const PartsSelectSkus = (
  {
    value = [],
    onChange = () => {
    },
  }
) => {

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
  };

  useEffect(() => {
    init();
  }, []);

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
    <GroupSku
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
      renderItem={(item) => {
        const exit = value.find(valueItem => valueItem.skuId === item.skuId);
        return <List.Item
          actions={[
            exit ? '已添加' : <Button
              size="large"
              type="link"
              onClick={() => {
                onChange(item);
              }}
            >
              <DoubleRightOutlined />
            </Button>
          ]}
        >
          <List.Item.Meta
            title={<SearchValueFormat
              maxWidth='100%'
              searchValue={searchValue}
              label={item.standard || '-'}
            />}
            description={
              <SearchValueFormat
                maxWidth='100%'
                searchValue={searchValue}
                label={SkuRender(item) || '-'}
              />}
          />
        </List.Item>;
      }}
    />
  </>;
};

export default PartsSelectSkus;
