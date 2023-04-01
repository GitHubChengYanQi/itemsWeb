import {Spin, Transfer} from 'antd';
import React, {useState} from 'react';
import {useRequest} from '@/util/Request';
import {userSelect} from '@/Config/ApiUrl/system/user';

const TranserUsers = ({
  value = [],
  onChange = () => {
  }
}) => {

  const [mockData, setMockData] = useState([]);

  const {loading} = useRequest(userSelect,
    {
      onSuccess: (res) => {
        const userList = res || [];
        setMockData(userList.map(item => ({
          key: item.value,
          title: item.label
        })));
      }
    }
  );

  const filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

  if (loading) {
    return <Spin spinning />;
  }

  return (
    <Transfer
      style={{justifyContent: 'center'}}
      titles={['账号列表', '已有权限']}
      listStyle={{
        width: 200,
        height: 'calc(50vh - 127px)',
      }}
      dataSource={mockData}
      showSearch
      filterOption={filterOption}
      targetKeys={value}
      onChange={onChange}
      render={(item) => item.title}
    />
  );
};
export default TranserUsers;
